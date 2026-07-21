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

const ipPattern = /([0-9]{1,3}(?:\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){2,7})/gi;

function collectIps(candidate: string, ips: Set<string>): void {
  const matches = candidate.match(ipPattern) ?? [];
  matches.forEach((ip) => {
    ips.add(ip);
  });
}

export function getIPs(timeout = 500): Promise<readonly string[]> {
  return new Promise((resolve) => {
    if (typeof globalThis.RTCPeerConnection !== "function") {
      resolve([]);
      return;
    }
    const ips = new Set<string>();
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    const finish = (): void => {
      peer.onicecandidate = null;
      peer.close();
      resolve([...ips]);
    };
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        collectIps(event.candidate.candidate, ips);
      }
    };
    peer.createDataChannel("@swifty.js/sentry-IP-probe");
    void peer
      .createOffer()
      .then((offer) => peer.setLocalDescription(offer))
      .catch(finish);
    setTimeout(finish, Math.max(timeout, 100));
  });
}
