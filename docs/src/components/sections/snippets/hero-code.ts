import { init, enablePlugin, traceError } from "@swifty.js/sentry";
import { PerformancePlugin } from "@swifty.js/sentry/plugins";

init({ dsn: "/api/log", projectId: "web" });
enablePlugin(new PerformancePlugin());

traceError(new Error("checkout failed"));
