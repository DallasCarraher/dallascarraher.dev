import { useEffect, useRef } from "react";
import { getClockOrbs } from "./clock";

export const STARTUP_DURATION = 6800;

/** Original geometry, paced to the tower → dive → particle reveal in the reference. */
export function StartupScene() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const start = performance.now();
    let frame = 0;
    let width = 0;
    let height = 0;
    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    function draw(now: number) {
      if (!ctx) return;
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);
      if (t < 4) {
        const fade = Math.min(1, t / 0.5) * Math.max(0, Math.min(1, (4 - t) / 0.65));
        const dive = Math.max(0, (t - 2.1) / 1.9);
        const zoom = 1 + dive * dive * 10;
        const rotation = -0.12 + t * 0.035 + dive * 0.65;
        const unit = Math.min(width, height) * 0.065 * zoom;
        const project = (x: number, y: number, z: number): [number, number] => {
          const rx = x * Math.cos(rotation) - z * Math.sin(rotation);
          const rz = x * Math.sin(rotation) + z * Math.cos(rotation);
          return [width / 2 + (rx - rz * 0.35) * unit, height * 0.48 + (rz * 0.6 - y) * unit];
        };
        ctx.globalAlpha = fade;
        // Back-to-front columns with deterministic, uneven heights.
        for (let z = -5; z <= 5; z++)
          for (let x = -6; x <= 6; x++) {
            const seed = ((x + 9) * 31 + (z + 8) * 17) % 19;
            if (seed % 4 === 0 || Math.abs(x) + Math.abs(z) > 9) continue;
            const h = 0.3 + (seed % 8) * 0.25;
            const w = 0.36;
            const v = [
              [x - w, 0, z - w],
              [x + w, 0, z - w],
              [x + w, 0, z + w],
              [x - w, 0, z + w],
              [x - w, h, z - w],
              [x + w, h, z - w],
              [x + w, h, z + w],
              [x - w, h, z + w],
            ].map(([px, py, pz]) => project(px, py, pz));
            const brightness = Math.max(
              25,
              100 - (Math.abs(x) + Math.abs(z)) * 6 + (seed % 4) * 15,
            );
            for (const [indices, shade] of [
              [[0, 1, 5, 4], 0.48],
              [[1, 2, 6, 5], 0.7],
              [[4, 5, 6, 7], 1],
            ] as const) {
              ctx.fillStyle = `rgb(${brightness * shade * 0.72},${brightness * shade * 0.83},${brightness * shade})`;
              ctx.beginPath();
              indices.forEach((index, i) =>
                i ? ctx.lineTo(...v[index]) : ctx.moveTo(...v[index]),
              );
              ctx.closePath();
              ctx.fill();
            }
          }
        const glow = ctx.createRadialGradient(
          width / 2,
          height * 0.48,
          0,
          width / 2,
          height * 0.48,
          Math.min(width, height) * 0.35,
        );
        glow.addColorStop(0, "rgba(88,135,235,.23)");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;
      }
      if (t > 4.15) {
        const reveal = Math.min(1, (t - 4.15) / 1.5);
        const ease = 1 - Math.pow(1 - reveal, 3);
        const scene = document.querySelector(".scene canvas")?.getBoundingClientRect();
        const scale = scene
          ? Math.min(scene.width, scene.height) * 0.32
          : Math.min(width, height) * 0.12;
        const centerX = scene ? scene.left + scene.width * 0.5 : width / 2;
        const centerY = scene ? scene.top + scene.height * 0.57 : height * 0.48;
        getClockOrbs(new Date()).forEach((orb, index) => {
          const angle = (index * Math.PI * 2) / 7;
          const perspective = 800 / (800 - orb.z * scale);
          const x =
            centerX +
            orb.x * scale * perspective * ease +
            Math.cos(angle) * width * 0.4 * (1 - ease);
          const y =
            centerY +
            orb.y * scale * perspective * ease +
            Math.sin(angle) * height * 0.35 * (1 - ease);
          const r = 24 + 9 * reveal;
          const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
          glow.addColorStop(0, `rgba(240,255,255,${reveal})`);
          glow.addColorStop(0.1, `rgba(140,220,255,${reveal * 0.85})`);
          glow.addColorStop(0.35, `rgba(20,100,230,${reveal * 0.35})`);
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      if (t < STARTUP_DURATION / 1000) frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);
  return <canvas ref={ref} className="startup-scene" aria-hidden="true" />;
}
