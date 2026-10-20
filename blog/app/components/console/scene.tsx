import { useEffect, useRef } from "react";

/** The BIOS menu’s eight softly glowing, rotating particles. */
export function Scene() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let time = 0;
    let last = 0;
    let width = 0;
    let height = 0;

    function draw(now: number) {
      if (!ctx || !canvas) return;
      if (last) time += Math.min(now - last, 40) / 1000;
      last = now;
      ctx.clearRect(0, 0, width, height);
      const size = Math.min(width, height);
      const radius = size * 0.32;
      const phase = motion.matches ? 0.35 : time * 0.3 + 0.35;
      const tilt = motion.matches ? 0.5 : Math.sin(time * 0.12 + 0.5);
      const orbs = Array.from({ length: 8 }, (_, i) => {
        const angle = (i * Math.PI) / 4 + phase;
        const x = Math.cos(angle);
        const z = Math.sin(angle);
        return {
          x: width * 0.5 + x * radius,
          y: height * 0.57 + z * radius * (0.45 + tilt * 0.45),
          depth: z * (1 - Math.abs(tilt)),
        };
      }).sort((a, b) => a.depth - b.depth);
      for (const orb of orbs) {
        const glowRadius = size * (0.18 + orb.depth * 0.025);
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
      last = 0;
      if (!document.hidden) frame = requestAnimationFrame(draw);
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
    motion.addEventListener("change", restart);
    document.addEventListener("visibilitychange", restart);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener("change", restart);
      document.removeEventListener("visibilitychange", restart);
    };
  }, []);
  return (
    <div className="scene" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
