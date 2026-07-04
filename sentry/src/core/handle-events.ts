import { EventType, Status, type IBaseDataWithEvent, type TEventHandler } from "../types";
import {
  event2breadcrumb,
  getDeclarativeClickData,
  isIExtendedErrorEvent,
  sentryLogger,
  sentry,
} from "../utils";
import reporter from "../reporter";
import breadcrumb from "./breadcrumb.js";
import checkWhiteScreen from "./white-screen.js";
import { handleCodeError } from "./handle-code-error.js";
import { handleError } from "./handle-error.js";

export const handleUnhandledRejection: TEventHandler<IBaseDataWithEvent> = (
  data: IBaseDataWithEvent,
) => {
  sentryLogger.error("Unhandled rejection captured", data.extra);
  if (!isIExtendedErrorEvent(data.extra)) {
    handleError(data);
    return;
  }
  handleCodeError(data.extra);
};

export const handleWhiteScreen: TEventHandler<IBaseDataWithEvent> = (data: IBaseDataWithEvent) => {
  checkWhiteScreen(() => {
    reporter.send(data);
  });
};

export const handleClick: TEventHandler<IBaseDataWithEvent> = ({
  extra,
  ...rest
}: IBaseDataWithEvent) => {
  if (!(extra instanceof MouseEvent)) return;
  const clickData = getDeclarativeClickData(extra);
  if (!clickData) return;
  const data: IBaseDataWithEvent = {
    ...rest,
    type: EventType.Click,
    name: clickData.ev || clickData.msg,
    message: clickData.msg || clickData.ev,
    status: Status.OK,
    extra: clickData,
  };
  breadcrumb.push({ ...data, userAction: event2breadcrumb(EventType.Click) });
  if (sentry.options.enableClick) {
    reporter.send(data);
  }
};
