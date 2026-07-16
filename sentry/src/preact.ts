import { Component, type ComponentChildren, type ErrorInfo } from "preact";
import { EventType } from "./types/index.js";
import { reportFrameworkError } from "./core/framework-error.js";

/**
 * Props for the {@link PreactErrorBoundary} component.
 *
 * The boundary renders `children` normally. When a descendant throws during
 * rendering, it switches to rendering {@link fallback} and reports the error
 * to the Sentry SDK.
 */
export interface PreactErrorBoundaryProps {
  /**
   * The subtree to render when no error has occurred. When an error is
   * caught, this is replaced by {@link fallback}.
   */
  readonly children?: ComponentChildren;

  /**
   * The UI to display when a descendant throws.
   *
   * Can be a static `ComponentChildren` (no access to the error) or a render
   * function that receives the caught error and Preact's component-stack info.
   *
   * @param error - The Error thrown by the descendant component.
   * @param errorInfo - Preact's {@link ErrorInfo}, containing `componentStack`.
   *   `undefined` on the first render after the error is caught.
   * @returns The fallback Preact subtree to render.
   */
  readonly fallback?:
    | ComponentChildren
    | ((error: Error, errorInfo?: ErrorInfo) => ComponentChildren);
}

/** Internal state tracking the caught error and component-stack info. */
interface PreactErrorBoundaryState {
  readonly error?: Error;
  readonly errorInfo?: ErrorInfo;
}

/**
 * A Preact Error Boundary that reports caught errors to the Sentry SDK.
 *
 * @example
 * ```tsx
 * <PreactErrorBoundary fallback={<div>Something went wrong</div>}>
 *   <Page />
 * </PreactErrorBoundary>
 * ```
 */
export class PreactErrorBoundary extends Component<
  PreactErrorBoundaryProps,
  PreactErrorBoundaryState
> {
  override state: PreactErrorBoundaryState = {};

  static getDerivedStateFromError(error: Error): PreactErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo });
    reportFrameworkError({
      type: EventType.React,
      error,
      context: errorInfo,
    });
  }

  override render(): ComponentChildren {
    const { error, errorInfo } = this.state;
    if (error) {
      const { fallback } = this.props;
      if (typeof fallback === "function") {
        return fallback(error, errorInfo);
      }
      return fallback ?? null;
    }
    return this.props.children ?? null;
  }
}
