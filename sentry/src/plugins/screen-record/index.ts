import { EventType, SentryPlugin } from "../../types";

import { sentry } from "../../utils";

import reporter from "../../reporter";

import { DEFAULT_OPTIONS } from "../../constants";

import { recorder } from "./recorder.js";

type Cleanup = () => void;

export interface ScreenRecordPluginOptions {
  durationMs?: number;
  eventTypes?: EventType[];
}

class ScreenRecordPlugin extends SentryPlugin {
  durationMs = DEFAULT_OPTIONS.screenRecordDurationMs;
  eventTypes: EventType[] = DEFAULT_OPTIONS.screenRecordEventTypes;
  private cleanup: Cleanup | null = null;

  constructor(
    options: ScreenRecordPluginOptions = {
      durationMs: DEFAULT_OPTIONS.screenRecordDurationMs,
      eventTypes: DEFAULT_OPTIONS.screenRecordEventTypes,
    },
  ) {
    super(EventType.ScreenRecord);
    const {
      durationMs = DEFAULT_OPTIONS.screenRecordDurationMs,
      eventTypes = DEFAULT_OPTIONS.screenRecordEventTypes,
    } = options;
    this.durationMs = durationMs;
    this.eventTypes = eventTypes;
  }

  init() {
    sentry.options.enableScreenRecord = true;
    sentry.options.screenRecordEventTypes = this.eventTypes;
    sentry.options.screenRecordDurationMs = this.durationMs;
    void recorder(reporter).then((cleanup) => {
      this.cleanup = cleanup;
    });
  }

  override destroy(): void {
    this.cleanup?.();
    this.cleanup = null;
  }
}

export default ScreenRecordPlugin;
export { unzipScreenRecord } from "./recorder.js";
