import type { IReportData } from "../types";
import { sentry } from "../utils";
import { isPromise } from "./promise.js";

export function applyBeforePushHook(
  sendData: readonly IReportData[],
): IReportData[] | Promise<IReportData[]> {
  const hookResult = sentry.options.beforePushEventList
    ? sentry.options.beforePushEventList(sendData)
    : sendData;
  if (isPromise(hookResult)) {
    return hookResult.then(normalizeBatchHookResult);
  }
  return normalizeBatchHookResult(hookResult);
}

function normalizeBatchHookResult(hookResult: readonly IReportData[] | false): IReportData[] {
  return hookResult === false ? [] : [...hookResult];
}
