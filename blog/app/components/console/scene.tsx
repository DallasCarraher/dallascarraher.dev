import { useEffect, useRef } from "react";
import { getClockOrbs } from "./clock";

/** Seven clock-driven particles, with the reference’s motion and perspective. */
export function Scene() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    // Reduced motion freezes the current clock pattern until motion is re-enabled.
    let frozenTime = new Date();
    let width = 0;
    let height = 0;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      const size = Math.min(width, height);
      const radius = size * 0.32;
      const date = motion.matches ? frozenTime : new Date();
      const project = (at: Date) =>
        getClockOrbs(at).map((orb) => {
          const perspective = 800 / (800 - orb.z * radius);
          return {
            x: width * 0.5 + orb.x * radius * perspective,
            y: height * 0.57 + orb.y * radius * perspective,
            depth: orb.z,
            perspective,
          };
        });
      if (!motion.matches) {
        // Short, fading exposure trails, sampled by time rather than frame count.
        let previous = project(new Date(date.getTime() - 360));
        for (let sample = 1; sample <= 18; sample++) {
          const age = 360 - sample * 20;
          const at = new Date(date.getTime() - age);
          const points = project(at);
          if (at.getMinutes() === date.getMinutes()) {
            const intensity = (1 - age / 360) ** 2;
            ctx.strokeStyle = `rgba(35, 127, 230, ${intensity * 0.36})`;
            ctx.lineWidth = Math.max(0.6, size * 0.008 * intensity);
            ctx.shadowColor = "#168cde";
            ctx.shadowBlur = size * 0.018;
            points.forEach((point, index) => {
              // Do not streak across a clock rollover.
              if (
                Math.hypot(point.x - previous[index].x, point.y - previous[index].y) >
                radius * 0.5
              )
                return;
              ctx.beginPath();
              ctx.moveTo(previous[index].x, previous[index].y);
              ctx.lineTo(point.x, point.y);
              ctx.stroke();
            });
          }
          previous = points;
        }
        ctx.shadowBlur = 0;
      }
      const orbs = project(date).sort((a, b) => a.depth - b.depth);
      for (const orb of orbs) {
        const glowRadius = size * 0.18 * orb.perspective;
        const glow = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, glowRadius);
        glow.addColorStop(0, "rgba(255, 255, 238, 1)");
        glow.addColorStop(0.045, "rgba(238, 255, 251, 1)");
        glow.addColorStop(0.09, "rgba(164, 236, 255, .95)");
        glow.addColorStop(0.19, "rgba(67, 197, 255, .65)");
        glow.addColorStop(0.36, "rgba(0, 132, 232, .35)");
        glow.addColorStop(0.65, "rgba(0, 59, 166, .12)");
        glow.addColorStop(1, "rgba(0, 30, 100, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!motion.matches && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function restart() {
      cancelAnimationFrame(frame);
      if (!document.hidden) frame = requestAnimationFrame(draw);
    }
    function onMotionChange() {
      frozenTime = new Date();
      restart();
    }
    function resize() {
      if (!canvas || !ctx) return;
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      restart();
    }
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    motion.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", restart);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", restart);
    };
  }, []);
  return (
    <div className="scene" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
