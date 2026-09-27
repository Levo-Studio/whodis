import { platforms, networks } from "../platforms.js";

export function detectPlatform(response, orgName) {
  const headerMatch = platforms.find((p) => response.headers.get(p.header));
  const networkMatch = networks.find((n) => orgName.toLowerCase().includes(n.org));

  if (headerMatch) {
    return headerMatch.name;
  } else if (networkMatch) {
    return networkMatch.name;
  } else {
    return "unknown";
  }
}
