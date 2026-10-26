import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate, useOutletContext } from "react-router";
import { menuItems } from "../../content/site";
import { Scene } from "./scene";
import { StartupScene, STARTUP_DURATION } from "./startup";
import { useConsoleAudio } from "./audio";
import { ThirdPlaceDuck } from "./third-place-duck";
import { DiscSelector, DISC_CODE, type DiscSelectorHandle } from "./disc-selector";

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
  const directCollection = new URLSearchParams(location.search).get("collection") === "games";
  const [discBrowser, setDiscBrowser] = useState(directCollection);
  const discSelector = useRef<DiscSelectorHandle>(null);
  const secretKeys = useRef<string[]>([]);
  const showingDiscs = home && discBrowser;
  const visited = useRef(false);
  const [welcome, setWelcome] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bootId, setBootId] = useState(0);
  const entryRequest = useRef(0);
  const content = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const { enabled, ready, configure, toggle, play, stopCues } = useConsoleAudio(
    !booting && !welcome && !loading,
  );
  const active = menuItems.find((item) => item.href === location.pathname);
  const closeDiscs = useCallback(() => {
    setDiscBrowser(false);
    if (directCollection) navigate("/", { replace: true });
    secretKeys.current = [];
    play("back");
    requestAnimationFrame(() =>
      content.current?.querySelector<HTMLAnchorElement>(".menu-link[aria-current]")?.focus(),
    );
  }, [play, directCollection, navigate]);

  const endBoot = useCallback(
    (natural = false) => {
      entryRequest.current++;
      if (!natural) stopCues();
      setBooting(false);
      setWelcome(false);
      setLoading(false);
      try {
        sessionStorage.setItem("dc-booted", "1");
      } catch {
        /* Intro still ends. */
      }
      requestAnimationFrame(() =>
        content.current?.querySelector<HTMLAnchorElement>(".menu-link[aria-current]")?.focus(),
      );
    },
    [stopCues],
  );

  useEffect(() => {
    if (visited.current) return;
    visited.current = true;
    let seen = false;
    try {
      seen = sessionStorage.getItem("dc-booted") === "1";
    } catch {
      /* Use this mount only. */
    }
    if (home && !seen && !directCollection) {
      // The entry choice supplies the browser gesture required for sound.
      // oxlint-disable-next-line react/set-state-in-effect
      setWelcome(true);
    }
  }, [home, directCollection]);

  useEffect(() => {
    if (!booting) return;
    const timer = window.setTimeout(() => endBoot(true), STARTUP_DURATION);
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

  const beginBoot = async (withSound: boolean) => {
    setDiscBrowser(false);
    secretKeys.current = [];
    const request = ++entryRequest.current;
    stopCues();
    setWelcome(true);
    setLoading(true);
    const audioReady = await configure(withSound);
    if (request !== entryRequest.current) return;
    setLoading(false);
    setWelcome(false);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || document.hidden) {
      endBoot();
      return;
    }
    setBootId((id) => id + 1);
    setBooting(true);
    if (audioReady) play("startup");
  };

  useEffect(() => {
    if (!booting) return;
    const hidden = () => {
      if (document.hidden) endBoot();
    };
    document.addEventListener("visibilitychange", hidden);
    return () => document.removeEventListener("visibilitychange", hidden);
  }, [booting, endBoot]);

  useEffect(() => {
    if (booting || welcome) return;
    const target = home
      ? content.current?.querySelector<HTMLAnchorElement>(".menu-link[aria-current]")
      : content.current?.querySelector<HTMLHeadingElement>("h1");
    target?.focus({ preventScroll: true });
    content.current?.scrollTo(0, 0);
    stage.current?.scrollTo(0, 0);
  }, [location.pathname, home, booting, welcome]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : document.body;
      if (
        event.altKey ||
        event.metaKey ||
        event.ctrlKey ||
        target.closest("input, textarea, select, [contenteditable=true]")
      )
        return;
      // Listen before startup/menu handling so the shortcut works from any screen.
      if (!showingDiscs && !event.repeat) {
        secretKeys.current = [...secretKeys.current, event.key].slice(-DISC_CODE.length);
        if (secretKeys.current.join(",") === DISC_CODE.join(",")) {
          event.preventDefault();
          secretKeys.current = [];
          endBoot();
          play("confirm");
          setDiscBrowser(true);
          if (!home) navigate("/");
          return;
        }
      }
      if (booting || welcome) {
        if (event.key === "Tab") {
          const buttons = [
            ...document.querySelectorAll<HTMLButtonElement>(
              ".entry-screen button:not([disabled]), .boot-screen button:not([disabled])",
            ),
          ];
          const index = buttons.indexOf(target as HTMLButtonElement);
          event.preventDefault();
          buttons[(index + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length]?.focus();
        } else if (
          booting &&
          (event.key === "Escape" ||
            (["Enter", " "].includes(event.key) && target.tagName !== "BUTTON"))
        ) {
          event.preventDefault();
          endBoot();
        }
        return;
      }
      if (showingDiscs) {
        if (["Escape", "Backspace"].includes(event.key)) {
          event.preventDefault();
          if (!discSelector.current?.back()) closeDiscs();
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
  }, [home, selected, navigate, play, booting, welcome, endBoot, showingDiscs, closeDiscs]);

  const select = (index: number) => {
    if (selected !== index) play("select");
    setSelected(index);
  };

  return (
    <div
      className={`console-shell ${home ? "is-home" : "is-content"} ${showingDiscs ? "is-disc-browser" : ""} ${location.pathname === "/about" ? "is-about" : ""}`}
    >
      <div className="console-chrome" inert={booting || welcome || loading}>
        <div ref={stage} className="console-stage">
          {!showingDiscs && <Scene fixture={location.pathname === "/about"} />}
          <main
            ref={content}
            id="main-content"
            className="screen"
            aria-label={showingDiscs ? "Disc selection" : home ? "Main menu" : active?.label}
          >
            <div key={location.pathname} className="screen-transition">
              {showingDiscs ? (
                <DiscSelector ref={discSelector} />
              ) : (
                <Outlet
                  context={
                    { selected, select, confirm: () => play("confirm") } satisfies ConsoleContext
                  }
                />
              )}
            </div>
          </main>
        </div>
        {!showingDiscs && (
          <ThirdPlaceDuck
            key={location.pathname}
            menu={home}
            onSecretHold={() => {
              secretKeys.current = [];
              play("confirm");
              setDiscBrowser(true);
              if (!home) navigate("/");
            }}
          />
        )}
        <footer className="system-footer">
          <div className="control-hints">
            {showingDiscs ? (
              <button
                className="back-control"
                onClick={() => {
                  if (!discSelector.current?.back()) closeDiscs();
                }}
              >
                <svg className="controller-circle" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="7" />
                </svg>{" "}
                Back
              </button>
            ) : home ? (
              <span className="keyboard-hint">
                <svg className="controller-cross" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>{" "}
                Enter
              </span>
            ) : (
              <Link to="/" className="back-control" onClick={() => play("back")}>
                <svg className="controller-circle" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="7" />
                </svg>{" "}
                Back
              </Link>
            )}
          </div>
          <button
            className="replay-control"
            onClick={() => void beginBoot(enabled)}
            disabled={loading}
          >
            Replay intro
          </button>
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
      {welcome && (
        <div className="entry-screen" role="dialog" aria-modal="true" aria-labelledby="entry-title">
          <div className="entry-choice">
            <p className="entry-eyebrow">Welcome to</p>
            <h1 id="entry-title">Dallas Carraher</h1>
            <p>A little nostalgia before you explore.</p>
            <p className="entry-note">Choose sound before the startup begins.</p>
            <button autoFocus disabled={!ready || loading} onClick={() => void beginBoot(true)}>
              {loading ? "Loading startup…" : "Enter with sound"}
            </button>
            <button disabled={!ready} onClick={() => void beginBoot(false)}>
              Enter without sound
            </button>
            <span className="entry-status" role="status">
              {loading
                ? "Preparing audio. You can also enter without sound."
                : "Headphones recommended"}
            </span>
          </div>
        </div>
      )}
      {booting && (
        <div className="boot-screen" role="dialog" aria-modal="true" aria-label="System startup">
          <StartupScene key={bootId} />
          <p className="boot-name">Dallas Carraher</p>
          <button
            className="boot-sound"
            disabled={!ready}
            onClick={toggle}
            aria-pressed={enabled}
            aria-label={enabled ? "Turn sound off" : "Turn sound on"}
          >
            Sound {enabled ? "on" : "off"}
          </button>
          <button autoFocus onClick={() => endBoot()}>
            Skip intro <span>↵</span>
          </button>
        </div>
      )}
      <div className="crt-overlay" aria-hidden="true" />
    </div>
  );
}
