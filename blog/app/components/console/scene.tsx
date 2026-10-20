import { useEffect, useRef } from "react";

/** Decorative projected geometry; the document remains usable without canvas. */
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
      const scale = Math.min(width, height) * 0.33;
      const cx = width * 0.5;
      const cy = height * 0.5;
      const angle = motion.matches ? 0.5 : time * 0.09;
      const project = (x: number, y: number, z: number): [number, number] => {
        const rx = x * Math.cos(angle) - z * Math.sin(angle);
        const rz = x * Math.sin(angle) + z * Math.cos(angle);
        const depth = 3.8 / (3.8 + rz);
        return [cx + rx * scale * depth, cy + (y * 0.84 + rz * 0.32) * scale * depth];
      };
      // Architectural echoes of the console's startup towers.
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const x = Math.cos(a) * 1.15;
        const z = Math.sin(a) * 1.15;
        const h = 0.25 + ((i * 7) % 9) * 0.09;
        const w = 0.085;
        const vertices = [
          [x - w, 0.28, z - w],
          [x + w, 0.28, z - w],
          [x + w, 0.28, z + w],
          [x - w, 0.28, z + w],
          [x - w, 0.28 - h, z - w],
          [x + w, 0.28 - h, z - w],
          [x + w, 0.28 - h, z + w],
          [x - w, 0.28 - h, z + w],
        ].map(([px, py, pz]) => project(px, py, pz));
        ctx.strokeStyle = "rgba(99, 134, 191, 0.16)";
        ctx.fillStyle = "rgba(36, 57, 87, 0.06)";
        for (const face of [
          [0, 1, 5, 4],
          [1, 2, 6, 5],
          [4, 5, 6, 7],
        ]) {
          ctx.beginPath();
          face.forEach((v, j) => (j ? ctx.lineTo(...vertices[v]) : ctx.moveTo(...vertices[v])));
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }
      const orbs = Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4 + (motion.matches ? 0 : time * 0.38);
        return {
          x: Math.cos(a) * 0.65,
          y: Math.sin(a * 2 + time * 0.07) * 0.19 - 0.08,
          z: Math.sin(a) * 0.65,
        };
      }).sort((a, b) => b.z - a.z);
      for (const orb of orbs) {
        const [x, y] = project(orb.x, orb.y, orb.z);
        const radius = scale * (0.14 - orb.z * 0.025);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
        glow.addColorStop(0, "rgba(239, 253, 255, 1)");
        glow.addColorStop(0.07, "rgba(190, 235, 255, .95)");
        glow.addColorStop(0.2, "rgba(89, 171, 255, .55)");
        glow.addColorStop(0.5, "rgba(39, 104, 226, .15)");
        glow.addColorStop(1, "rgba(24, 65, 170, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
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
      <div className="scene-halo" />
      <canvas ref={ref} />
      <div className="scene-caption">
        PERSONAL SYSTEM <span>•</span> DC / 01
      </div>
    </div>
  );
}
