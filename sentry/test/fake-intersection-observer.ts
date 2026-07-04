import { vi } from "vitest";

function normalizeThresholds(threshold: number | readonly number[] | undefined): readonly number[] {
  if (typeof threshold === "number") {
    return [threshold];
  }
  if (!threshold) {
    return [0];
  }
  return [...threshold];
}

export class FakeIntersectionObserver implements IntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly scrollMargin: string = "";
  readonly thresholds: readonly number[] = [];
  readonly observe = vi.fn();
  readonly unobserve = vi.fn();
  readonly disconnect = vi.fn();

  constructor(
    private readonly callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.thresholds = normalizeThresholds(options?.threshold);
    FakeIntersectionObserver.instances.push(this);
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  emit(target: Element, isIntersecting: boolean): void {
    const entry: IntersectionObserverEntry = {
      boundingClientRect: new DOMRectReadOnly(),
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: new DOMRectReadOnly(),
      isIntersecting,
      rootBounds: null,
      target,
      time: performance.now(),
    };
    this.callback([entry], this);
  }
}
