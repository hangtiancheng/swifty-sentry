export function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  return (
    value instanceof Promise ||
    (value !== null &&
      typeof value === "object" &&
      "then" in value &&
      typeof (value as Record<string, unknown>).then === "function")
  );
}
