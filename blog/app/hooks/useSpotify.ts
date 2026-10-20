import { useEffect, useState } from "react";

export interface SpotifyItem {
  name: string;
  duration_ms: number;
  artists?: { name: string }[];
  album?: { images: { url: string }[] };
  images?: { url: string }[];
  show?: { name: string };
  external_urls?: { spotify?: string };
}
export interface CurrentlyPlaying {
  item?: SpotifyItem | null;
  currently_playing_type?: "track" | "episode" | "ad" | "unknown";
  progress_ms?: number;
  is_playing: boolean;
}

/** Mounted by the player screen only. Credentials expire and visibility pauses polling. */
export function useSpotify() {
  const [data, setData] = useState<CurrentlyPlaying | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    let token: string | null = null;
    let expiry = 0;
    async function poll() {
      if (stopped || document.hidden) return;
      controller = new AbortController();
      const signal = controller.signal;
      try {
        if (!token || Date.now() >= expiry) {
          const response = await fetch("/api/spotify/token", { signal });
          if (!response.ok) throw new Error("Spotify connection unavailable");
          const result = await response.json();
          if (!result.access_token) throw new Error("Spotify connection unavailable");
          token = result.access_token;
          expiry = Date.now() + Math.max(1, (result.expires_in ?? 3600) - 60) * 1000;
        }
        const response = await fetch(
          `/api/spotify/currently-playing?token=${encodeURIComponent(token!)}`,
          { signal },
        );
        if (!response.ok) {
          token = null;
          throw new Error("Spotify status unavailable");
        }
        const result: CurrentlyPlaying | null = await response.json();
        if (!stopped && !signal.aborted) {
          setData(result);
          setError(null);
        }
      } catch (cause) {
        if (!stopped && !signal.aborted)
          setError(cause instanceof Error ? cause : new Error("Spotify unavailable"));
      } finally {
        if (!stopped && !signal.aborted) {
          setIsLoading(false);
          timer = setTimeout(poll, 5000);
        }
      }
    }
    const visibility = () => {
      clearTimeout(timer);
      controller?.abort();
      if (!document.hidden) void poll();
    };
    void poll();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      stopped = true;
      clearTimeout(timer);
      controller?.abort();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return { data, isLoading, error };
}
