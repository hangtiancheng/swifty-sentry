import { sentryLogger, sentry } from "../utils";
import { unrefTimer } from "./timer.js";

interface ServerRecoveryCallbacks {
  readonly setOnline: (online: boolean) => void;
  readonly setRetryTimer: (timer: ReturnType<typeof setTimeout>) => void;
  readonly loadOfflineCache: () => void;
  readonly flush: () => Promise<void>;
}

export function scheduleServerRecovery(
  retryTimer: ReturnType<typeof setTimeout> | undefined,
  callbacks: ServerRecoveryCallbacks,
): ReturnType<typeof setTimeout> {
  callbacks.setOnline(false);
  if (retryTimer) clearTimeout(retryTimer);
  const nextRetryTimer = setTimeout(() => {
    testServerAvailable(callbacks);
  }, sentry.options.retryIntervalMilliseconds);
  unrefTimer(nextRetryTimer);
  callbacks.setRetryTimer(nextRetryTimer);
  return nextRetryTimer;
}

function testServerAvailable(callbacks: ServerRecoveryCallbacks): void {
  fetch(sentry.options.dsn, { method: "HEAD" })
    .then((res) => {
      if (!res.ok) {
        scheduleServerRecovery(undefined, callbacks);
        return;
      }
      callbacks.setOnline(true);
      sentryLogger.info("Server is back available, flushing cache");
      callbacks.loadOfflineCache();
      void callbacks.flush();
    })
    .catch(() => {
      scheduleServerRecovery(undefined, callbacks);
    });
}
