import { useState, useEffect, useCallback } from 'react';

interface AccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface SpotifyArtist {
  name: string;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyAlbum {
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
}

interface SpotifyTrack {
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
}

interface CurrentlyPlaying {
  item?: SpotifyTrack;
  currently_playing_type?: 'track' | 'episode';
  progress_ms?: number;
  is_playing: boolean;
}

export function useSpotify() {
  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<CurrentlyPlaying | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch access token
  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch('/api/spotify/token');
        if (!response.ok) {
          throw new Error('Failed to fetch token');
        }
        const tokenData: AccessToken = await response.json();
        setToken(tokenData.access_token);
      } catch (err) {
        console.error('Error fetching token:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    }

    fetchToken();
  }, []);

  // Fetch currently playing data
  const fetchCurrentlyPlaying = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`/api/spotify/currently-playing?token=${token}`);
      if (!response.ok) {
        throw new Error('Failed to fetch currently playing');
      }
      const playingData = await response.json();
      setData(playingData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching currently playing:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsLoading(false);
    }
  }, [token]);

  // Fetch currently playing when token is available
  useEffect(() => {
    if (token) {
      fetchCurrentlyPlaying();
    }
  }, [token, fetchCurrentlyPlaying]);

  // Refetch every 5 seconds
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      fetchCurrentlyPlaying();
    }, 5000);

    return () => clearInterval(interval);
  }, [token, fetchCurrentlyPlaying]);

  return { data, isLoading, error };
}
