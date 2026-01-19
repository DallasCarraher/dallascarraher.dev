import type { Route } from "./+types/spotify.token";

const SPOTIFY_TOKEN_API = 'https://accounts.spotify.com/api/token';

interface AccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export async function loader({ request }: Route.LoaderArgs) {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!refresh_token || !client_id || !client_secret) {
    console.error('Missing Spotify credentials');
    return Response.json({ error: 'Missing Spotify credentials' }, { status: 500 });
  }

  const params = new URLSearchParams({
    client_id,
    client_secret,
    grant_type: 'refresh_token',
    refresh_token,
  });

  try {
    const response = await fetch(`${SPOTIFY_TOKEN_API}?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    const data = await response.json() as AccessToken;
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching Spotify token:', error);
    return Response.json({ error: 'Failed to fetch token' }, { status: 500 });
  }
}
