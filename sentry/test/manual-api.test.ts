import { afterEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_OPTIONS } from "../src/constants/index.js";
import {
  afterSendData,
  beforePushEventList,
  beforeSendData,
  getBaseInfo,
  getIPs,
  getUserId,
  sendLocal,
  setUserId,
  traceCustomEvent,
  tracePageView,
  tracePerformance,
} from "../src/index.js";
import { EventType } from "../src/types/index.js";
import { sentry } from "../src/utils/index.js";

describe("manual public APIs", () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    sentry.setOptions(DEFAULT_OPTIONS);
  });

  it("exposes current user id", () => {
    setUserId("user-1");

    expect(getUserId()).toBe("user-1");
  });

  it("returns base report context", () => {
    expect(getBaseInfo()).toMatchObject({
      type: EventType.Custom,
      status: "OK",
    });
  });

  it("reports manual custom, page view, and performance events", async () => {
    const sendBeacon = vi.spyOn(navigator, "sendBeacon").mockReturnValue(true);
    sentry.setOptions({
      ...DEFAULT_OPTIONS,
      dsn: "/api/log",
      cacheMaxLength: 1,
    });

    traceCustomEvent({ name: "custom", message: "custom message" });
    tracePageView({ name: "pv", message: "/home" });
    tracePerformance({ name: "api", message: "/api", value: 100 });

    expect(sendBeacon).toHaveBeenCalledTimes(3);
  });

  it("registers runtime report hooks", async () => {
    const afterSend = vi.fn();
    const sendBeacon = vi.spyOn(navigator, "sendBeacon").mockReturnValue(true);
    sentry.setOptions({
      ...DEFAULT_OPTIONS,
      dsn: "/api/log",
      cacheMaxLength: 1,
    });

    beforeSendData((data) => ({ ...data, name: "renamed" }));
    beforePushEventList((events) => events.slice(0, 1));
    afterSendData(afterSend);
    traceCustomEvent({ name: "custom", message: "custom message" });

    expect(sendBeacon.mock.calls[0]?.[1]).toContain("renamed");
    expect(afterSend).toHaveBeenCalledTimes(1);
  });

  it("flushes stored offline reports through sendLocal", async () => {
    const sendBeacon = vi.spyOn(navigator, "sendBeacon").mockReturnValue(true);
    sentry.setOptions({ ...DEFAULT_OPTIONS, dsn: "/api/log" });
    const payload = {
      ...getBaseInfo(),
      type: EventType.Custom,
      name: "offline",
      message: "offline",
    };
    localStorage.setItem(
      DEFAULT_OPTIONS.offlineCacheKey,
      JSON.stringify([
        {
          ...payload,
          url: location.href,
          userId: "unknown",
          projectId: "unknown",
          sdkVersion: "1.0.2",
          deviceInfo: sentry.deviceInfo,
          payload,
        },
      ]),
    );

    await sendLocal();

    expect(sendBeacon).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(DEFAULT_OPTIONS.offlineCacheKey)).toBeNull();
  });

  it("returns an empty IP list when WebRTC is unavailable", async () => {
    Object.defineProperty(globalThis, "RTCPeerConnection", {
      configurable: true,
      value: undefined,
    });

    await expect(getIPs()).resolves.toEqual([]);
  });
});
