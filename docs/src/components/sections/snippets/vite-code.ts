// vite.config.ts
import { defineConfig } from "vite";
import { sentryPlugin } from "@swifty.js/sentry/vite";

export default defineConfig({
  plugins: [sentryPlugin({ dsn: "/api/log" })],
});
