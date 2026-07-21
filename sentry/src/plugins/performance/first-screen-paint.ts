/**
 * Copyright (c) 2026 hangtiancheng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
