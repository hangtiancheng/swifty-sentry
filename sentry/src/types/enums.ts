export enum HttpStatus {
  OK = "OK", // 200
  BadRequest = "Bad Request", // 400
  Unauthorized = "Unauthorized", // 401
  Forbidden = "Forbidden", // 403
  NotFound = "NotFound", // 404
  Conflict = "Conflict", // 409
  PayloadTooLarge = "Payload Too Large", // 413
  TooManyRequests = "Too Many Requests", // 429
  InternalServerError = "Internal Server Error", // 500
  NotImplemented = "Not Implemented", // 501
  ServiceUnavailable = "Service Unavailable", // 503
  GatewayTimeout = "Gateway Timeout", // 504
  UnknownError = "Unknown Error",
}

export enum BreadcrumbType {
  // Network request.
  Http = "Http",
  // User click.
  Click = "Click",
  // Route navigation.
  Route = "Route",
  // Resource loading.
  Resource = "Resource",
  // Code error.
  CodeError = "Code Error",
  // Custom event.
  Custom = "Custom",
}

export enum Status {
  Error = "Error",
  OK = "OK",
}

export enum EventType {
  Xhr = "XMLHttpRequest",
  Fetch = "fetch",
  Click = "Click",
  HashChange = "Event hashchange",
  History = "History",
  Resource = "Resource",
  UnhandledRejection = "Event unhandledrejection",
  Error = "Error",
  Vue = "Vue",
  React = "React",
  Swifty = "Swifty",
  Performance = "Performance",
  ScreenRecord = "ScreenRecord",
  Exposure = "Exposure",
  WhiteScreen = "WhiteScreen",
  Custom = "Custom",
  PV = "PV",
}

export enum HttpType {
  Xhr = "XMLHttpRequest",
  Fetch = "fetch",
}

export enum HttpStatusCode {
  OK = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  PayloadTooLarge = 413,
  TooManyRequests = 429,
  InternalServerError = 500,
  NotImplemented = 501,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
}

export enum HttpMethod {
  Get = "GET",
  Head = "HEAD",
  Post = "POST",
  Put = "PUT",
  Delete = "DELETE",
  Connect = "CONNECT",
  Options = "OPTIONS",
  Trace = "TRACE",
  Patch = "PATCH",
}
