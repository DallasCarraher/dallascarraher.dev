import { useCallback, useEffect, useRef, useState } from "react";

type Cue = "select" | "confirm" | "back" | "startup";
const files = {
  select: "/audio/move.mp3",
  confirm: "/audio/enter.mp3",
  back: "/audio/back.mp3",
  startup: "/audio/startup.mp3",
  ambience: "/audio/ambience.mp3",
};
type Sound = keyof typeof files;

export function useConsoleAudio() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const ambient = useRef<AudioBufferSourceNode | null>(null);
  const preference = useRef(false);
  const buffers = useRef(new Map<Sound, Promise<AudioBuffer | null>>());
  const voices = useRef(new Map<Cue, AudioBufferSourceNode>());
  const alive = useRef(true);
  const generation = useRef(0);

  const load = useCallback((name: Sound, ctx: AudioContext) => {
    let buffer = buffers.current.get(name);
    if (!buffer) {
      buffer = fetch(files[name])
        .then((response) =>
          response.ok ? response.arrayBuffer() : Promise.reject(new Error("Sound unavailable")),
        )
        .then((data) => ctx.decodeAudioData(data))
        .catch(() => null);
      buffers.current.set(name, buffer);
    }
    return buffer;
  }, []);

  const start = useCallback(async () => {
    try {
      const ctx = audio.current ?? (audio.current = new AudioContext());
      await ctx.resume();
      if (!alive.current) return;
      setUnlocked(true);
      const buffer = await load("ambience", ctx);
      if (
        !alive.current ||
        !preference.current ||
        !buffer ||
        ambient.current ||
        ctx.state !== "running"
      )
        return;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 0.6);
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      ambient.current = source;
      // Decode effects once, after sound has been explicitly enabled.
      for (const name of ["select", "confirm", "back", "startup"] as const) void load(name, ctx);
    } catch {
      /* Audio remains optional on restricted or unsupported browsers. */
    }
  }, [load]);

  const stopCues = useCallback(() => {
    generation.current++;
    for (const source of voices.current.values()) {
      try {
        source.stop();
      } catch {
        /* Already ended. */
      }
    }
    voices.current.clear();
  }, []);

  useEffect(() => {
    alive.current = true;
    const cache = buffers.current;
    try {
      preference.current = localStorage.getItem("dc-sound") === "on";
    } catch {
      /* Storage may be unavailable. */
    }
    setEnabled(preference.current);
    setReady(true);
    const unlock = () => {
      if (preference.current && !document.hidden) void start();
    };
    const visibility = () => {
      if (document.hidden) {
        stopCues();
        void audio.current?.suspend();
      } else if (preference.current) void start();
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      alive.current = false;
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      document.removeEventListener("visibilitychange", visibility);
      stopCues();
      void audio.current?.close();
      audio.current = null;
      ambient.current = null;
      cache.clear();
    };
  }, [start, stopCues]);

  const toggle = () => {
    preference.current = !preference.current;
    setEnabled(preference.current);
    try {
      localStorage.setItem("dc-sound", preference.current ? "on" : "off");
    } catch {
      /* Optional preference. */
    }
    if (preference.current) void start();
    else {
      stopCues();
      void audio.current?.suspend();
    }
  };

  const play = useCallback(
    (kind: Cue = "select", offsetSeconds = 0) => {
      const ctx = audio.current;
      if (!preference.current || !ctx || document.hidden) return;
      const request = generation.current;
      const requestedAt = performance.now();
      void ctx
        .resume()
        .then(() => load(kind, ctx))
        .then((buffer) => {
          if (
            request !== generation.current ||
            !buffer ||
            !alive.current ||
            !preference.current ||
            document.hidden ||
            ctx.state !== "running"
          )
            return;
          // Repeated cursor taps replace their prior tail rather than piling up.
          const offset =
            kind === "startup" ? offsetSeconds + (performance.now() - requestedAt) / 1000 : 0;
          if (offset >= buffer.duration) return;
          const previous = voices.current.get(kind);
          try {
            previous?.stop();
          } catch {
            /* Already ended. */
          }
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          const gain = ctx.createGain();
          gain.gain.value = kind === "startup" ? 0.55 : 0.8;
          source.connect(gain);
          gain.connect(ctx.destination);
          source.start(0, offset);
          voices.current.set(kind, source);
          source.onended = () => {
            source.disconnect();
            gain.disconnect();
            if (voices.current.get(kind) === source) voices.current.delete(kind);
          };
        })
        .catch(() => {
          /* No audio must block navigation. */
        });
    },
    [load],
  );

  return { enabled, ready, unlocked, toggle, play, stopCues };
}
