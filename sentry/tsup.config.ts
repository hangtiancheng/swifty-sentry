import { defineConfig } from "tsup";

const external = [
  "@fingerprintjs/fingerprintjs",
  "@rrweb/record",
  "pako",
  "react",
  "tslib",
  "ua-parser-js",
  "vite",
  "vue",
  "web-vitals",
  "webpack",
  "zod",
];

export default defineConfig({
  entry: {
    index: "./src/index.ts",
    react: "./src/react.ts",
    vue: "./src/vue.ts",
    vite: "./src/vite.ts",
    webpack: "./src/webpack.ts",
    swifty: "./src/swifty.ts",
    "plugins/index": "./src/plugins/index.ts",
  },
  format: ["esm", "cjs"],
  outDir: "./dist",
  tsconfig: "./tsconfig.build.json",
  sourcemap: false,
  dts: true,
  clean: true,
  minify: true,
  splitting: false,
  external,
});
