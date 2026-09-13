import { enablePlugin } from "@swifty.js/sentry";
import {
  PerformancePlugin,
  ScreenRecordPlugin,
  ExposurePlugin,
} from "@swifty.js/sentry/plugins";

enablePlugin(
  new PerformancePlugin(),
  new ScreenRecordPlugin({ durationMs: 5000 }),
  new ExposurePlugin(),
);
