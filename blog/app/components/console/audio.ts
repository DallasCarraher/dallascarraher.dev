import { useCallback, useEffect, useRef, useState } from "react";

type Cue = "select" | "confirm" | "back" | "startup";
type Sound = Cue | "ambience";
const files: Record<Sound, string> = {
  select: "/audio/select.mp3",
  confirm: "/audio/confirm.mp3",
  back: "/audio/back.mp3",
  startup: "/audio/startup.mp3",
  ambience: "/audio/ambience.mp3",
};

export function useConsoleAudio(menuActive: boolean) {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const preference = useRef(false);
  const buffers = useRef(new Map<Sound, Promise<AudioBuffer | null>>());
  const voices = useRef(new Map<Cue, AudioBufferSourceNode>());
  const alive = useRef(true);
  const generation = useRef(0);
  const menuVisible = useRef(menuActive);
  const ambience = useRef<AudioBufferSourceNode | null>(null);
  const ambienceGeneration = useRef(0);
  const ambiencePending = useRef(false);

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

  const stopAmbience = useCallback(() => {
    ambienceGeneration.current++;
    ambiencePending.current = false;
    try {
      ambience.current?.stop();
    } catch {
      /* Already stopped. */
    }
    ambience.current = null;
  }, []);

  const startAmbience = useCallback(async () => {
    const ctx = audio.current;
    if (
      !ctx ||
      !preference.current ||
      !menuVisible.current ||
      document.hidden ||
      ambience.current ||
      ambiencePending.current
    )
      return;
    const request = ambienceGeneration.current;
    ambiencePending.current = true;
    try {
      await ctx.resume();
      const buffer = await load("ambience", ctx);
      if (request !== ambienceGeneration.current) return;
      ambiencePending.current = false;
      if (
        !buffer ||
        !alive.current ||
        !preference.current ||
        !menuVisible.current ||
        document.hidden ||
        ctx.state !== "running"
      )
        return;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      // A 112-second stereo recording with an eight-second baked crossfade at the join.
      source.loop = true;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(1.5, ctx.currentTime + 3);
      source.connect(gain);
      gain.connect(ctx.destination);
      ambience.current = source;
      source.onended = () => {
        source.disconnect();
        gain.disconnect();
        if (ambience.current === source) ambience.current = null;
      };
      source.start();
    } catch {
      if (request === ambienceGeneration.current) ambiencePending.current = false;
    }
  }, [load]);

  useEffect(() => {
    menuVisible.current = menuActive;
    if (menuActive && enabled) void startAmbience();
    else stopAmbience();
  }, [menuActive, enabled, startAmbience, stopAmbience]);

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
      stopAmbience();
      if (!value) {
        void audio.current?.suspend();
        return false;
      }
      try {
        const ctx = audio.current ?? (audio.current = new AudioContext());
        await ctx.resume();
        for (const name of ["select", "confirm", "back", "ambience"] as const) void load(name, ctx);
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
    [load, stopCues, stopAmbience],
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
        stopAmbience();
        void audio.current?.suspend();
      } else void startAmbience();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      alive.current = false;
      document.removeEventListener("visibilitychange", visibility);
      stopCues();
      stopAmbience();
      void audio.current?.close();
      audio.current = null;
      cache.clear();
    };
  }, [stopCues, stopAmbience, startAmbience]);

  const play = useCallback(
    (kind: Cue = "select") => {
      if (!preference.current || document.hidden) return;
      let ctx: AudioContext;
      try {
        ctx = audio.current ?? (audio.current = new AudioContext());
      } catch {
        return;
      }
      if (kind !== "startup" && menuVisible.current) void startAmbience();
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
          // Startup and menu interaction cues remain one-shots.
          source.loop = false;
          const gain = ctx.createGain();
          gain.gain.value = { startup: 0.7, select: 0.4, confirm: 0.25, back: 0.8 }[kind];
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
    [load, startAmbience],
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
