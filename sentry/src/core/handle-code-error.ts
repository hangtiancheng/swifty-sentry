import {
  EventType,
  Status,
  type IBatchErrorData,
  type ICodeError,
  type IReportPayload,
  type TReportPayload,
} from "../types";
import { base64v2, event2breadcrumb, getBaseData, isIgnoredError, sentry } from "../utils";
import { UNKNOWN } from "../constants";
import reporter from "../reporter";
import breadcrumb from "./breadcrumb.js";

class BatchErrorManager {
  private cacheError: TReportPayload[] = [];
  private timeoutID: ReturnType<typeof setTimeout> | undefined;

  public push(error: TReportPayload): void {
    this.cacheError.push(error);
    if (this.timeoutID) clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(() => this.flush(), 2000);
  }

  public destroy(): void {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
      this.timeoutID = undefined;
    }
    this.cacheError = [];
  }

  private flush(): void {
    if (this.cacheError.length === 0) return;
    const groups: Record<string, TReportPayload[]> = {};
    for (const err of this.cacheError) {
      const key = `${err.type}-${err.name}-${err.message}`;
      groups[key] = [...(groups[key] ?? []), err];
    }
    this.cacheError = [];
    for (const [, items] of Object.entries(groups)) {
      this.reportGroup(items);
    }
  }

  private reportGroup(items: readonly TReportPayload[]): void {
    const maxLength = 5;
    if (items.length < maxLength) {
      items.forEach((item) => reporter.send(item));
      return;
    }
    const sumItem = items[0];
    if (!sumItem) return;
    const batchErrorData: IBatchErrorData = {
      ...sumItem,
      batchError: true,
      batchErrorLength: items.length,
      batchErrorLastHappenTime: items.at(-1)?.timestamp ?? sumItem.timestamp,
    };
    reporter.send(batchErrorData);
  }
}

const batchErrorManager = new BatchErrorManager();

export function destroyBatchErrorManager(): void {
  batchErrorManager.destroy();
}

export function handleCodeError(err: ErrorEvent): void {
  const { filename, colno: column, lineno: line, message } = err;
  if (isIgnoredError(message)) return;
  const data: IReportPayload = {
    ...getBaseData(),
    type: EventType.Error,
    name: filename,
    message,
    status: Status.Error,
  };
  const codeError: ICodeError = { ...data, column, line };
  breadcrumb.push({ ...data, userAction: event2breadcrumb(EventType.Error) });
  const hasUnknownSource = !filename || filename === UNKNOWN;
  const errorId = base64v2(`${EventType.Error}-${message}-${filename}-${line}-${column}`);
  if (hasUnknownSource || sentry.options.repeatCodeError || !sentry.codeErrors.has(errorId)) {
    sentry.codeErrors.add(errorId);
    batchErrorManager.push(codeError);
  }
}
