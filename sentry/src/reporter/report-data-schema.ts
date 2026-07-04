import { z } from "zod";

import { EventType, Status, type TReportPayload } from "../types";

export const deviceInfoSchema = z.object({
  browserName: z.string(),
  browserVersion: z.string(),
  osName: z.string(),
  osVersion: z.string(),
  userAgent: z.string(),
  deviceType: z.string(),
  deviceModel: z.string(),
  fingerprint: z.string(),
  language: z.string(),
  screenResolution: z.string(),
});

export const reportDataSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(EventType),
  name: z.string(),
  time: z.string(),
  timestamp: z.number(),
  message: z.string(),
  status: z.nativeEnum(Status),
  url: z.string(),
  userId: z.string(),
  projectId: z.string(),
  sdkVersion: z.string(),
  deviceInfo: deviceInfoSchema,
  payload: z.custom<TReportPayload>(
    (value: unknown) => typeof value === "object" && value !== null,
    "Expected a report payload object",
  ),
});

export const reportDataListSchema = z.array(reportDataSchema);

export type ValidReportData = z.infer<typeof reportDataSchema>;
