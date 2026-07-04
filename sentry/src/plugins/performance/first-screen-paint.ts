import { isHTMLElement } from "../../utils";

type Callback = (value: number) => void;

interface RenderEntry {
  readonly startTime: number;
  readonly children: readonly HTMLElement[];
}

let entries: RenderEntry[] = [];
let observer: MutationObserver | null = null;
let requestId = 0;

function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.right > 0 &&
    rect.bottom > 0 &&
    rect.left < globalThis.innerWidth &&
    rect.top < globalThis.innerHeight
  );
}

function getRenderTime(): number {
  if (entries.length === 0) {
    return 0;
  }
  return Math.max(...entries.map((entry) => entry.startTime));
}

function checkDomChange(callback: Callback): void {
  cancelAnimationFrame(requestId);
  requestId = requestAnimationFrame(() => {
    if (document.readyState === "complete") {
      observer?.disconnect();
      const firstScreenPaint = getRenderTime();
      entries = [];
      callback(firstScreenPaint);
      return;
    }
    checkDomChange(callback);
  });
}

function observeFirstScreenPaint(callback: Callback): void {
  if (!("MutationObserver" in globalThis) || typeof globalThis.MutationObserver !== "function") {
    callback(0);
    return;
  }
  const excludedElementNames = new Set(["link", "script", "style"]);
  observer = new globalThis.MutationObserver((mutationList) => {
    checkDomChange(callback);
    const children: HTMLElement[] = [];
    for (const mutation of mutationList) {
      if (!isHTMLElement(mutation.target)) {
        continue;
      }
      if (!mutation.addedNodes.length || !isInViewport(mutation.target)) {
        continue;
      }
      for (const node of Array.from(mutation.addedNodes)) {
        if (
          isHTMLElement(node) &&
          !excludedElementNames.has(node.tagName.toLowerCase()) &&
          isInViewport(node)
        ) {
          children.push(node);
        }
      }
    }
    if (children.length) {
      entries.push({
        children,
        startTime: globalThis.performance.now(),
      });
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
  });
}

export function getFirstScreenPaint(callback: Callback): void {
  if ("requestIdleCallback" in globalThis) {
    requestIdleCallback((deadline) => {
      if (deadline.timeRemaining() > 0) {
        observeFirstScreenPaint(callback);
      }
    });
    return;
  }
  observeFirstScreenPaint(callback);
}
