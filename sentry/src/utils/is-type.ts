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

import type { IExtendedErrorEvent, TUnknownError } from "../types";

function isHTMLElement(node: Node): node is HTMLElement {
  return node.nodeType === Node.ELEMENT_NODE;
}

function isError(err: TUnknownError): err is Error {
  return err instanceof Error;
}

function isErrorEvent(err: TUnknownError): err is ErrorEvent {
  return err instanceof ErrorEvent;
}

function isIExtendedErrorEvent(err: TUnknownError): err is IExtendedErrorEvent {
  return (
    err instanceof ErrorEvent &&
    err.target !== null &&
    "src" in err.target &&
    typeof err.target.src === "string" &&
    "href" in err.target &&
    typeof err.target.href === "string" &&
    "localName" in err.target &&
    typeof err.target.localName === "string"
  );
}

export { isHTMLElement, isError, isErrorEvent, isIExtendedErrorEvent };
