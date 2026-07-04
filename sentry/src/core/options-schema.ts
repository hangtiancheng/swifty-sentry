import { z } from "zod";

import { EventType, type IOptions, type ReportDataHook } from "../types";

const reportDataHookSchema = z.custom<ReportDataHook>(
  (value: unknown) => typeof value === "function",
  "Expected a report data hook function",
);

const breadcrumbHookSchema = z.custom<IOptions["onBeforePushBreadcrumb"]>(
  (value: unknown) => typeof value === "function",
  "Expected a breadcrumb hook function",
);

const httpErrorHookSchema = z.custom<IOptions["handleHttpError"]>(
  (value: unknown) => typeof value === "function",
  "Expected an HTTP error hook function",
);

const reportBatchHookSchema = z.custom<IOptions["beforePushEventList"]>(
  (value: unknown) => typeof value === "function",
  "Expected a report batch hook function",
);

const afterSendDataHookSchema = z.custom<IOptions["afterSendData"]>(
  (value: unknown) => typeof value === "function",
  "Expected an after-send hook function",
);

const excludedApiSchema = z.union([z.string(), z.instanceof(RegExp)]);

export const optionsSchema = z.object({
  dsn: z.string(),
  projectId: z.string(),
  disabled: z.boolean(),
  userId: z.string(),
  enableXhr: z.boolean(),
  enableFetch: z.boolean(),
  enableClick: z.boolean(),
  enableError: z.boolean(),
  enableUnhandledRejection: z.boolean(),
  enableHashChange: z.boolean(),
  enableHistory: z.boolean(),
  enablePerformance: z.boolean(),
  enableScreenRecord: z.boolean(),
  enableWhiteScreen: z.boolean(),
  enableFingerprint: z.boolean(),
  anonymousId: z.string(),
  visitorId: z.string(),
  useImageReport: z.boolean(),
  screenRecordDurationMs: z.number().nonnegative(),
  screenRecordEventTypes: z.array(z.nativeEnum(EventType)),
  hasSkeleton: z.boolean(),
  rootCssSelectors: z.array(z.string()),
  clickThrottleDelay: z.number().nonnegative(),
  requestTimeoutMilliseconds: z.number().nonnegative(),
  maxBreadcrumbs: z.number().int().positive(),
  repeatCodeError: z.boolean(),
  enableHttpPerformance: z.boolean(),
  ignoreErrors: z.array(excludedApiSchema),
  excludeApis: z.array(excludedApiSchema),
  onBeforePushBreadcrumb: breadcrumbHookSchema.optional(),
  cacheMaxLength: z.number().int().positive(),
  cacheWaitingTime: z.number().nonnegative(),
  maxQueueLength: z.number().int().positive(),
  retryIntervalMilliseconds: z.number().nonnegative(),
  onBeforeReportData: reportDataHookSchema.optional(),
  beforePushEventList: reportBatchHookSchema.optional(),
  afterSendData: afterSendDataHookSchema.optional(),
  offlineCacheKey: z.string(),
  tracesSampleRate: z.number().min(0).max(1),
  handleHttpError: httpErrorHookSchema.optional(),
  debug: z.boolean(),
});

export const initOptionsSchema = optionsSchema.partial().extend({
  dsn: z.string(),
});

export type InitOptions = z.input<typeof initOptionsSchema>;
