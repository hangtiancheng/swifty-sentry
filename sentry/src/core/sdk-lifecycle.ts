import { DEFAULT_OPTIONS } from "../constants/index.js";
import type { SentryPlugin } from "../types/index.js";
import { sentry, sentryLogger } from "../utils/index.js";
import type { Cleanup } from "../utils/decorate-prop.js";
import { initIdentity } from "./identity.js";
import { optionsSchema, type InitOptions } from "./options-schema.js";
import { destroyPlugins, registerPlugin } from "./plugin-registry.js";
import setup from "./setup.js";
import { destroyBatchErrorManager } from "./handle-code-error.js";
import { resetReporter } from "../reporter/index.js";

let cleanupSetup: Cleanup | null = null;

export function isInitialized(): boolean {
  return cleanupSetup !== null;
}

export function destroy(): void {
  destroyPlugins();
  cleanupSetup?.();
  cleanupSetup = null;
  destroyBatchErrorManager();
  resetReporter();
}

export function init(options: InitOptions): void {
  const parsedOptions = optionsSchema.parse({ ...DEFAULT_OPTIONS, ...options });
  sentry.setOptions(parsedOptions);
  const { dsn } = sentry.options;
  if (sentry.options.disabled) {
    sentryLogger.info("SDK disabled by options");
    return;
  }
  if (dsn === "") {
    sentryLogger.error("Initialization failed: DSN is empty");
    return;
  }
  if (isInitialized()) {
    sentryLogger.info("SDK already initialized");
    return;
  }
  sentryLogger.info("SDK initialized", {
    options: sentry.options,
  });
  cleanupSetup = setup();
  void initIdentity();
}

export function enablePlugin(plugin: SentryPlugin): SentryPlugin {
  plugin.init();
  registerPlugin(plugin);
  return plugin;
}
