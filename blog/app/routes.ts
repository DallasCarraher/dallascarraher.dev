import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("components/console/shell.tsx", [
    index("routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("projects", "routes/projects.tsx"),
    route("blog", "routes/blog.tsx"),
    route("now-playing", "routes/now-playing.tsx"),
    route("contact", "routes/contact.tsx"),
  ]),
  route("api/spotify/token", "routes/api/spotify.token.ts"),
  route("api/spotify/currently-playing", "routes/api/spotify.currently-playing.ts"),
] satisfies RouteConfig;
