import { init, enablePlugin } from "@swifty.js/sentry";
import { PerformancePlugin } from "@swifty.js/sentry/plugins";

init({ dsn: "/api/log", projectId: "vanilla-app" });

enablePlugin(new PerformancePlugin());
