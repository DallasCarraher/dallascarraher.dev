import path from "node:path";
import * as babel from "@babel/core";
import stylexBabelPlugin from "@stylexjs/babel-plugin";
import type { Rule } from "@stylexjs/babel-plugin";
import type { Plugin } from "vite";

const STYLEX_CSS_VIRTUAL_MODULE = "virtual:stylex.css";
const RESOLVED_STYLEX_CSS_VIRTUAL_MODULE = "\0" + STYLEX_CSS_VIRTUAL_MODULE;

const FILE_PATTERN = /\.[jt]sx?$/;

// Placeholder emitted during the build's transform phase, when not every file's
// StyleX rules have necessarily been collected yet. generateBundle() runs after
// all modules are transformed, so it swaps this for the final, complete CSS.
// This must be a real (harmless) rule, not a CSS comment: Vite's CSS minifier
// strips comments before generateBundle ever sees the asset source, so a
// comment-based placeholder silently disappears instead of getting replaced.
const PLACEHOLDER_SELECTOR = ".stylex-build-placeholder-8f2a71";
const BUILD_PLACEHOLDER = `${PLACEHOLDER_SELECTOR}{--x:1}`;
const BUILD_PLACEHOLDER_RE = new RegExp(
  `${PLACEHOLDER_SELECTOR.replace(".", "\\.")}\\{[^}]*\\}`,
  "g",
);

export default function stylexPlugin(): Plugin {
  const rulesByFile = new Map<string, Rule[]>();
  let isDev = true;

  const buildCss = () => {
    const rules = Array.from(rulesByFile.values()).flat();
    return stylexBabelPlugin.processStylexRules(rules, false);
  };

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
        return isDev ? buildCss() : BUILD_PLACEHOLDER;
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

    // Production build only: runs once every module has been transformed, so
    // rulesByFile is finally complete. Patch the placeholder into every emitted
    // CSS asset that contains it (Vite bundles same-chunk CSS imports together,
    // so the virtual module's content may be merged into e.g. root-*.css).
    generateBundle(_options, bundle) {
      if (isDev) return;
      const finalCss = buildCss();
      for (const file of Object.values(bundle)) {
        if (
          file.type === "asset" &&
          typeof file.source === "string" &&
          BUILD_PLACEHOLDER_RE.test(file.source)
        ) {
          BUILD_PLACEHOLDER_RE.lastIndex = 0;
          file.source = file.source.replace(BUILD_PLACEHOLDER_RE, finalCss);
        }
      }
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
