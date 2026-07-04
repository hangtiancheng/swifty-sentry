import { sentryLogger } from "../utils";

interface NetworkListenerCallbacks {
  readonly setOnline: (online: boolean) => void;
  readonly loadOfflineCache: () => void;
  readonly flush: () => Promise<void>;
}

export function initNetworkListener(callbacks: NetworkListenerCallbacks): void {
  callbacks.setOnline(navigator.onLine !== false);
  globalThis.addEventListener("online", () => {
    callbacks.setOnline(true);
    sentryLogger.info("Network is back online, flushing cache");
    callbacks.loadOfflineCache();
    void callbacks.flush();
  });
  globalThis.addEventListener("offline", () => {
    callbacks.setOnline(false);
    sentryLogger.info("Network is offline, caching events");
  });
}
