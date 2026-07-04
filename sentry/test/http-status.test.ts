import { describe, expect, it } from "vitest";

import transformHttpData from "../src/utils/transform-http-data.js";
import {
  EventType,
  HttpMethod,
  HttpStatusCode,
  Status,
  type IHttpData,
} from "../src/types/index.js";

function createHttpData(statusCode: number): IHttpData {
  return {
    id: "http-event",
    type: EventType.Fetch,
    name: "Fetch",
    time: "2026-01-01T00:00:00.000Z",
    timestamp: 1,
    message: "",
    status: Status.OK,
    method: HttpMethod.Get,
    api: "/api/example",
    elapsedTime: 10,
    statusCode,
  };
}

describe("transformHttpData", () => {
  it("keeps 2xx responses as successful HTTP data", () => {
    const data = transformHttpData(createHttpData(HttpStatusCode.OK));

    expect(data.status).toBe(Status.OK);
    expect(data.message).toBe("Successful responses");
  });

  it("marks 5xx responses as error HTTP data", () => {
    const data = transformHttpData(createHttpData(HttpStatusCode.InternalServerError));

    expect(data.status).toBe(Status.Error);
    expect(data.message).toBe("Server error responses");
  });
});
