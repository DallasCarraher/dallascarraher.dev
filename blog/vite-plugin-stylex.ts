import path from "node:path";
import * as babel from "@babel/core";
import stylexBabelPlugin from "@stylexjs/babel-plugin";
import type { Rule } from "@stylexjs/babel-plugin";
import type { Plugin } from "vite";

const STYLEX_CSS_VIRTUAL_MODULE = "virtual:stylex.css";
const RESOLVED_STYLEX_CSS_VIRTUAL_MODULE = "\0" + STYLEX_CSS_VIRTUAL_MODULE;

const FILE_PATTERN = /\.[jt]sx?$/;

export default function stylexPlugin(): Plugin {
  const rulesByFile = new Map<string, Rule[]>();
  let isDev = true;

  return {
    name: "vite-plugin-stylex",
    enforce: "pre",

    config(_config, { command }) {
      isDev = command === "serve";
    },

    resolveId(source) {
      if (source === STYLEX_CSS_VIRTUAL_MODULE) {
        return RESOLVED_STYLEX_CSS_VIRTUAL_MODULE;
      }
    },

    load(id) {
      if (id === RESOLVED_STYLEX_CSS_VIRTUAL_MODULE) {
        const rules = Array.from(rulesByFile.values()).flat();
        const css = stylexBabelPlugin.processStylexRules(rules, false);
        return css;
      }
    },

    async transform(code, id) {
      const [filename] = id.split("?");
      if (!filename || !FILE_PATTERN.test(filename) || filename.includes("/node_modules/")) {
        return;
      }
      if (!code.includes("@stylexjs/stylex")) {
        return;
      }

      const result = await babel.transformAsync(code, {
        babelrc: false,
        configFile: false,
        filename,
        presets: [["@babel/preset-typescript", { ignoreExtensions: true }]],
        plugins: [
          "@babel/plugin-syntax-jsx",
          [
            stylexBabelPlugin,
            {
              dev: isDev,
              runtimeInjection: false,
              unstable_moduleResolution: {
                type: "commonJS",
                rootDir: path.resolve(import.meta.dirname, ".."),
              },
            },
          ],
        ] as Parameters<typeof babel.transformAsync>[1] extends { plugins?: infer P } ? P : never,
      });

      if (!result) return;

      const metadata = result.metadata as { stylex?: Rule[] };
      if (metadata.stylex && metadata.stylex.length > 0) {
        rulesByFile.set(filename, metadata.stylex);
      } else {
        rulesByFile.delete(filename);
      }

      return { code: result.code ?? code, map: null };
    },

    handleHotUpdate({ file, server }) {
      if (rulesByFile.has(file)) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_STYLEX_CSS_VIRTUAL_MODULE);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          return [mod];
        }
      }
    },
  };
}
