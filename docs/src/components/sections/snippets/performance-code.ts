import { enablePlugin, tracePerformance } from "@swifty.js/sentry";
import { PerformancePlugin } from "@swifty.js/sentry/plugins";

enablePlugin(new PerformancePlugin());

tracePerformance({
  name: "SearchLatency",
  message: "/api/search",
  value: 128,
});
