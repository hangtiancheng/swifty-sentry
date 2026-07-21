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

import type { IDeviceInfo, IOptions, ISentry } from "../types";

import { DEFAULT_OPTIONS, UNKNOWN } from "../constants";
import { BoundedSet } from "./data-structures.js";

import { UAParser } from "ua-parser-js";

declare global {
  var __sentry__: ISentry | undefined;
}

const crc32Table = /* @__PURE__ */ (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
})();

function crc32(input: string): number {
  let crc = 0xffffffff;
  for (let i = 0; i < input.length; i++) {
    crc = crc32Table[(crc ^ input.charCodeAt(i)) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function getClientFingerprint(): string {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("@swifty.js/sentry", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("@swifty.js/sentry", 4, 17);
      const b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
      const bin = atob(b64);
      return crc32(bin).toString(16);
    }
  } catch {
    return getFallbackFingerprint();
  }
  return getFallbackFingerprint();
}

function getFallbackFingerprint(): string {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getLanguage(): string {
  return "navigator" in globalThis ? globalThis.navigator.language || UNKNOWN : UNKNOWN;
}

function getScreenResolution(): string {
  if (!("screen" in globalThis)) {
    return UNKNOWN;
  }
  return `${globalThis.screen.width}x${globalThis.screen.height}`;
}

class Sentry implements ISentry {
  static #instance: Sentry;

  static get instance() {
    if (!this.#instance) {
      this.#instance = new Sentry();
      globalThis.__sentry__ = this.#instance;
    }
    return this.#instance;
  }

  codeErrors = new BoundedSet<string>(1000);

  whiteScreenTimer: ReturnType<typeof setInterval> | null = null;

  options: IOptions = DEFAULT_OPTIONS;

  deviceInfo: IDeviceInfo;

  shouldScreenRecord = false;

  constructor() {
    const res = new UAParser().getResult();
    this.deviceInfo = {
      browserName: res.browser.name ?? UNKNOWN,
      browserVersion: res.browser.version ?? UNKNOWN,
      osName: res.os.name ?? UNKNOWN,
      osVersion: res.os.version ?? UNKNOWN,
      userAgent: res.ua,
      deviceModel: res.device.model ?? UNKNOWN,
      deviceType: res.device.type ?? UNKNOWN,
      fingerprint: getClientFingerprint(),
      language: getLanguage(),
      screenResolution: getScreenResolution(),
    };
  }

  setOptions(newOptions: Partial<IOptions>) {
    Sentry.#instance.options = {
      ...this.options,
      ...newOptions,
    };
  }
}

export default Sentry.instance;
