import type { EventType } from "./enums.js";
import type { IReportPayload } from "./common.js";

export type WithSentry<T, S extends IReportPayload = IReportPayload> = T & {
  __sentry__: S;
};

export abstract class SentryPlugin {
  public type: EventType;
  constructor(type: EventType) {
    this.type = type;
  }
  abstract init(): void;
  destroy?(): void;
}
