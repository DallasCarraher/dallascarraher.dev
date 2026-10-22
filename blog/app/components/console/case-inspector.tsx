import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Game } from "./games";

type Vector = [number, number, number];
type Quaternion = [number, number, number, number];
type Point = { x: number; y: number };
const identity: Quaternion = [0, 0, 0, 1];
const clampZoom = (value: number) => Math.max(0.65, Math.min(2.8, value));
const normalize = (q: Quaternion): Quaternion => {
  const length = Math.hypot(...q) || 1;
  return q.map((value) => value / length) as Quaternion;
};
const multiply = ([x, y, z, w]: Quaternion, [a, b, c, d]: Quaternion): Quaternion =>
  normalize([
    w * a + x * d + y * c - z * b,
    w * b - x * c + y * d + z * a,
    w * c + x * b - y * a + z * d,
    w * d - x * a - y * b - z * c,
  ]);
const axis = (index: number, degrees: number): Quaternion => {
  const angle = (degrees * Math.PI) / 360;
  const q: Quaternion = [0, 0, 0, Math.cos(angle)];
  q[index] = Math.sin(angle);
  return q;
};
function matrix([x, y, z, w]: Quaternion) {
  return `matrix3d(${[
    1 - 2 * (y * y + z * z),
    2 * (x * y + z * w),
    2 * (x * z - y * w),
    0,
    2 * (x * y - z * w),
    1 - 2 * (x * x + z * z),
    2 * (y * z + x * w),
    0,
    2 * (x * z + y * w),
    2 * (y * z - x * w),
    1 - 2 * (x * x + y * y),
    0,
    0,
    0,
    0,
    1,
  ].join(",")})`;
}

