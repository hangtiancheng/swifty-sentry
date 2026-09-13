import { enablePlugin } from "@swifty.js/sentry";
import { ExposurePlugin } from "@swifty.js/sentry/plugins";

const exposure = new ExposurePlugin();
enablePlugin(exposure);

exposure.observe({
  target: document.querySelector("#banner")!,
  threshold: 0.5,
  params: { bannerId: "spring-001" },
});
