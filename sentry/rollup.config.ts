import { defineConfig } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { rmSync } from "node:fs";
import dts from "rollup-plugin-dts";

const external = [
  /^node:/,
  "@fingerprintjs/fingerprintjs",
  "@rrweb/record",
  "pako",
  "preact",
  "react",
  "ua-parser-js",
  "vite",
  "vue",
  "web-vitals",
  "webpack",
  "zod",
];

function cleanDist() {
  return {
    name: "clean-dist",
    buildStart() {
      rmSync("./dist", { recursive: true, force: true });
    },
  };
}

export default defineConfig([
  {
    input: {
      index: "./src/index.ts",
      preact: "./src/preact.ts",
      react: "./src/react.ts",
      vue: "./src/vue.ts",
      vite: "./src/vite.ts",
      webpack: "./src/webpack.ts",
      "plugins/index": "./src/plugins/index.ts",
    },
    output: [
      {
        dir: "./dist",
        format: "esm",
        exports: "named",
        preserveModules: true,
        preserveModulesRoot: "./src",
        plugins: [terser()],
      },
      {
        dir: "./dist",
        format: "cjs",
        exports: "named",
        preserveModules: true,
        preserveModulesRoot: "./src",
        entryFileNames: "[name].cjs",
        plugins: [terser()],
      },
    ],
    plugins: [
      cleanDist(),
      nodeResolve({
        extensions: [".js", ".json"],
      }),
      commonjs(),
      json(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
      }),
    ],
    external,
  },
  {
    input: {
      index: "./src/index.ts",
      preact: "./src/preact.ts",
      react: "./src/react.ts",
      vue: "./src/vue.ts",
      vite: "./src/vite.ts",
      webpack: "./src/webpack.ts",
      "plugins/index": "./src/plugins/index.ts",
    },
    output: {
      dir: "./dist",
      format: "esm",
      exports: "named",
      preserveModules: true,
      preserveModulesRoot: "./src",
    },
    external,
    plugins: [dts()],
  },
]);
