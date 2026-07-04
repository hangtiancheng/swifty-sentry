import { SDK_VERSION } from "../constants";
import type { IReportData, TReportPayload } from "../types";
import { sentry } from "../utils";
import { isPromise } from "./promise.js";

export function payloadToReportData<T extends TReportPayload>(
  id: string,
  payload: T,
): IReportData<T> {
  const { type, name, time, timestamp, message, status } = payload;
  return {
    type,
    name,
    time,
    timestamp,
    message,
    status,
    id,
    url: location.href,
    userId: sentry.options.userId,
    projectId: sentry.options.projectId,
    sdkVersion: SDK_VERSION,
    deviceInfo: sentry.deviceInfo,
    payload,
  };
}

export function runBeforeReportHook(
  id: string,
  payload: TReportPayload,
): IReportData | null | Promise<IReportData | null> {
  const data = payloadToReportData(id, payload);
  if (!sentry.options.onBeforeReportData) return data;
  const hookResult = sentry.options.onBeforeReportData(data);
  if (isPromise(hookResult)) {
    return hookResult.then(normalizeReportHookResult);
  }
  return normalizeReportHookResult(hookResult);
}

function normalizeReportHookResult(hookResult: IReportData | false): IReportData | null {
  return hookResult === false ? null : hookResult;
}
