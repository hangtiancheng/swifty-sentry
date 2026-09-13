// webpack.config.mjs
import { sentryPlugin } from "@swifty.js/sentry/webpack";

export default {
  plugins: [sentryPlugin({ dsn: "/api/log" })],
  devServer: {/* your config */},
};
