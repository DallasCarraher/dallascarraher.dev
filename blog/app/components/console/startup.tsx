import { useEffect, useRef } from "react";
import { getClockOrbs } from "./clock";

export const STARTUP_DURATION = 6800;
type Vec = [number, number, number];
type Face = { vertices: Vec[]; shade: number; cap: boolean; glass: boolean };
const clamp = (n: number) => Math.max(0, Math.min(1, n));

/** Original perspective geometry, following the reference's overhead field and camera roll. */
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

    // A fixed grain map gives the silver caps the mottled, low-resolution BIOS finish.
    const texture = document.createElement("canvas");
    texture.width = texture.height = 64;
    const noise = texture.getContext("2d");
    if (noise) {
      const pixels = noise.createImageData(64, 64);
      for (let i = 0; i < pixels.data.length; i += 4) {
        const n = ((i * 73 + (i >> 5) * 19) % 71) + 135;
        pixels.data.set([n, n + 4, Math.min(255, n + 18), 255], i);
      }
      noise.putImageData(pixels, 0, 0);
    }
    const grain = ctx.createPattern(texture, "repeat");
    // X, Circle, Triangle, Square: keep the button colors distinct in the bloom.
    const buttonLights = ["65,125,255", "255,62,62", "45,255,145", "255,105,205"].map(
      (color, index) => {
        const sprite = document.createElement("canvas");
        sprite.width = sprite.height = 128;
        const light = sprite.getContext("2d");
        if (light) {
          const bloom = light.createRadialGradient(64, 64, 0, 64, 64, 64);
          bloom.addColorStop(0, "rgba(255,255,255,1)");
          bloom.addColorStop(0.045, `rgba(${color},1)`);
          bloom.addColorStop(0.14, `rgba(${color},.85)`);
          bloom.addColorStop(0.36, `rgba(${color},.28)`);
          bloom.addColorStop(0.7, `rgba(${color},.065)`);
          bloom.addColorStop(1, `rgba(${color},0)`);
          light.fillStyle = bloom;
          light.fillRect(0, 0, 128, 128);
        }
        return { sprite, phase: (index * Math.PI) / 2 + Math.PI / 4 };
      },
    );
    const indices = [
      [0, 3, 2, 1],
      [0, 1, 5, 4],
      [1, 2, 6, 5],
      [2, 3, 7, 6],
      [3, 0, 4, 7],
      [4, 5, 6, 7],
    ];
    const box = (x: number, z: number, h: number, radius: number, bottom = 0): Vec[] => [
      [x - radius, bottom, z - radius],
      [x + radius, bottom, z - radius],
      [x + radius, bottom, z + radius],
      [x - radius, bottom, z + radius],
      [x - radius, h, z - radius],
      [x + radius, h, z - radius],
      [x + radius, h, z + radius],
      [x - radius, h, z + radius],
    ];
    const towers: Face[] = [];
    for (let z = -5; z <= 5; z++)
      for (let x = -7; x <= 7; x++) {
        const hash = Math.sin((x + 9) * 127.1 + (z + 8) * 311.7) * 43758.5453;
        const seed = Math.floor((hash - Math.floor(hash)) * 23);
        if ((Math.abs(x) < 2 && Math.abs(z) < 2) || seed === 0 || seed === 7) continue;
        const h = 0.7 + (seed % 8) * 0.37;
        const vertices = box(x * 1.12, z * 1.12, h, 0.48);
        indices.forEach((face, index) =>
          towers.push({
            vertices: face.map((i) => vertices[i]),
            shade: index === 5 ? 130 + seed * 3.4 : 19 + (index % 3) * 14,
            cap: index === 5,
            glass: false,
          }),
        );
      }
    function draw(now: number) {
      if (!ctx) return;
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);
      if (t < 3.85) {
        const dive = clamp((t - 2.05) / 1.65);
        const advance = dive * dive;
        const camera: Vec = [0.25 * Math.sin(t * 0.2), 20 - advance * 18.7, 7 - advance * 6.8];
        const pitch = 0.34 - advance * 0.1;
        const roll = -0.035 + t * 0.012 + advance * 1.2;
        const focal = Math.min(width / 1.333, height) * 1.18;
        const project = ([x, y, z]: Vec): Vec => {
          const vx = x - camera[0],
            vy = y - camera[1],
            vz = z - camera[2];
          const up = vy * Math.sin(pitch) - vz * Math.cos(pitch);
          const depth = -vy * Math.cos(pitch) - vz * Math.sin(pitch);
          const rx = vx * Math.cos(roll) - up * Math.sin(roll);
          const ry = vx * Math.sin(roll) + up * Math.cos(roll);
          return [width / 2 + (rx * focal) / depth, height * 0.48 - (ry * focal) / depth, depth];
        };
        const faces = [...towers];
        // Reflective tumbling cubes hover above the field, rather than extra buildings.
        for (const [cx, cy, cz, size] of [
          [-5, 5, -3, 0.65],
          [4.5, 5.5, -2.5, 0.75],
          [-3.8, 4, 3.5, 0.7],
          [3, 4, 3, 0.55],
          [-0.4, 3, 0, 0.55],
        ]) {
          const a = t * 0.35 + cx;
          const b = t * 0.25 + cz;
          const vertices = box(0, 0, size, size, -size).map(([x, y, z]): Vec => {
            const rx = x * Math.cos(a) - z * Math.sin(a),
              rz = x * Math.sin(a) + z * Math.cos(a);
            return [
              cx + rx,
              cy + y * Math.cos(b) - rz * Math.sin(b),
              cz + y * Math.sin(b) + rz * Math.cos(b),
            ];
          });
          indices.forEach((face, i) =>
            faces.push({
              vertices: face.map((j) => vertices[j]),
              shade: [32, 145, 54, 180, 70, 210][i],
              cap: false,
              glass: true,
            }),
          );
        }
        const visible = faces
          .flatMap((face) => {
            const [a, b, c] = face.vertices;
            const ab = b.map((n, i) => n - a[i]),
              ac = c.map((n, i) => n - a[i]);
            const normal = [
              ab[1] * ac[2] - ab[2] * ac[1],
              ab[2] * ac[0] - ab[0] * ac[2],
              ab[0] * ac[1] - ab[1] * ac[0],
            ];
            if (normal.reduce((sum, n, i) => sum + n * (camera[i] - a[i]), 0) >= 0) return [];
            const points = face.vertices.map(project);
            if (points.some((p) => p[2] < 0.25)) return [];
            return [{ ...face, points, depth: points.reduce((sum, p) => sum + p[2], 0) / 4 }];
          })
          .sort((a, b) => b.depth - a.depth);
        const opacity = clamp(t / 0.28) * clamp((3.85 - t) / 0.5);
        ctx.globalAlpha = opacity;
        for (const face of visible) {
          ctx.beginPath();
          face.points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
          ctx.closePath();
          const shade = face.shade;
          const gradient = ctx.createLinearGradient(
            face.points[0][0],
            face.points[0][1],
            face.points[2][0] + 1,
            face.points[2][1] + 1,
          );
          gradient.addColorStop(0, `rgb(${shade * 0.8},${shade * 0.87},${shade})`);
          gradient.addColorStop(1, `rgb(${shade * 0.5},${shade * 0.58},${shade * 0.73})`);
          ctx.fillStyle = gradient;
          ctx.fill();
          if (face.cap && grain) {
            ctx.globalAlpha = opacity * 0.33;
            ctx.fillStyle = grain;
            ctx.fill();
            ctx.globalAlpha = opacity;
          }
          if (face.glass) {
            ctx.strokeStyle = "#8fa6c345";
            ctx.lineWidth = 0.8;
            ctx.stroke();
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
        glow.addColorStop(0, "rgba(57,89,222,.43)");
        glow.addColorStop(0.45, "rgba(30,55,145,.2)");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        // Sample the paths in world space so trails share the grid's camera roll,
        // perspective and dive, without depending on the display's frame rate.
        for (const { sprite, phase } of buttonLights) {
          for (let sample = 24; sample >= 0; sample--) {
            const at = t - sample * 0.012;
            if (at < 0) continue;
            const angle = phase + at * 0.48;
            const orbit = 4.4 - clamp((at - 2.05) / 1.65) * 1.6;
            const [x, y, depth] = project([
              Math.cos(angle) * orbit,
              4.2 + Math.sin(at * 0.9 + phase) * 0.65,
              Math.sin(angle) * orbit,
            ]);
            if (depth < 0.5) continue;
            const radius = Math.min((focal * 1.05) / depth, Math.min(width, height) * 0.24);
            const exposure = sample === 0 ? 1 : (1 - sample / 25) ** 2 * 0.09;
            ctx.globalAlpha = opacity * clamp(t / 0.55) * exposure;
            ctx.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2);
          }
        }
        ctx.restore();
        ctx.globalAlpha = 1;
      }
      if (t > 4.3) {
        const reveal = clamp((t - 4.3) / 1.9);
        const ease = 1 - Math.pow(1 - reveal, 3);
        const scene = document.querySelector(".scene")?.getBoundingClientRect();
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
            Math.cos(angle) * width * 0.36 * (1 - ease);
          const y =
            centerY +
            orb.y * scale * perspective * ease +
            Math.sin(angle) * height * 0.32 * (1 - ease);
          const r = 24 + 9 * reveal;
          const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
          glow.addColorStop(0, `rgba(240,255,255,${reveal})`);
          glow.addColorStop(0.1, `rgba(140,220,255,${reveal * 0.85})`);
          glow.addColorStop(0.35, `rgba(20,100,230,${reveal * 0.35})`);
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.fillRect(x - r, y - r, r * 2, r * 2);
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
