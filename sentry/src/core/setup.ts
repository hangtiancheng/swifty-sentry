import { EventType } from "../types";
import { sentryLogger, sentry } from "../utils";
import type { Cleanup } from "../utils/decorate-prop.js";

import { clearSubscriptions, sub } from "./bus.js";
import { flushCurrentPageDwell, initPageView, resetPageView } from "./pv-lifecycle.js";

import {
  handleClick,
  handleError,
  handleHashChange,
  handleHistory,
  handleHttp,
  handleUnhandledRejection,
  handleWhiteScreen,
} from "./handlers.js";

import decoratePublish from "./decorate-publish.js";

function setup(): Cleanup {
  sentryLogger.info("Initializing SDK event subscriptions...");

  const subscriptions = [
    {
      enabled: sentry.options.enableXhr,
      type: EventType.Xhr,
      subscribe: () => sub(EventType.Xhr, handleHttp),
      name: "Xhr",
    },
    {
      enabled: sentry.options.enableFetch,
      type: EventType.Fetch,
      subscribe: () => sub(EventType.Fetch, handleHttp),
      name: "Fetch",
    },
    {
      enabled: sentry.options.enableError,
      type: EventType.Error,
      subscribe: () => sub(EventType.Error, handleError),
      name: "Error",
    },
    {
      enabled: sentry.options.enableHistory,
      type: EventType.History,
      subscribe: () => sub(EventType.History, handleHistory),
      name: "History",
    },
    {
      enabled: sentry.options.enableHashChange,
      type: EventType.HashChange,
      subscribe: () => sub(EventType.HashChange, handleHashChange),
      name: "HashChange",
    },
    {
      enabled: sentry.options.enableUnhandledRejection,
      type: EventType.UnhandledRejection,
      subscribe: () => sub(EventType.UnhandledRejection, handleUnhandledRejection),
      name: "UnhandledRejection",
    },
    {
      enabled: sentry.options.enableClick,
      type: EventType.Click,
      subscribe: () => sub(EventType.Click, handleClick),
      name: "Click",
    },
    {
      enabled: sentry.options.enableWhiteScreen,
      type: EventType.WhiteScreen,
      subscribe: () => sub(EventType.WhiteScreen, handleWhiteScreen),
      name: "WhiteScreen",
    },
  ].filter(({ enabled }) => enabled);

  const cleanups: Cleanup[] = [];
  subscriptions.forEach(({ type, subscribe }) => {
    cleanups.push(subscribe());
    cleanups.push(decoratePublish(type));
  });

  initPageView();

  const beforeUnloadHandler = () => {
    flushCurrentPageDwell(true);
  };
  globalThis.addEventListener("beforeunload", beforeUnloadHandler);
  cleanups.push(() => {
    globalThis.removeEventListener("beforeunload", beforeUnloadHandler);
  });

  sentryLogger.success(
    "SDK setup completed",
    subscriptions.map((s) => ({ event: s.name, type: s.type })),
  );
  return () => {
    cleanups.toReversed().forEach((cleanup) => {
      cleanup();
    });
    resetPageView();
    clearSubscriptions();
  };
}

export default setup;
