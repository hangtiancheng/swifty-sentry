import { EventType, SentryPlugin, type IPerformanceData } from "../../types";

import reporter from "../../reporter";

import { getBaseData } from "../../utils";
import type { Cleanup } from "../../utils/decorate-prop.js";

import { getNavigationTimingData } from "./navigation-timing.js";
import { getWebVitals } from "./perf.js";
import { supportsPerformanceEntryType } from "./performance-observer-support.js";
import { observeResourceElementFallback } from "./resource-element-fallback.js";
import { getInitialResourceListData, observeResourceTimings } from "./resource-timing.js";

function noop(): void {}

class PerformancePlugin extends SentryPlugin {
  private cleanups: Cleanup[] = [];

  constructor() {
    super(EventType.Performance);
  }

  init(): void {
    this.startWebVitals();
    this.cleanups.push(this.observeLongTasks());
    this.cleanups.push(observeResourceTimings((data) => this.report(data)));
    this.cleanups.push(observeResourceElementFallback((data) => this.report(data)));
    this.cleanups.push(
      this.onPageReady(() => {
        this.reportPageLoadTimings();
      }),
    );
    void this.reportMemory();
  }

  destroy(): void {
    this.cleanups.toReversed().forEach((cleanup) => {
      cleanup();
    });
    this.cleanups = [];
  }

  private report(data: IPerformanceData): void {
    reporter.send(data);
  }

  private startWebVitals(): void {
    try {
      getWebVitals((data: IPerformanceData) => {
        this.report(data);
      });
    } catch {
      return;
    }
  }

  private observeLongTasks(): Cleanup {
    if (!supportsPerformanceEntryType("longtask")) {
      return noop;
    }
    const observer = new globalThis.PerformanceObserver((entryList) => {
      const longTaskData: IPerformanceData = {
        ...getBaseData(),
        name: "LongTask",
        type: EventType.Performance,
        longTasks: entryList.getEntries(),
      };
      this.report(longTaskData);
    });
    observer.observe({ entryTypes: ["longtask"] });
    return () => {
      observer.disconnect();
    };
  }

  private onPageReady(callback: () => void): Cleanup {
    if (document.readyState === "complete") {
      queueMicrotask(callback);
      return noop;
    }
    const listener = () => {
      callback();
    };
    globalThis.addEventListener("load", listener, { once: true });
    return () => {
      globalThis.removeEventListener("load", listener);
    };
  }

  private reportPageLoadTimings(): void {
    const navigationTimingData = getNavigationTimingData();
    if (navigationTimingData) {
      this.report(navigationTimingData);
    }
    const resourceListData = getInitialResourceListData();
    if (resourceListData) {
      this.report(resourceListData);
    }
  }

  private async reportMemory(): Promise<void> {
    if (
      "performance" in globalThis &&
      "measureUserAgentSpecificMemory" in globalThis.performance &&
      typeof globalThis.performance.measureUserAgentSpecificMemory === "function"
    ) {
      const memoryData: IPerformanceData = {
        ...getBaseData(),
        name: "Memory",
        type: EventType.Performance,
        message: "performance.measureUserAgentSpecificMemory",
        memory: await globalThis.performance.measureUserAgentSpecificMemory(),
      };
      this.report(memoryData);
    }
  }
}

export default PerformancePlugin;
