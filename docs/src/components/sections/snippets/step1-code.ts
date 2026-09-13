import { init } from "@swifty.js/sentry";

init({
  dsn: "/api/log",
  projectId: "checkout-web",
  userId: "user-001",
});
