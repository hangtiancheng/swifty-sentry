import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// import sentryPlugin from "@swifty.js/sentry/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // sentryPlugin({ dsn: "/api/log" })
  ],
  optimizeDeps: {
    // 禁止预构建依赖
    exclude: ["@swifty.js/sentry"],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8088",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/static": {
        target: "http://127.0.0.1:8088",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/static/, ""),
      },
    },
  },
});
