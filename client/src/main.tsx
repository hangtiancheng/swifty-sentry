import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { init, enablePlugin } from "@swifty.js/sentry";
import {
  PerformancePlugin,
  ScreenRecordPlugin,
  ExposurePlugin,
} from "@swifty.js/sentry/plugins";

init({ dsn: "/api/log", debug: true });
enablePlugin(new PerformancePlugin());
enablePlugin(new ScreenRecordPlugin());
enablePlugin(new ExposurePlugin());

createRoot(document.getElementById("root")!).render(<App />);
