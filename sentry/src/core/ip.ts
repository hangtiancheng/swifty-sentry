const ipPattern =
  /([0-9]{1,3}(?:\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){2,7})/gi;

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
