type Point = { x: number; y: number; z: number };

/** Translucent browser crystals, drawn as depth-sorted faces around the clock. */
export function drawFixture(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  seconds: number,
) {
  const size = Math.min(width, height);
  const turn = 0.22 + Math.sin(seconds * 0.045) * 0.25;
  const tilt = -0.24;
  const project = ({ x, y, z }: Point) => {
    const rx = x * Math.cos(turn) + z * Math.sin(turn);
    const rz = z * Math.cos(turn) - x * Math.sin(turn);
    const ry = y * Math.cos(tilt) - rz * Math.sin(tilt);
    const depth = y * Math.sin(tilt) + rz * Math.cos(tilt);
    const scale = 2.8 / (2.8 - depth);
    return { x: width / 2 + rx * size * scale, y: height / 2 + ry * size * scale, z: depth };
  };
  const faces: { points: Point[]; depth: number; cube: boolean; shade: number }[] = [];
  function prism(angle: number, radius: number, length: number, thickness: number, cube = false) {
    const vertices: Point[] = [];
    const spin = seconds * (cube ? 0.19 : 0.055) + angle;
    for (const end of [-1, 1]) {
      for (let corner = 0; corner < 4; corner++) {
        const a = Math.PI / 4 + (corner * Math.PI) / 2 + spin;
        const tangent = Math.cos(a) * thickness;
        const radial = radius + (end * length) / 2;
        vertices.push(
          project({
            x: Math.sin(angle) * radial + Math.cos(angle) * tangent,
            y: Math.cos(angle) * radial - Math.sin(angle) * tangent,
            z: Math.sin(a) * thickness + (cube ? 0.08 : -0.08),
          }),
        );
      }
    }
    const indices = [
      [0, 1, 2, 3],
      [4, 7, 6, 5],
      [0, 4, 5, 1],
      [1, 5, 6, 2],
      [2, 6, 7, 3],
      [3, 7, 4, 0],
    ];
    indices.forEach((indices, shade) => {
      const points = indices.map((index) => vertices[index]);
      faces.push({ points, depth: points.reduce((sum, p) => sum + p.z, 0) / 4, cube, shade });
    });
  }
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 + seconds * 0.035;
    prism(angle, 0.34, 0.24 + 0.035 * Math.sin(i * 2.1), 0.025);
  }
  for (let i = 0; i < 4; i++) {
    prism((i / 4) * Math.PI * 2 + 0.65 + seconds * 0.035, 0.32, 0.12, 0.085, true);
  }
  faces.sort((a, b) => a.depth - b.depth);
  ctx.save();
  ctx.lineWidth = Math.max(0.5, size / 850);
  for (const { points, cube, shade } of faces) {
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    const alpha = 0.09 + (shade % 3) * 0.045;
    ctx.fillStyle = cube ? `rgba(66, 93, 211, ${alpha + 0.06})` : `rgba(91, 159, 214, ${alpha})`;
    ctx.strokeStyle = cube ? "rgba(126, 151, 255, .42)" : "rgba(132, 204, 255, .36)";
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}
