import type { Route } from "./+types/spotify.currently-playing";

const SPOTIFY_API_ROOT = 'https://api.spotify.com/v1';
const CURRENTLY_PLAYING_URL = `${SPOTIFY_API_ROOT}/me/player/currently-playing`;

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const access_token = url.searchParams.get('token');

  if (!access_token) {
    return Response.json({ error: 'Missing access token' }, { status: 400 });
  }

  try {
    const response = await fetch(CURRENTLY_PLAYING_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Spotify returns 204 when nothing is playing
    if (response.status === 204 || response.status === 304) {
      return Response.json(null);
    }

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching currently playing:', error);
    return Response.json({ error: 'Failed to fetch currently playing' }, { status: 500 });
  }
}
