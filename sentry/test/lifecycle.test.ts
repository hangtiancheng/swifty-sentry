import { afterEach, describe, expect, it, vi } from "vitest";

import { destroy, init } from "../src/index.js";

describe("lifecycle", () => {
  afterEach(() => {
    destroy();
    vi.restoreAllMocks();
  });

  it("respects capture switches during setup", () => {
    const addEventListener = vi.spyOn(document, "addEventListener");

    init({
      dsn: "/api/log",
      enableClick: false,
      enableError: false,
      enableFetch: false,
      enableHashChange: false,
      enableHistory: false,
      enableUnhandledRejection: false,
      enableWhiteScreen: false,
      enableXhr: false,
    });

    expect(addEventListener).not.toHaveBeenCalledWith("click", expect.any(Function));
  });

  it("restores fetch after destroy", () => {
    const originalFetch = globalThis.fetch;

    init({
      dsn: "/api/log",
      enableClick: false,
      enableError: false,
      enableHashChange: false,
      enableHistory: false,
      enableUnhandledRejection: false,
      enableWhiteScreen: false,
      enableXhr: false,
    });
    expect(globalThis.fetch).not.toBe(originalFetch);

    destroy();

    expect(globalThis.fetch).toBe(originalFetch);
  });
});
