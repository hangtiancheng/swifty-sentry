import { Status, EventType } from "../types/index.js";
import type { AfterSendDataHook, ReportBatchHook, ReportDataHook } from "../types/index.js";
import { getBaseData, sentry } from "../utils/index.js";
import { handleError } from "./handlers.js";
import reporter from "../reporter/index.js";
import { getIPs } from "./ip.js";

export { getIPs };

export function traceError(error: unknown): void {
  handleError({
    ...getBaseData(),
    type: EventType.Error,
    status: Status.Error,
    extra: error,
  });
}

export function tracePerformance(input: {
  readonly name: string;
  readonly message: string;
  readonly value: number;
}): void {
  reporter.send({
    ...getBaseData(),
    type: EventType.Performance,
    status: Status.OK,
    ...input,
  });
}

export function traceCustomEvent(input: {
  readonly name: string;
  readonly message: string;
  readonly extra?: unknown;
}): void {
  reporter.send({
    ...getBaseData(),
    type: EventType.Custom,
    status: Status.OK,
    name: input.name,
    message: input.message,
    extra: input.extra,
  });
}

export function tracePageView(
  input: {
    readonly name?: string;
    readonly message?: string;
    readonly extra?: unknown;
  } = {},
): void {
  reporter.send({
    ...getBaseData(),
    type: EventType.PV,
    name: input.name ?? "ManualPageView",
    message: input.message ?? location.href,
    status: Status.OK,
    extra: input.extra ?? {
      url: location.href,
      referrer: document.referrer,
    },
  });
}

export function getUserId(): string {
  return sentry.options.userId;
}

export function getBaseInfo() {
  return getBaseData();
}

export function beforeSendData(hook: ReportDataHook): void {
  sentry.setOptions({ onBeforeReportData: hook });
}

export function beforePushEventList(hook: ReportBatchHook): void {
  sentry.setOptions({ beforePushEventList: hook });
}

export function afterSendData(hook: AfterSendDataHook): void {
  sentry.setOptions({ afterSendData: hook });
}

export async function sendLocal(): Promise<void> {
  await reporter.flushOfflineCache();
}
