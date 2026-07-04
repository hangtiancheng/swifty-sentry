import type { IBreadcrumbItem, IReportData } from "./common.js";

import type { EventType } from "./enums.js";

export type ReportDataHook = (
  data: IReportData,
) => Promise<IReportData | false> | IReportData | false;

export type ReportBatchHook = (
  data: readonly IReportData[],
) => Promise<readonly IReportData[] | false> | readonly IReportData[] | false;

export type AfterSendDataHook = (data: readonly IReportData[]) => Promise<void> | void;

export interface IOptions {
  // Report endpoint.
  dsn: string;
  // Frontend project id.
  projectId: string;
  // Disable the SDK.
  disabled: boolean;
  // User id.
  userId: string;
  // Capture XMLHttpRequest requests.
  enableXhr: boolean;
  // Capture fetch requests.
  enableFetch: boolean;
  // Capture click events.
  enableClick: boolean;
  // Capture error events.
  enableError: boolean;
  // Capture unhandledrejection events.
  enableUnhandledRejection: boolean;
  // Capture hashchange navigation.
  enableHashChange: boolean;
  // Capture history navigation.
  enableHistory: boolean;
  // Capture performance metrics.
  enablePerformance: boolean;
  // Enable screen recording.
  enableScreenRecord: boolean;
  // Enable white screen detection.
  enableWhiteScreen: boolean;
  // Enable FingerprintJS visitor identity.
  enableFingerprint: boolean;
  // SDK-generated anonymous visitor id.
  anonymousId: string;
  // Backend-bound visitor id.
  visitorId: string;
  // Use image transport.
  useImageReport: boolean;
  // Screen record window duration.
  screenRecordDurationMs: number;
  screenRecordEventTypes: EventType[];
  // Page has a skeleton screen during white screen detection.
  hasSkeleton: boolean;
  rootCssSelectors: string[];
  // Click capture throttle delay.
  clickThrottleDelay: number;
  // Request timeout.
  requestTimeoutMilliseconds: number;
  // Breadcrumb capacity.
  maxBreadcrumbs: number;
  // Report duplicate code errors.
  repeatCodeError: boolean;
  // Report successful HTTP requests as performance events.
  enableHttpPerformance: boolean;
  // Ignored errors.
  ignoreErrors: (string | RegExp)[];
  // Excluded APIs.
  excludeApis: (string | RegExp)[];
  // Hook before pushing a breadcrumb.
  onBeforePushBreadcrumb?: ((data: IBreadcrumbItem) => IBreadcrumbItem) | undefined;
  // Offline cache maximum length.
  cacheMaxLength: number;
  // Batch waiting time in milliseconds.
  cacheWaitingTime: number;
  // Maximum queued events while offline.
  maxQueueLength: number;
  // Server recovery probe interval.
  retryIntervalMilliseconds: number;
  // Hook before reporting one event.
  onBeforeReportData?: ReportDataHook | undefined;
  // Hook before pushing a batch to transport.
  beforePushEventList?: ReportBatchHook | undefined;
  // Hook after a batch enters transport successfully.
  afterSendData?: AfterSendDataHook | undefined;
  // Offline cache localStorage key.
  offlineCacheKey: string;
  // Sampling rate between 0 and 1.
  tracesSampleRate: number;
  // HTTP error callback.
  handleHttpError?: (<T>(data: T) => boolean) | undefined;
  // Enable debug logging in the console.
  debug: boolean;
}
