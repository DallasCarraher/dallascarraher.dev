# Personal System

A PS2-inspired personal website. The app uses React Router SSR and a decorative Canvas 2D scene; links and content work without JavaScript.

## Develop

From the repository root, use Bun 1.3.11:

```sh
bun install --frozen-lockfile
bun run dev
bun run --filter @dallascarraher/blog typecheck
bun run lint
bun run --filter @dallascarraher/blog build
bun run --filter @dallascarraher/blog test
```

For the first browser test run, install Chromium with `bun x playwright install chromium`. Tests cover desktop and mobile Chromium, navigation, direct links, sound preferences, startup, reduced motion, canvas failure, and mocked Spotify states. No live Spotify credentials are needed for tests.

## Customize

- `app/content/site.ts`: menu labels, social links, and typed project/post collections. Empty collections show deliberate empty states.
- `app/components/console/screens.tsx`: profile copy and screen presentation.
- `app/app.css`: palette, type, glow, timing, and responsive layout.
- `app/components/console/scene.tsx`: orbit and tower geometry.
- `app/components/console/audio.ts`: original synthesized sounds, off by default.

The two-second intro appears once per browser tab session on home entry, can be skipped, and respects reduced motion. Direct links bypass it. Sound preferences persist locally, but audio only starts after a user gesture.

Spotify uses the existing `/api/spotify/token` and `/api/spotify/currently-playing` server endpoints. Configure `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN` on the server. Polling runs only on the player screen while the document is visible. The player displays listening status, not streaming audio.

## Deployment

Vercel is already connected to the GitHub repository, with successful production and preview deployments. Push a feature branch and open a pull request to use the existing preview integration; a local Vercel login is not required. The hosting configuration is unchanged by this redesign.

Validate the generated preview before merging, including direct page loads and the Spotify endpoints. Production Spotify credentials are managed in the deployment environment independently of local `.env` files.
