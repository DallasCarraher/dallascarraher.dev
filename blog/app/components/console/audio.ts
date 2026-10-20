import { useCallback, useEffect, useRef, useState } from "react";

type Cue = "select" | "confirm" | "back" | "startup";
const files: Record<Cue, string> = {
  select: "/audio/move.mp3",
  confirm: "/audio/enter.mp3",
  back: "/audio/back.mp3",
  startup: "/audio/startup.mp3",
};

export function useConsoleAudio() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const preference = useRef(false);
  const buffers = useRef(new Map<Cue, Promise<AudioBuffer | null>>());
  const voices = useRef(new Map<Cue, AudioBufferSourceNode>());
  const alive = useRef(true);
  const generation = useRef(0);

  const load = useCallback((name: Cue, ctx: AudioContext) => {
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

  // Called directly by a button gesture, before any startup animation is mounted.
  const configure = useCallback(
    async (value: boolean) => {
      preference.current = value;
      setEnabled(value);
      try {
        localStorage.setItem("dc-sound", value ? "on" : "off");
      } catch {
        /* Optional preference. */
      }
      stopCues();
      if (!value) {
        void audio.current?.suspend();
        return false;
      }
      try {
        const ctx = audio.current ?? (audio.current = new AudioContext());
        await ctx.resume();
        for (const name of ["select", "confirm", "back"] as const) void load(name, ctx);
        // A failed or slow asset must never lock the visitor outside the site.
        let timeout: ReturnType<typeof setTimeout> | undefined;
        const buffer = await Promise.race([
          load("startup", ctx),
          new Promise<null>((resolve) => {
            timeout = setTimeout(() => resolve(null), 8000);
          }),
        ]);
        clearTimeout(timeout);
        return !!buffer && alive.current && preference.current && ctx.state === "running";
      } catch {
        return false;
      }
    },
    [load, stopCues],
  );

  useEffect(() => {
    alive.current = true;
    const cache = buffers.current;
    try {
      preference.current = localStorage.getItem("dc-sound") === "on";
    } catch {
      /* Optional preference. */
    }
    setEnabled(preference.current);
    setReady(true);
    const visibility = () => {
      if (document.hidden) {
        stopCues();
        void audio.current?.suspend();
      }
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      alive.current = false;
      document.removeEventListener("visibilitychange", visibility);
      stopCues();
      void audio.current?.close();
      audio.current = null;
      cache.clear();
    };
  }, [stopCues]);

  const play = useCallback(
    (kind: Cue = "select") => {
      if (!preference.current || document.hidden) return;
      let ctx: AudioContext;
      try {
        ctx = audio.current ?? (audio.current = new AudioContext());
      } catch {
        return;
      }
      const request = generation.current;
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
          try {
            voices.current.get(kind)?.stop();
          } catch {
            /* Already ended. */
          }
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          // Every sound is a one-shot. No ambience bed or automatically restarted loops.
          source.loop = false;
          const gain = ctx.createGain();
          gain.gain.value = kind === "startup" ? 0.7 : 0.8;
          source.connect(gain);
          gain.connect(ctx.destination);
          source.start(0, 0);
          voices.current.set(kind, source);
          source.onended = () => {
            source.disconnect();
            gain.disconnect();
            if (voices.current.get(kind) === source) voices.current.delete(kind);
          };
        })
        .catch(() => {
          /* Sound must never block navigation. */
        });
    },
    [load],
  );

  return {
    enabled,
    ready,
    configure,
    toggle: () => void configure(!preference.current),
    play,
    stopCues,
  };
}
