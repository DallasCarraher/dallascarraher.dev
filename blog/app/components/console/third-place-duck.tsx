import { useCallback, useEffect, useId, useRef, useState } from "react";
import "./third-place-duck.css";

export function ThirdPlaceDuck({
  onSecretHold,
  menu = false,
}: {
  onSecretHold?: () => void;
  menu?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const bubbleId = useId();
  const duck = useRef<HTMLDivElement>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hold = useRef<{ id: number; x: number; y: number } | null>(null);
  const cancelHold = useCallback(() => {
    clearTimeout(holdTimer.current);
    hold.current = null;
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", cancelHold);
    window.addEventListener("blur", cancelHold);
    return () => {
      cancelHold();
      document.removeEventListener("visibilitychange", cancelHold);
      window.removeEventListener("blur", cancelHold);
    };
  }, [cancelHold]);

  useEffect(() => {
    if (!open) return;
    const dismiss = () => {
      setOpen(false);
      setPinned(false);
    };
    const outside = (event: PointerEvent) => {
      if (!duck.current?.contains(event.target as Node)) dismiss();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // Dismiss the greeting before the console's Escape-to-home shortcut.
      event.preventDefault();
      event.stopPropagation();
      dismiss();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape, true);
    };
  }, [open]);

  return (
    <div
      ref={duck}
      className={`third-place-duck ${menu ? "is-menu-duck" : ""}`}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse" && !pinned) setOpen(false);
      }}
    >
      <p id={bubbleId} className="duck-greeting" hidden={!open}>
        welcome, to the third place
      </p>
      <button
        type="button"
        className="duck-button"
        aria-label="A little duck has something to say"
        aria-expanded={open}
        aria-controls={bubbleId}
        aria-describedby={open ? bubbleId : undefined}
        onPointerDown={(event) => {
          cancelHold();
          if (!onSecretHold || event.pointerType !== "touch" || !event.isPrimary) return;
          hold.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
          holdTimer.current = setTimeout(() => {
            hold.current = null;
            onSecretHold();
          }, 5000);
        }}
        onPointerMove={(event) => {
          const start = hold.current;
          if (
            start?.id === event.pointerId &&
            Math.hypot(event.clientX - start.x, event.clientY - start.y) > 12
          )
            cancelHold();
        }}
        onPointerUp={cancelHold}
        onPointerCancel={cancelHold}
        onLostPointerCapture={cancelHold}
        onPointerLeave={cancelHold}
        onContextMenu={(event) => {
          if (onSecretHold) event.preventDefault();
        }}
        onClick={() => {
          setPinned(!pinned);
          setOpen(!pinned);
        }}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) setOpen(true);
        }}
        onBlur={() => {
          cancelHold();
          setPinned(false);
          setOpen(false);
        }}
      >
        <svg viewBox="0 0 48 40" fill="none" aria-hidden="true" shapeRendering="crispEdges">
          <path
            fill="currentColor"
            d="M12 3h10v2h4v4h2v9h-4v6h9v-3h5v-4h4v12h-3v5h-5v3H14v-2H9v-4H6v-9h4v-5h4v-4h-4V7h2Z"
          />
          <path fill="#bfc4ca" d="M2 11h9v5H2zM18 37h5v3h-7v-2h2Zm10 0h4v3h-7v-2h3Z" />
          <path fill="#111318" d="M15 8h3v3h-3Z" />
          <path stroke="#bfc4ca" strokeWidth="2" d="M17 26v3h4v2h9v-2h3" />
        </svg>
      </button>
    </div>
  );
}
