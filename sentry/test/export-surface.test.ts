import { describe, expect, it } from "vitest";

import * as root from "../src/index.js";
import ExposurePlugin from "../src/plugins/exposure/index.js";
import PerformancePlugin from "../src/plugins/performance/index.js";
import ScreenRecordPlugin, { unzipScreenRecord } from "../src/plugins/screen-record/index.js";
import { ReactErrorBoundary } from "../src/react.js";
import { vuePlugin } from "../src/vue.js";
import { swiftyPlugin } from "../src/swifty.js";

describe("export surface", () => {
  it("keeps the root entry framework agnostic", () => {
    expect(root.init).toBeTypeOf("function");
    expect(root.pluginEnable).toBeTypeOf("function");
    expect(root.destroy).toBeTypeOf("function");
    expect(root.traceError).toBeTypeOf("function");
    expect(Object.hasOwn(root, "ReactErrorBoundary")).toBe(false);
    expect(Object.hasOwn(root, "vuePlugin")).toBe(false);
    expect(Object.hasOwn(root, "swiftyPlugin")).toBe(false);
  });

  it("exports plugin and framework subpath entries", () => {
    expect(PerformancePlugin).toBeTypeOf("function");
    expect(ScreenRecordPlugin).toBeTypeOf("function");
    expect(unzipScreenRecord).toBeTypeOf("function");
    expect(ExposurePlugin).toBeTypeOf("function");
    expect(ReactErrorBoundary).toBeTypeOf("function");
    expect(vuePlugin).toBeTypeOf("function");
    expect(swiftyPlugin).toBeTypeOf("function");
  });
});