export function CaseInspector({
  game,
  children,
  onClose,
  onOpen,
}: {
  game: Game;
  children: ReactNode;
  onClose: () => void;
  onOpen: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, Point>());
  const [orientation, setOrientation] = useState<Quaternion>(axis(1, -12));
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const turn = (index: number, degrees: number) =>
    setOrientation((q) => multiply(axis(index, degrees), q));

  useEffect(() => {
    const modal = dialog.current!;
    const surface = viewport.current!;
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modal.showModal();
    surface.focus({ preventScroll: true });
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      setZoom((value) => clampZoom(value * Math.exp(-event.deltaY * 0.0015)));
    };
    surface.addEventListener("wheel", wheel, { passive: false });
    return () => {
      surface.removeEventListener("wheel", wheel);
      modal.close();
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  const project = (point: Point): Vector => {
    const bounds = viewport.current!.getBoundingClientRect();
    const radius = Math.min(bounds.width, bounds.height) * 0.48;
    const x = (point.x - bounds.left - bounds.width / 2) / radius;
    const y = (point.y - bounds.top - bounds.height / 2) / radius;
    const length = Math.hypot(x, y);
    return length > 1 ? [x / length, y / length, 0] : [x, y, Math.sqrt(1 - length * length)];
  };
  const reset = () => {
    setOrientation(identity);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  const end = (id: number) => {
    pointers.current.delete(id);
    if (pointers.current.size === 0) viewport.current?.removeAttribute("data-dragging");
  };

  return (
    <dialog
      ref={dialog}
      className="case-inspector"
      aria-labelledby="inspector-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        // The console and shelf have their own arrow/Escape shortcuts.
        event.stopPropagation();
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
        }
      }}
    >
      <header className="inspector-header">
        <div>
          <p className="eyebrow">ARTWORK / CASE INSPECTOR</p>
          <h2 id="inspector-title">{game.title}</h2>
        </div>
        <button className="inspector-close" aria-label="Close case inspector" onClick={onClose}>
          ×
        </button>
      </header>
      <div
        ref={viewport}
        className="inspector-viewport"
        role="button"
        tabIndex={0}
        aria-label={`Rotate ${game.title} case`}
        aria-describedby="inspector-help"
        onPointerDown={(event) => {
          if (event.button > 2) return;
          event.preventDefault();
          event.currentTarget.focus({ preventScroll: true });
          event.currentTarget.setPointerCapture(event.pointerId);
          pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
          event.currentTarget.setAttribute("data-dragging", "true");
        }}
        onPointerMove={(event) => {
          const previous = pointers.current.get(event.pointerId);
          if (!previous) return;
          const oldPoints = [...pointers.current.values()];
          const next = { x: event.clientX, y: event.clientY };
          pointers.current.set(event.pointerId, next);
          if (pointers.current.size >= 2) {
            const [a, b] = oldPoints;
            const [c, d] = [...pointers.current.values()];
            setPan((value) => ({
              x: value.x + (c.x + d.x - a.x - b.x) / 2,
              y: value.y + (c.y + d.y - a.y - b.y) / 2,
            }));
            const oldDistance = Math.hypot(a.x - b.x, a.y - b.y);
            const distance = Math.hypot(c.x - d.x, c.y - d.y);
            if (oldDistance > 10) setZoom((value) => clampZoom((value * distance) / oldDistance));
            const angle = Math.atan2(d.y - c.y, d.x - c.x) - Math.atan2(b.y - a.y, b.x - a.x);
            turn(2, (((angle * 180) / Math.PI + 540) % 360) - 180);
          } else if (event.buttons === 2 || event.buttons === 4 || event.altKey) {
            setPan((value) => ({
              x: value.x + next.x - previous.x,
              y: value.y + next.y - previous.y,
            }));
          } else if (event.shiftKey) {
            turn(2, (next.x - previous.x) * 0.7);
          } else {
            const [x, y, z] = project(previous);
            const [a, b, c] = project(next);
            const rotation: Quaternion = [
              y * c - z * b,
              z * a - x * c,
              x * b - y * a,
              1 + x * a + y * b + z * c,
            ];
            // Apply a virtual trackball in screen space, without Euler-axis locks.
            if (Math.hypot(...rotation) > 0.0001)
              setOrientation((q) => multiply(normalize(rotation), q));
          }
        }}
        onPointerUp={(event) => {
          end(event.pointerId);
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={(event) => end(event.pointerId)}
        onLostPointerCapture={(event) => end(event.pointerId)}
        onContextMenu={(event) => event.preventDefault()}
        onKeyDown={(event) => {
          const rotations: Record<string, [number, number]> = {
            ArrowLeft: [1, -12],
            ArrowRight: [1, 12],
            ArrowUp: [0, -12],
            ArrowDown: [0, 12],
            q: [2, -12],
            e: [2, 12],
          };
          const rotation = rotations[event.key];
          if (rotation) {
            event.preventDefault();
            turn(...rotation);
          } else if (["+", "=", "-"].includes(event.key)) {
            event.preventDefault();
            setZoom((value) => clampZoom(value + (event.key === "-" ? -0.15 : 0.15)));
          } else if (event.key.toLowerCase() === "r") {
            event.preventDefault();
            reset();
          }
        }}
      >
        <div className="inspector-orbit">
          <div
            className="inspector-model"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) ${matrix(orientation)}`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
      <p id="inspector-help" className="inspector-help">
        <span className="inspector-desktop-help">
          Drag: rotate · Right-drag: pan · Shift-drag: roll · Scroll: zoom
        </span>
        <span className="inspector-touch-help">
          Drag to rotate · Two fingers to pan, pinch & twist
        </span>
      </p>
      <div className="inspector-presets" aria-label="Case views">
        <button onClick={() => setOrientation(identity)}>Front</button>
        <button onClick={() => setOrientation(axis(1, 180))}>Back</button>
        <button onClick={() => setOrientation(axis(1, 90))}>Spine</button>
        <button aria-label="Roll case left" onClick={() => turn(2, -15)}>
          ↶
        </button>
        <button aria-label="Roll case right" onClick={() => turn(2, 15)}>
          ↷
        </button>
        <button onClick={reset}>Reset view</button>
      </div>
      <footer className="inspector-footer">
        <label>
          Zoom{" "}
          <input
            aria-label="Case zoom"
            type="range"
            min="0.65"
            max="2.8"
            step="0.05"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
          />
          <output>{Math.round(zoom * 100)}%</output>
        </label>
        <button className="inspector-open" onClick={onOpen}>
          Open case ↗
        </button>
      </footer>
    </dialog>
  );
}
