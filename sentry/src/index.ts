import { destroy, init, isInitialized, enablePlugin } from "./core/sdk-lifecycle.js";
import { setUserId, setVisitorId, getIdentity } from "./core/identity.js";
import {
  afterSendData,
  beforePushEventList,
  beforeSendData,
  getBaseInfo,
  getIPs,
  getUserId,
  sendLocal,
  traceCustomEvent,
  traceError,
  tracePageView,
  tracePerformance,
} from "./core/api.js";

export {
  init,
  destroy,
  isInitialized,
  enablePlugin,
  setUserId,
  setVisitorId,
  getIdentity,
  getUserId,
  getBaseInfo,
  getIPs,
  beforeSendData,
  beforePushEventList,
  afterSendData,
  sendLocal,
  traceError,
  tracePerformance,
  traceCustomEvent,
  tracePageView,
};

export * from "./types";
