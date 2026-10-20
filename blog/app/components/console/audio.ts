import { useCallback, useEffect, useRef, useState } from "react";

export function useConsoleAudio() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const ambient = useRef<GainNode | null>(null);
  const preference = useRef(false);

  const start = useCallback(async () => {
    try {
      if (!audio.current) {
        const ctx = new AudioContext();
        audio.current = ctx;
        const gain = ctx.createGain();
        gain.gain.value = 0.012;
        gain.connect(ctx.destination);
        ambient.current = gain;
        for (const frequency of [55, 82.41, 110.2]) {
          const oscillator = ctx.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.value = frequency;
          oscillator.connect(gain);
          oscillator.start();
        }
      }
      await audio.current.resume();
    } catch {
      /* Audio is optional, including on unsupported browsers. */
    }
  }, []);

  useEffect(() => {
    try {
      preference.current = localStorage.getItem("dc-sound") === "on";
    } catch {
      /* Storage may be unavailable. */
    }
    setEnabled(preference.current);
    setReady(true);
    const unlock = () => {
      if (preference.current) void start();
    };
    const visibility = () => {
      if (document.hidden) void audio.current?.suspend();
      else if (preference.current) void audio.current?.resume().catch(() => {});
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      document.removeEventListener("visibilitychange", visibility);
      void audio.current?.close();
      audio.current = null;
    };
  }, [start]);

  const toggle = () => {
    preference.current = !preference.current;
    setEnabled(preference.current);
    try {
      localStorage.setItem("dc-sound", preference.current ? "on" : "off");
    } catch {
      /* Optional preference. */
    }
    if (preference.current) void start();
    else void audio.current?.suspend();
  };
  const play = useCallback((kind: "select" | "confirm" | "back" = "select") => {
    const ctx = audio.current;
    if (!preference.current || !ctx || ctx.state !== "running") return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      kind === "confirm" ? 660 : kind === "back" ? 330 : 440,
      ctx.currentTime,
    );
    oscillator.frequency.exponentialRampToValueAtTime(
      kind === "confirm" ? 990 : 220,
      ctx.currentTime + 0.16,
    );
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  }, []);
  return { enabled, ready, toggle, play };
}
