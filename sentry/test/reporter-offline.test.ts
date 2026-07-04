import { afterEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_OPTIONS } from "../src/constants/index.js";
import { DataReporter } from "../src/reporter/index.js";
import { EventType, Status, type TReportPayload } from "../src/types/index.js";
import { sentry } from "../src/utils/index.js";

function createPayload(index: number): TReportPayload {
  return {
    id: `payload-${index}`,
    type: EventType.Custom,
    name: "CustomEvent",
    time: "2026-01-01T00:00:00.000Z",
    timestamp: index,
    message: "custom event",
    status: Status.OK,
    extra: { index },
  };
}

describe("DataReporter offline and retry behavior", () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.useRealTimers();
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: true,
    });
    sentry.setOptions({
      ...DEFAULT_OPTIONS,
      afterSendData: undefined,
      beforePushEventList: undefined,
      onBeforeReportData: undefined,
    });
  });

  it("limits offline cache to maxQueueLength", async () => {
    sentry.setOptions({
      ...DEFAULT_OPTIONS,
      dsn: "/api/log",
      maxQueueLength: 1,
    });
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: false,
    });
    const reporter = new DataReporter();

    await reporter.send(createPayload(1), true);
    await reporter.send(createPayload(2), true);

    const cache = localStorage.getItem(DEFAULT_OPTIONS.offlineCacheKey);
    expect(cache).not.toBeNull();
    expect(cache).toContain("payload-2");
    expect(cache).not.toContain("payload-1");
  });

  it("removes invalid offline cache when network recovers", () => {
    sentry.setOptions({ ...DEFAULT_OPTIONS, dsn: "/api/log" });
    localStorage.setItem(DEFAULT_OPTIONS.offlineCacheKey, "{invalid");
    new DataReporter();

    globalThis.dispatchEvent(new Event("online"));

    expect(localStorage.getItem(DEFAULT_OPTIONS.offlineCacheKey)).toBeNull();
  });

  it("uses configured retry interval for server recovery probes", async () => {
    vi.useFakeTimers();
    vi.spyOn(navigator, "sendBeacon").mockReturnValue(false);
    const fetch = vi.fn(() => Promise.resolve(new Response(null, { status: 500 })));
    vi.stubGlobal("fetch", fetch);
    sentry.setOptions({
      ...DEFAULT_OPTIONS,
      dsn: "/api/log",
      retryIntervalMilliseconds: 50,
    });

    const reporter = new DataReporter();
    await reporter.send(createPayload(1), true);
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(50);

    expect(fetch).toHaveBeenCalledWith("/api/log", expect.objectContaining({ method: "HEAD" }));
  });
});
