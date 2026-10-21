import { useEffect, useRef } from "react";
import { drawFixture } from "./fixture";
import { getClockOrbs } from "./clock";

/** Seven clock-driven particles, with the reference’s motion and perspective. */
export function Scene({ fixture = false }: { fixture?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const scene = canvas.parentElement;
    if (!scene) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Rasterize the soft particle once; reuse it at each particle's projected size.
    const glowSprite = document.createElement("canvas");
    glowSprite.width = glowSprite.height = 256;
    const glowContext = glowSprite.getContext("2d");
    if (!glowContext) return;
    const glow = glowContext.createRadialGradient(128, 128, 0, 128, 128, 128);
    glow.addColorStop(0, "rgba(255, 255, 238, 1)");
    glow.addColorStop(0.045, "rgba(238, 255, 251, 1)");
    glow.addColorStop(0.09, "rgba(164, 236, 255, .95)");
    glow.addColorStop(0.19, "rgba(67, 197, 255, .65)");
    glow.addColorStop(0.36, "rgba(0, 132, 232, .35)");
    glow.addColorStop(0.65, "rgba(0, 59, 166, .12)");
    glow.addColorStop(1, "rgba(0, 30, 100, 0)");
    glowContext.fillStyle = glow;
    glowContext.fillRect(0, 0, 256, 256);
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    // Reduced motion freezes the current clock pattern until motion is re-enabled.
    let frozenTime = new Date();
    let width = 0;
    let height = 0;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(-width * 0.25, -height * 0.25, width * 1.5, height * 1.5);
      const size = Math.min(width, height);
      const radius = size * (fixture ? 0.19 : 0.32);
      const date = motion.matches ? frozenTime : new Date();
      if (fixture) drawFixture(ctx, width, height, date.getTime() / 1000);
      const project = (at: Date) =>
        getClockOrbs(at).map((orb) => {
          const perspective = 800 / (800 - orb.z * radius);
          return {
            x: width * 0.5 + orb.x * radius * perspective,
            y: height * (fixture ? 0.5 : 0.57) + orb.y * radius * perspective,
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
            ctx.beginPath();
            points.forEach((point, index) => {
              // Do not streak across a clock rollover.
              if (
                Math.hypot(point.x - previous[index].x, point.y - previous[index].y) >
                radius * 0.5
              )
                return;
              ctx.moveTo(previous[index].x, previous[index].y);
              ctx.lineTo(point.x, point.y);
            });
            // Layer a faint halo and a bright core without per-segment blur filters.
            const lineWidth = Math.max(0.6, size * 0.008 * intensity);
            ctx.strokeStyle = `rgba(22, 140, 222, ${intensity * 0.045})`;
            ctx.lineWidth = lineWidth + size * 0.018;
            ctx.stroke();
            ctx.strokeStyle = `rgba(35, 127, 230, ${intensity * 0.36})`;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
          }
          previous = points;
        }
      }
      const orbs = project(date).sort((a, b) => a.depth - b.depth);
      for (const orb of orbs) {
        const glowRadius = size * (fixture ? 0.105 : 0.18) * orb.perspective;
        ctx.drawImage(
          glowSprite,
          orb.x - glowRadius,
          orb.y - glowRadius,
          glowRadius * 2,
          glowRadius * 2,
        );
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
      if (!canvas || !ctx || !scene) return;
      const bounds = scene.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * 1.5 * ratio);
      canvas.height = Math.round(height * 1.5 * ratio);
      const scaleX = canvas.width / (width * 1.5);
      const scaleY = canvas.height / (height * 1.5);
      ctx.setTransform(scaleX, 0, 0, scaleY, width * 0.25 * scaleX, height * 0.25 * scaleY);
      restart();
    }
    const observer = new ResizeObserver(resize);
    observer.observe(scene);
    motion.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", restart);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", restart);
    };
  }, [fixture]);
  return (
    <div className="scene" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
