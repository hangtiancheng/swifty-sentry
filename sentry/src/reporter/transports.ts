import type { IReportData } from "../types";
import { CallbackQueue, sentryLogger, sentry } from "../utils";

export function isObjectOverSizeLimit(obj: unknown, limitInKB: number): boolean {
  const json = JSON.stringify(obj);
  const size = new TextEncoder().encode(json).byteLength;
  return size > limitInKB * 1024;
}

export function sendBeacon(data: readonly IReportData[]): boolean {
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    return navigator.sendBeacon(sentry.options.dsn, JSON.stringify(data));
  }
  return false;
}

export async function reportByFetch(
  data: readonly IReportData[],
  handleServerError: () => void,
): Promise<boolean> {
  try {
    const res = await fetch(sentry.options.dsn, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    });
    if (!res.ok) handleServerError();
    return res.ok;
  } catch (err) {
    sentryLogger.error("Fetch report failed", err);
    handleServerError();
    return false;
  }
}

export function reportByImage(data: readonly IReportData[], cbQueue: CallbackQueue): void {
  const { dsn } = sentry.options;
  cbQueue.push(() => {
    const image = new Image();
    const sep = dsn.includes("?") ? "&" : "?";
    image.src = `${dsn}${sep}data=${encodeURIComponent(JSON.stringify(data))}`;
  });
}
