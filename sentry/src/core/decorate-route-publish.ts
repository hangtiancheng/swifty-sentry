import { EventType } from "../types";
import { decorateProp, getBaseData } from "../utils";
import type { Cleanup } from "../utils/decorate-prop.js";
import { pub } from "./bus.js";

let latestHref = "";

function getCurrentRouteUrl(): string {
  return "document" in globalThis ? globalThis.document.location.href : "";
}

function normalizeRouteUrl(url: string | URL): string {
  return new URL(url.toString(), getCurrentRouteUrl()).href;
}

export function pubHistory(): Cleanup {
  const oldOnpopstate = globalThis.onpopstate;
  latestHref = getCurrentRouteUrl();

  globalThis.onpopstate = function (this: Window, ev: PopStateEvent) {
    const from = latestHref;
    const to = getCurrentRouteUrl();
    if (from === to) {
      return oldOnpopstate?.call(this, ev);
    }
    latestHref = to;
    pub(EventType.History, {
      ...getBaseData(),
      type: EventType.History,
      from,
      to,
    });
    if (typeof oldOnpopstate === "function") {
      return oldOnpopstate.call(this, ev);
    }
  };

  const historyDecorator = (oldPropsVal: History["pushState"]) => {
    return function (this: History, data: unknown, unused: string, url?: string | URL | null) {
      if (url) {
        const from = latestHref;
        const to = normalizeRouteUrl(url);
        if (from === to) {
          return oldPropsVal.call(this, data, unused, url);
        }
        latestHref = to;
        pub(EventType.History, {
          ...getBaseData(),
          type: EventType.History,
          from,
          to,
        });
      }
      return oldPropsVal.call(this, data, unused, url);
    };
  };
  const cleanupPushState = decorateProp(globalThis.history, "pushState", historyDecorator);
  const cleanupReplaceState = decorateProp(globalThis.history, "replaceState", historyDecorator);
  return () => {
    globalThis.onpopstate = oldOnpopstate;
    cleanupReplaceState();
    cleanupPushState();
  };
}
