import { useEffect, useRef, type PointerEvent } from "react";
import type { Game } from "./games";

// Angular velocity is in degrees/ms. Light bearing friction gives a long, natural coast.
const FRICTION = 4200;
const SAMPLE_WINDOW = 90;
type Drag = {
  id: number;
  angle: number | null;
  travel: number;
  started: number;
  moved: number;
  momentum: number;
  samples: { time: number; travel: number }[];
};

export function SpinningDisc({ game }: { game: Game }) {
  const disc = useRef<HTMLButtonElement>(null);
  const rotation = useRef(0);
  const velocity = useRef(0);
  const drag = useRef<Drag | null>(null);
  const frame = useRef(0);
  const reducedMotion = useRef(false);

  const paint = () => {
    disc.current?.style.setProperty("--disc-rotation", `${rotation.current}deg`);
  };

  const coast = () => {
    cancelAnimationFrame(frame.current);
    if (reducedMotion.current) {
      velocity.current = 0;
      return;
    }
    let previous = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(now - previous, 64);
      previous = now;
      const decay = Math.exp(-elapsed / FRICTION);
      rotation.current += velocity.current * FRICTION * (1 - decay);
      velocity.current *= decay;
      paint();
      if (Math.abs(velocity.current) > 0.003) frame.current = requestAnimationFrame(tick);
      else velocity.current = 0;
    };
    frame.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    disc.current?.focus({ preventScroll: true });
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => {
      cancelAnimationFrame(frame.current);
      velocity.current = 0;
      drag.current = null;
      disc.current?.removeAttribute("data-dragging");
    };
    const update = () => {
      reducedMotion.current = motion.matches;
      if (motion.matches) stop();
    };
    update();
    motion.addEventListener("change", update);
    document.addEventListener("visibilitychange", stop);
    window.addEventListener("blur", stop);
    return () => {
      stop();
      motion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", stop);
      window.removeEventListener("blur", stop);
    };
  }, []);

  const angleAt = (event: PointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    if (Math.hypot(x, y) < bounds.width * 0.09) return null;
    return Math.atan2(y, x) * (180 / Math.PI);
  };

  const release = (event: PointerEvent<HTMLButtonElement>) => {
    const gesture = drag.current;
    if (gesture?.id !== event.pointerId) return;
    const now = performance.now();
    const first = gesture.samples[0];
    const last = gesture.samples.at(-1)!;
    const flick =
      event.type !== "pointercancel" && now - gesture.moved < 120 && Math.abs(gesture.travel) > 2;
    // Add the new stroke to the momentum carried into this grab. Reverse strokes brake it.
    velocity.current = flick
      ? gesture.momentum * Math.exp(-(now - gesture.started) / FRICTION) +
        (last.travel - first.travel) / Math.max(8, now - first.time)
      : 0;
    drag.current = null;
    event.currentTarget.removeAttribute("data-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    if (flick) coast();
  };

  const nudge = (direction: number) => {
    rotation.current += direction * 30;
    velocity.current += direction * 0.45;
    paint();
    coast();
  };

  return (
    <div className="game-disc-stage">
      <button
        ref={disc}
        className="game-disc"
        aria-label={`Spin ${game.title} disc`}
        aria-describedby="disc-instructions"
        onPointerDown={(event) => {
          if (!event.isPrimary || event.button !== 0 || drag.current) return;
          const angle = angleAt(event);
          if (angle === null) return;
          cancelAnimationFrame(frame.current);
          const now = performance.now();
          event.currentTarget.focus({ preventScroll: true });
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.setAttribute("data-dragging", "true");
          drag.current = {
            id: event.pointerId,
            angle,
            travel: 0,
            started: now,
            moved: now,
            momentum: velocity.current,
            samples: [{ time: now, travel: 0 }],
          };
          velocity.current = 0;
        }}
        onPointerMove={(event) => {
          const gesture = drag.current;
          if (gesture?.id !== event.pointerId) return;
          const angle = angleAt(event);
          if (angle === null || gesture.angle === null) {
            gesture.angle = angle;
            gesture.samples = [{ time: performance.now(), travel: gesture.travel }];
            return;
          }
          const now = performance.now();
          const delta = ((angle - gesture.angle + 540) % 360) - 180;
          gesture.angle = angle;
          if (Math.abs(delta) < 0.01) return;
          // A deliberate hold grabs the disc; quick re-grabs keep its stored momentum.
          if (now - gesture.moved >= 120) gesture.momentum = 0;
          gesture.moved = now;
          gesture.travel += delta;
          gesture.samples.push({ time: now, travel: gesture.travel });
          while (gesture.samples.length > 2 && gesture.samples[1].time < now - SAMPLE_WINDOW)
            gesture.samples.shift();
          rotation.current += delta;
          paint();
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={() => {
          if (drag.current) {
            drag.current = null;
            velocity.current = 0;
            disc.current?.removeAttribute("data-dragging");
          }
        }}
        onKeyDown={(event) => {
          if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
            event.preventDefault();
            nudge(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
        onClick={(event) => {
          if (event.detail === 0) nudge(1);
        }}
        onContextMenu={(event) => event.preventDefault()}
      >
        <img
          src={game.disc}
          alt={`${game.title} PlayStation 2 disc`}
          width="1280"
          height="1280"
          draggable={false}
        />
      </button>
    </div>
  );
}
