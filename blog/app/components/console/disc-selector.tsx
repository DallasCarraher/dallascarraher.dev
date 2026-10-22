import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type Ref,
} from "react";
import { games, type Game } from "./games";
import { SpinningDisc } from "./spinning-disc";
import "./disc-selector.css";

export const DISC_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowUp",
  "ArrowLeft",
  "ArrowDown",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowUp",
  "ArrowUp",
  "ArrowUp",
  "ArrowLeft",
  "ArrowRight",
];

export type DiscSelectorHandle = { back: () => boolean };
type Phase = "browse" | "opening" | "disc" | "closing";

function GameCase({ game }: { game: Game }) {
  return (
    <span className="game-case" aria-hidden="true">
      <span className="case-back">
        <img src={game.back} alt="" draggable={false} />
      </span>
      <span className="case-spine">
        <img src={game.spine} alt="" draggable={false} />
      </span>
      <span className="case-tray">
        <span className="case-tray-ring" />
        <img className="case-seated-disc" src={game.disc} alt="" draggable={false} />
        <span className="case-hub" />
        <span className="case-tray-mark">DVD ROM</span>
      </span>
      <span className="case-lid">
        <span className="case-front">
          <img src={game.front} alt="" draggable={false} />
        </span>
        <span className="case-lid-inside">
          <i />
          <i />
          <i />
        </span>
      </span>
    </span>
  );
}

export function DiscSelector({ ref }: { ref?: Ref<DiscSelectorHandle> }) {
  const [selected, setSelected] = useState(0);
  const [phase, setPhase] = useState<Phase>("browse");
  const [flipped, setFlipped] = useState(false);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const swipe = useRef<{ id: number; x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const game = games[selected];
  const browsing = phase === "browse";
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (phase === "browse") cards.current[selected]?.focus({ preventScroll: true });
  }, [selected, phase]);

  const choose = (index: number) => {
    if (!browsing) return;
    setFlipped(false);
    setSelected((index + games.length) % games.length);
  };
  const open = () => {
    if (!browsing) return;
    setFlipped(false);
    setPhase(reduce() ? "disc" : "opening");
    clearTimeout(timer.current);
    if (!reduce()) timer.current = setTimeout(() => setPhase("disc"), 1500);
  };
  const back = () => {
    if (browsing) return false;
    clearTimeout(timer.current);
    setPhase(reduce() ? "browse" : "closing");
    if (!reduce()) timer.current = setTimeout(() => setPhase("browse"), 650);
    return true;
  };
  useImperativeHandle(ref, () => ({ back }));

  return (
    <section
      className={`disc-selector collection-${phase} ${flipped ? "case-is-flipped" : ""}`}
      aria-labelledby="disc-selector-title"
      onKeyDown={(event) => {
        if (["Escape", "Backspace"].includes(event.key) && !browsing) {
          event.preventDefault();
          event.stopPropagation();
          back();
        } else if (browsing && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          if (event.key === "Home") choose(0);
          else if (event.key === "End") choose(games.length - 1);
          else choose(selected + (event.key === "ArrowLeft" ? -1 : 1));
        }
      }}
    >
      <div className="collection-header">
        <p className="eyebrow">
          <span>SECRET COLLECTION</span> / PLAYSTATION 2
        </p>
        <span className="collection-count">
          {String(selected + 1).padStart(2, "0")}{" "}
          <span>/ {String(games.length).padStart(2, "0")}</span>
        </span>
      </div>
      <h1 id="disc-selector-title">
        {browsing ? "Pick something good." : "A little piece of nostalgia."}
      </h1>
      <div
        className="cover-flow"
        role="group"
        aria-label="Game collection"
        onPointerDown={(event) => {
          if (!browsing || !event.isPrimary || event.button !== 0) return;
          suppressClick.current = false;
          swipe.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          const start = swipe.current;
          swipe.current = null;
          if (!start || start.id !== event.pointerId || !browsing) return;
          const dx = event.clientX - start.x;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(event.clientY - start.y)) {
            suppressClick.current = true;
            choose(selected + (dx < 0 ? 1 : -1));
          }
        }}
        onPointerCancel={() => {
          swipe.current = null;
        }}
      >
        <div className="collection-floor" aria-hidden="true" />
        {games.map((item, index) => {
          const half = Math.floor(games.length / 2);
          const offset = ((index - selected + half + games.length) % games.length) - half;
          return (
            <button
              key={item.id}
              ref={(node) => {
                cards.current[index] = node;
              }}
              type="button"
              className={`cover-flow-card ${index === selected ? "is-selected" : ""}`}
              style={
                {
                  "--offset": offset,
                  "--side": Math.sign(offset),
                  zIndex: games.length - Math.abs(offset),
                } as CSSProperties
              }
              tabIndex={browsing && index === selected ? 0 : -1}
              disabled={!browsing}
              aria-label={index === selected ? `Open ${item.title} case` : `Select ${item.title}`}
              aria-pressed={index === selected}
              onClick={() => {
                if (suppressClick.current) {
                  suppressClick.current = false;
                  return;
                }
                if (index === selected) open();
                else choose(index);
              }}
            >
              <GameCase game={item} />
              <img
                className="case-reflection"
                src={item.front}
                alt=""
                draggable={false}
                aria-hidden="true"
              />
            </button>
          );
        })}
        {phase !== "browse" && (
          <div className="disc-lift" key={game.id}>
            {phase === "disc" ? (
              <SpinningDisc game={game} />
            ) : (
              <div className="game-disc-stage disc-in-transit" aria-hidden="true">
                <img src={game.disc} alt="" draggable={false} />
              </div>
            )}
          </div>
        )}
        <div className="flow-navigation" hidden={!browsing}>
          <button
            aria-label="Previous game"
            onClick={() => choose(selected - 1)}
            disabled={games.length < 2}
          >
            ‹
          </button>
          <button
            aria-label="Next game"
            onClick={() => choose(selected + 1)}
            disabled={games.length < 2}
          >
            ›
          </button>
        </div>
      </div>
      <div className="disc-caption" aria-live="polite" aria-atomic="true">
        <p className="small-label">
          {game.year} <span>·</span> NAUGHTY DOG <span>·</span> DVD ROM
        </p>
        <h2>{game.title}</h2>
        <p>{game.subtitle}</p>
      </div>
      <div className="collection-actions">
        {browsing ? (
          <>
            <div className="collection-dots" aria-label="Choose a game">
              {games.map((item, index) => (
                <button
                  key={item.id}
                  aria-label={`Browse ${item.title}`}
                  aria-pressed={index === selected}
                  onClick={() => choose(index)}
                >
                  <span />
                </button>
              ))}
            </div>
            <div className="case-actions">
              <button className="open-case-control" onClick={open}>
                Open case <span aria-hidden="true">↗</span>
              </button>
              <button onClick={() => setFlipped(!flipped)}>
                {flipped ? "View front" : "View back"} <span aria-hidden="true">↶</span>
              </button>
            </div>
          </>
        ) : (
          <button className="return-to-collection" onClick={back}>
            ← Return to collection
          </button>
        )}
      </div>
      <p id="disc-instructions" className="disc-instructions" role="status">
        {browsing
          ? "Swipe or use ← / → to browse · Select to open"
          : phase === "opening"
            ? "Opening case…"
            : phase === "closing"
              ? "Returning to the shelf…"
              : "Drag to spin · ← / → to turn · Enter to flick"}
      </p>
      <a className="collection-credit" href={game.source} target="_blank" rel="noreferrer">
        Artwork from LaunchBox ↗
      </a>
    </section>
  );
}
