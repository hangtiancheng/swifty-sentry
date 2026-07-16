import { EventType, HttpMethod, HttpStatusCode, type IHttpData, type WithSentry } from "../types";
import {
  decorateProp,
  getBaseData,
  getServerTimingFromHeaders,
  isExcludedApi,
  parseServerTiming,
  sentry,
} from "../utils";
import type { Cleanup } from "../utils/decorate-prop.js";
import { pub } from "./bus.js";

type TXhrProtoOpen = (method: string, url: string, async?: boolean, ...rest: string[]) => void;

export function pubXhr(): Cleanup {
  const xhrProto = XMLHttpRequest.prototype;
  const cleanupOpen = decorateProp(xhrProto, "open", (oldPropVal: TXhrProtoOpen) => {
    return function (
      this: WithSentry<XMLHttpRequest, IHttpData>,
      method: string,
      url: string,
      async?: boolean,
      ...rest: string[]
    ) {
      this.__sentry__ = {
        ...getBaseData(),
        name: "XMLHttpRequest",
        type: EventType.Xhr,
        method: method.toUpperCase(),
        api: url,
        elapsedTime: 0,
        statusCode: HttpStatusCode.OK,
      };
      return oldPropVal.call(this, method, url, async, ...rest);
    };
  });
  const cleanupSend = decorateProp(xhrProto, "send", (oldPropVal) => {
    return function (
      this: WithSentry<XMLHttpRequest, IHttpData>,
      body?: Document | XMLHttpRequestBodyInit | null | undefined,
    ) {
      if (!this.__sentry__) return oldPropVal.call(this, body);
      const { method, api } = this.__sentry__;
      this.addEventListener("loadend", () => {
        if (shouldIgnoreRequest(method, api)) return;
        this.__sentry__.statusCode = this.status;
        this.__sentry__.requestData = { body };
        this.__sentry__.responseData = {
          responseType: this.responseType,
          response: this.response,
        };
        this.__sentry__.serverTiming = parseServerTiming(this.getResponseHeader("server-timing"));
        this.__sentry__.elapsedTime = Date.now() - this.__sentry__.timestamp;
        pub(EventType.Xhr, this.__sentry__);
      });
      return oldPropVal.call(this, body);
    };
  });
  return () => {
    cleanupSend();
    cleanupOpen();
  };
}

export function pubFetch(): Cleanup {
  return decorateProp(globalThis, "fetch", (oldPropVal) => {
    return async function (url: RequestInfo | URL, options?: RequestInit) {
      const method = options?.method?.toUpperCase() ?? HttpMethod.Get;
      const httpData: IHttpData = {
        ...getBaseData(),
        type: EventType.Fetch,
        method,
        requestData: { body: options?.body },
        name: "Fetch",
        api: url.toString(),
        elapsedTime: 0,
        statusCode: HttpStatusCode.OK,
      };
      return oldPropVal
        .call(globalThis, url, options)
        .then((res: Response) => {
          const resClone = res.clone();
          httpData.elapsedTime = Date.now() - httpData.timestamp;
          httpData.statusCode = resClone.status;
          httpData.serverTiming = getServerTimingFromHeaders(resClone.headers);
          resClone
            .text()
            .then((responseText: string) => {
              if (shouldIgnoreRequest(method, url.toString())) return;
              httpData.responseData = responseText;
              pub(EventType.Fetch, httpData);
            })
            .catch(() => {
              if (shouldIgnoreRequest(method, url.toString())) return;
              pub(EventType.Fetch, httpData);
            });
          return res;
        })
        .catch((err: unknown) => {
          if (!shouldIgnoreRequest(method, url.toString())) {
            httpData.elapsedTime = Date.now() - httpData.timestamp;
            httpData.statusCode = 0;
            httpData.message = err instanceof Error ? err.message : "Network error";
            pub(EventType.Fetch, httpData);
          }
          throw err;
        });
    };
  });
}

function shouldIgnoreRequest(method: string, api: string): boolean {
  return (
    (method.toUpperCase() === HttpMethod.Post && api === sentry.options.dsn) || isExcludedApi(api)
  );
}
