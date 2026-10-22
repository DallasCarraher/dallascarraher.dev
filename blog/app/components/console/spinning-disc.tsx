import { useEffect, useRef, type PointerEvent } from "react";
import type { Game } from "./games";

export function SpinningDisc({ game }: { game: Game }) {
  const disc = useRef<HTMLButtonElement>(null);
  const rotation = useRef(0);
  const velocity = useRef(0);
  const drag = useRef<{ id: number; angle: number; time: number } | null>(null);
  const frame = useRef(0);
  const reducedMotion = useRef(false);

  const paint = () => {
    disc.current?.style.setProperty("--disc-rotation", `${rotation.current}deg`);
  };

  const coast = () => {
    cancelAnimationFrame(frame.current);
    if (reducedMotion.current) return;
    let previous = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(now - previous, 32);
      previous = now;
      rotation.current += velocity.current * elapsed;
      velocity.current *= Math.exp(-elapsed / 900);
      paint();
      if (Math.abs(velocity.current) > 0.003) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    disc.current?.focus({ preventScroll: true });
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reducedMotion.current = motion.matches;
      if (motion.matches) cancelAnimationFrame(frame.current);
    };
    const stop = () => {
      cancelAnimationFrame(frame.current);
      velocity.current = 0;
    };
    update();
    motion.addEventListener("change", update);
    document.addEventListener("visibilitychange", stop);
    return () => {
      stop();
      motion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", stop);
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
    if (drag.current?.id !== event.pointerId) return;
    const flick = event.type !== "pointercancel" && performance.now() - drag.current.time < 100;
    drag.current = null;
    event.currentTarget.removeAttribute("data-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    if (flick) coast();
  };

  const nudge = (direction: number) => {
    rotation.current += direction * 30;
    velocity.current = direction * 0.3;
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
          if (!event.isPrimary || event.button !== 0) return;
          const angle = angleAt(event);
          if (angle === null) return;
          cancelAnimationFrame(frame.current);
          velocity.current = 0;
          event.currentTarget.focus({ preventScroll: true });
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.setAttribute("data-dragging", "true");
          drag.current = { id: event.pointerId, angle, time: performance.now() };
        }}
        onPointerMove={(event) => {
          const last = drag.current;
          if (last?.id !== event.pointerId) return;
          const angle = angleAt(event);
          if (angle === null) return;
          const now = performance.now();
          const delta = ((angle - last.angle + 540) % 360) - 180;
          rotation.current += delta;
          velocity.current = Math.max(-2, Math.min(2, delta / Math.max(8, now - last.time)));
          drag.current = { id: event.pointerId, angle, time: now };
          paint();
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={() => {
          drag.current = null;
          disc.current?.removeAttribute("data-dragging");
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
