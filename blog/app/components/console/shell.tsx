import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate, useOutletContext } from "react-router";
import { menuItems } from "../../content/site";
import { Scene } from "./scene";
import { useConsoleAudio } from "./audio";

type ConsoleContext = { selected: number; select: (index: number) => void; confirm: () => void };
export const useConsole = () => useOutletContext<ConsoleContext>();

export default function ConsoleShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const home = location.pathname === "/";
  const [selected, setSelected] = useState(() =>
    Math.max(
      0,
      menuItems.findIndex((item) => item.href === location.pathname),
    ),
  );
  const [booting, setBooting] = useState(false);
  const visited = useRef(false);
  const content = useRef<HTMLElement>(null);
  const { enabled, ready, toggle, play } = useConsoleAudio();
  const active = menuItems.find((item) => item.href === location.pathname);

  const endBoot = useCallback(() => {
    setBooting(false);
    try {
      sessionStorage.setItem("dc-booted", "1");
    } catch {
      /* Intro still ends. */
    }
    requestAnimationFrame(() =>
      content.current?.querySelector<HTMLAnchorElement>(".menu-link[aria-current]")?.focus(),
    );
  }, []);

  useEffect(() => {
    if (visited.current) return;
    visited.current = true;
    let seen = false;
    try {
      seen = sessionStorage.getItem("dc-booted") === "1";
    } catch {
      /* Use this mount only. */
    }
    // Hydrate the intro from browser-only session and media preferences.
    // oxlint-disable-next-line react/set-state-in-effect
    if (home && !seen && !matchMedia("(prefers-reduced-motion: reduce)").matches) setBooting(true);
  }, [home]);

  useEffect(() => {
    if (!booting) return;
    const timer = window.setTimeout(endBoot, 2000);
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => {
      if (motion.matches) endBoot();
    };
    motion.addEventListener("change", onMotion);
    return () => {
      clearTimeout(timer);
      motion.removeEventListener("change", onMotion);
    };
  }, [booting, endBoot]);

  useEffect(() => {
    if (booting) return;
    const target = home
      ? content.current?.querySelector<HTMLAnchorElement>(".menu-link[aria-current]")
      : content.current?.querySelector<HTMLHeadingElement>("h1");
    target?.focus({ preventScroll: true });
    content.current?.scrollTo(0, 0);
  }, [location.pathname, home, booting]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        event.altKey ||
        event.metaKey ||
        event.ctrlKey ||
        target.closest("input, textarea, select, [contenteditable=true]")
      )
        return;
      if (booting) {
        if (["Escape", "Enter", " "].includes(event.key)) {
          event.preventDefault();
          endBoot();
        }
        return;
      }
      if (!home && ["Escape", "Backspace"].includes(event.key)) {
        event.preventDefault();
        play("back");
        navigate("/");
      }
      if (home && ["ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        const next =
          (selected + (event.key === "ArrowDown" ? 1 : -1) + menuItems.length) % menuItems.length;
        setSelected(next);
        content.current?.querySelectorAll<HTMLAnchorElement>(".menu-link")[next]?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [home, selected, navigate, play, booting, endBoot]);

  const select = (index: number) => {
    if (selected !== index) play("select");
    setSelected(index);
  };

  return (
    <div className={`console-shell ${home ? "is-home" : "is-content"}`}>
      <div className="console-chrome" inert={booting}>
        <div className="console-stage">
          <Scene />
          <main
            ref={content}
            id="main-content"
            className="screen"
            aria-label={home ? "Main menu" : active?.label}
          >
            <div key={location.pathname} className="screen-transition">
              <Outlet
                context={
                  { selected, select, confirm: () => play("confirm") } satisfies ConsoleContext
                }
              />
            </div>
          </main>
        </div>
        <footer className="system-footer">
          <div className="control-hints">
            {home ? (
              <span className="keyboard-hint">
                <kbd>↵</kbd> Select
              </span>
            ) : (
              <Link to="/" className="back-control" onClick={() => play("back")}>
                <kbd>ESC</kbd> Back
              </Link>
            )}
            {home && (
              <span className="keyboard-hint">
                <kbd>↑ ↓</kbd> Navigate
              </span>
            )}
          </div>
          <button
            className="sound-control"
            disabled={!ready}
            onClick={toggle}
            aria-pressed={enabled}
            aria-label={enabled ? "Turn sound off" : "Turn sound on"}
          >
            <svg className="controller-triangle" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4 22 21H2Z" />
            </svg>
            Sound {enabled ? "on" : "off"}
          </button>
        </footer>
      </div>
      {booting && (
        <div className="boot-screen" role="dialog" aria-modal="true" aria-label="System startup">
          <p className="boot-name">Dallas Carraher</p>
          <span className="boot-label">Personal system</span>
          <div className="boot-line" />
          <button autoFocus onClick={endBoot}>
            Skip intro <span>↵</span>
          </button>
        </div>
      )}
      <div className="crt-overlay" aria-hidden="true" />
    </div>
  );
}
