import { afterEach, describe, expect, it, vi } from "vitest";

import {
  destroy,
  getIdentity,
  init,
  isInitialized,
  pluginEnable,
  setUserId,
  setVisitorId,
} from "../src/index.js";
import setup from "../src/core/setup.js";
import { EventType, SentryPlugin } from "../src/types/index.js";

const fingerprintGet = vi.hoisted(() =>
  vi.fn(() => Promise.resolve({ visitorId: "anonymous-1" })),
);
const fingerprintLoad = vi.hoisted(() =>
  vi.fn(() => Promise.resolve({ get: fingerprintGet })),
);

vi.mock("@fingerprintjs/fingerprintjs", () => ({
  default: {
    load: fingerprintLoad,
  },
}));

vi.mock("../src/core/setup.js", () => ({
  default: vi.fn(() => vi.fn()),
}));

describe("init", () => {
  afterEach(() => {
    destroy();
    localStorage.clear();
  });

  it("does not call setup when dsn is empty", () => {
    init({ dsn: "" });

    expect(setup).not.toHaveBeenCalled();
  });

  it("calls setup when dsn is provided", () => {
    init({ dsn: "/api/log" });

    expect(setup).toHaveBeenCalledTimes(1);
    expect(isInitialized()).toBe(true);
  });

  it("does not setup twice before destroy", () => {
    init({ dsn: "/api/log" });
    init({ dsn: "/api/log" });

    expect(setup).toHaveBeenCalledTimes(1);
  });

  it("cleans up initialized state on destroy", () => {
    init({ dsn: "/api/log" });
    destroy();

    expect(isInitialized()).toBe(false);
  });

  it("does not initialize when disabled", () => {
    init({ dsn: "/api/log", disabled: true });

    expect(setup).not.toHaveBeenCalled();
    expect(isInitialized()).toBe(false);
  });
});

describe("pluginEnable", () => {
  it("initializes plugin instances", () => {
    const initPlugin = vi.fn();

    class TestPlugin extends SentryPlugin {
      constructor() {
        super(EventType.Custom);
      }

      init(): void {
        initPlugin();
      }
    }

    const plugin = pluginEnable(TestPlugin);

    expect(initPlugin).toHaveBeenCalledTimes(1);
    expect(plugin).toBeInstanceOf(TestPlugin);
  });
});

describe("identity", () => {
  afterEach(() => {
    destroy();
    localStorage.clear();
    fingerprintGet.mockClear();
    fingerprintLoad.mockClear();
  });

  it("updates visitor and user identity", () => {
    setVisitorId("visitor-1");
    setUserId("user-1");

    expect(getIdentity()).toMatchObject({
      visitorId: "visitor-1",
      userId: "user-1",
      hasVisitorId: true,
    });
  });

  it("collects and persists FingerprintJS anonymous identity", async () => {
    init({ dsn: "/api/log", enableFingerprint: true });

    await vi.waitFor(() => {
      expect(getIdentity()).toMatchObject({
        anonymousId: "anonymous-1",
        hasAnonymousId: true,
      });
    });
    expect(localStorage.getItem("swifty_sentry_anonymous_id")).toBe(
      "anonymous-1",
    );
  });

  it("reuses stored anonymous identity before loading FingerprintJS", async () => {
    localStorage.setItem("swifty_sentry_anonymous_id", "stored-anonymous");

    init({ dsn: "/api/log", enableFingerprint: true });

    await vi.waitFor(() => {
      expect(getIdentity()).toMatchObject({
        anonymousId: "stored-anonymous",
        hasAnonymousId: true,
      });
    });
    expect(fingerprintLoad).not.toHaveBeenCalled();
  });
});
