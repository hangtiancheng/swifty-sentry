import {
  EventType,
  Status,
  type IBaseDataWithEvent,
  type IResourceError,
  type TEventHandler,
} from "../types";
import {
  base64v2,
  event2breadcrumb,
  isError,
  isErrorEvent,
  isIExtendedErrorEvent,
  isIgnoredError,
  sentryLogger,
  sentry,
} from "../utils";
import reporter from "../reporter";
import breadcrumb from "./breadcrumb.js";
import { handleCodeError } from "./handle-code-error.js";

export const handleError: TEventHandler<IBaseDataWithEvent> = ({ extra: err, ...rest }) => {
  sentryLogger.error("Error captured", err);
  if (isErrorEvent(err)) {
    if (!isIgnoredError(err.message)) handleCodeError(err);
    return;
  }
  if (isIExtendedErrorEvent(err)) {
    reportResourceError(err, rest);
    return;
  }
  if (isError(err)) {
    reportRuntimeError(err, rest);
    return;
  }
  reportUnknownError(err, rest);
};

function reportResourceError(
  err: ErrorEvent & {
    target: { localName: string; src: string; href: string };
  },
  rest: Omit<IBaseDataWithEvent, "extra">,
): void {
  const { localName, src, href } = err.target;
  const resourceError: IResourceError = {
    ...rest,
    type: EventType.Resource,
    status: Status.Error,
    name: localName,
    src,
    href,
    message: err.message,
  };
  breadcrumb.push({
    ...resourceError,
    userAction: event2breadcrumb(EventType.Resource),
  });
  const errorId = base64v2(`${EventType.Resource}-${localName}-${src || href}`);
  if (sentry.options.repeatCodeError || !sentry.codeErrors.has(errorId)) {
    sentry.codeErrors.add(errorId);
    reporter.send(resourceError);
  }
}

function reportRuntimeError(err: Error, rest: Omit<IBaseDataWithEvent, "extra">): void {
  const { name, message, stack } = err;
  if (isIgnoredError(message)) return;
  reportBaseError({
    ...rest,
    type: EventType.Error,
    name,
    message,
    extra: stack || err,
  });
}

function reportUnknownError(err: unknown, rest: Omit<IBaseDataWithEvent, "extra">): void {
  const message = typeof err === "string" ? err : JSON.stringify(err);
  if (isIgnoredError(message)) return;
  reportBaseError({
    ...rest,
    type: EventType.Error,
    name: "Unknown Error",
    message,
    extra: err,
  });
}

function reportBaseError(data: IBaseDataWithEvent): void {
  const payload: IBaseDataWithEvent = { ...data, status: Status.Error };
  breadcrumb.push({
    ...payload,
    userAction: event2breadcrumb(EventType.Error),
  });
  const errorId = base64v2(`${EventType.Error}-${payload.name}-${payload.message}`);
  if (sentry.options.repeatCodeError || !sentry.codeErrors.has(errorId)) {
    sentry.codeErrors.add(errorId);
    reporter.send(payload);
  }
}
