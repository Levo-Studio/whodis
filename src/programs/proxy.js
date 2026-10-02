import { cdns } from "../cdns.js";
import { cdnRanges } from "../cdn-ranges.js";
import { inRange } from "./ip-range.js";

export function detectProxy({ ip, orgName, response, probe }) {
  const ipHit = checkIp(ip, orgName);
  const headerHit = checkHeaders(response.headers);
  const probeHit = probe ? checkProbe(probe.headers) : null;

  const hits = [ipHit, headerHit, probeHit].filter(Boolean);
  const score = hits.reduce((sum, hit) => sum + hit.points, 0);

  return {
    score,
    cdn: ipHit?.cdn ?? headerHit?.cdn ?? null,
    proxied: score >= 5,
    likely: score >= 3 && score < 5,
    reasons: hits.map((hit) => hit.reason),
  };
}

function checkIp(ip, orgName) {
  const range = cdnRanges.find((c) => c.ranges.some((r) => inRange(ip, r)));
  const org = orgName.toLowerCase();
  const network = cdns.find((c) => c.orgs.some((o) => org.includes(o)));

  if (range) {
    return { points: 5, cdn: range.name, reason: "IP in " + range.name + " range" };
  } else if (network) {
    return { points: 3, cdn: network.name, reason: "IP belongs to " + network.name };
  } else {
    return null;
  }
}

function checkHeaders(headers) {
  const header = findByHeader(headers);
  const server = findByServer(headers);

  if (header) {
    return { points: 3, cdn: header.cdn.name, reason: header.name + " header" };
  } else if (server) {
    return { points: 1, cdn: server.name, reason: "server header says " + server.name };
  } else {
    return null;
  }
}

function checkProbe(headers) {
  const match = findByHeader(headers)?.cdn ?? findByServer(headers);

  if (match) {
    return { points: 2, cdn: match.name, reason: "direct IP answers as " + match.name };
  } else {
    return null;
  }
}

function findByHeader(headers) {
  for (const cdn of cdns) {
    const name = cdn.headers.find((h) => headers.get(h));
    if (name) {
      return { cdn, name };
    }
  }

  return null;
}

function findByServer(headers) {
  const server = (headers.get("server") ?? "").toLowerCase();
  return cdns.find((c) => c.server && server.includes(c.server));
}
