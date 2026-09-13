import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

// GitHub Pages serves project sites from /<repo>/, so production builds default
// to the swifty-code base path. Override with DOCS_BASE (e.g. for a custom
// domain or a root-level user/org page).
const DEFAULT_BASE = "/swifty-sentry/";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: process.env.DOCS_BASE ?? (command === "build" ? DEFAULT_BASE : "/"),
  plugins: [tailwindcss()],

  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@swifty.js/lit-jsx",
    tsconfigRaw: {
      compilerOptions: {
        // Lit requires legacy class-field semantics (see lit docs:
        // "Avoiding issues with class fields").
        experimentalDecorators: true,
        useDefineForClassFields: false,
      },
    },
  },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
}));
