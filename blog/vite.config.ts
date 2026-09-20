import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import stylexPlugin from "./vite-plugin-stylex.ts";

export default defineConfig({
  plugins: [stylexPlugin(), reactRouter(), tsconfigPaths()],
});
