# Personal System

A PS2-inspired personal website. The app uses React Router SSR and a decorative Canvas 2D particle scene; links and content work without JavaScript.

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
- `app/components/console/scene.tsx`: particle bloom and perspective. `app/components/console/clock.ts` contains the clock-driven motion model.
- `app/components/console/audio.ts`: short recorded console cues, off by default. Source ranges and attribution are in `public/audio/README.md`.

The 6.8-second tower-and-particle intro appears once per browser tab session on home entry, can be skipped, and respects reduced motion. Direct links bypass it. Sound preferences persist locally, but audio only starts after a user gesture.

Spotify uses the existing `/api/spotify/token` and `/api/spotify/currently-playing` server endpoints. Configure `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN` on the server. Polling runs only on the player screen while the document is visible. The player displays listening status, not streaming audio.

## Deployment

Vercel is already connected to the GitHub repository, with successful production and preview deployments. Push a feature branch and open a pull request to use the existing preview integration; a local Vercel login is not required. The hosting configuration is unchanged by this redesign.

Validate the generated preview before merging, including direct page loads and the Spotify endpoints. Production Spotify credentials are managed in the deployment environment independently of local `.env` files.

## Clock animation

The seven particles follow the clock-driven motion of [imsaud.me](https://www.imsaud.me/), rather than an elapsed-time animation loop. Each particle’s angle is its index × fractional seconds × 6°. The positions pass through hour rotation, a minute-dependent tilt, and second-dependent rotations. Consequently the dots bunch together, fan out, and form rings at the same clock times as the reference. They stay synchronized across refreshes and frame rates when device clocks and timezones agree.

The model is implemented independently as scalar rotations in `clock.ts`; fixed coordinate fixtures use an independent matrix calculation of the reference’s transform chain (observed in its public `assets/index-CVD5AJ_P.js` bundle). Tests cover seven-dot geometry, subsecond motion, minute/hour boundaries, twelve-hour periodicity, refresh synchronization, and reduced motion. This matches the reference site's motion model; it is not a claim of binary-equivalent PS2 BIOS emulation. Background tabs pause drawing, then render the current clock time when visible again. Reduced motion freezes a single pattern.

## Walkthrough reference

The startup pacing, short particle trails, controller prompts, and sound cues follow the user-supplied [PS2 Menu walkthrough](https://www.youtube.com/watch?v=HUyRfqJew1A), particularly 0:00–0:17 and the menu return at 1:17. Startup geometry is rendered procedurally; towers appear only during startup. A sound toggle is available during the skippable intro. Sound is off by default and sampled cues are only fetched after enabling it. Skipping, muting, hiding, and unmounting stop pending/active cues. Reduced motion bypasses startup and trails.
