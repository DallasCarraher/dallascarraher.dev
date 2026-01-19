import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/spotify/token", "routes/api/spotify.token.ts"),
  route("api/spotify/currently-playing", "routes/api/spotify.currently-playing.ts"),
] satisfies RouteConfig;
