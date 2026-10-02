import { platforms, networks } from "../platforms.js";

export function isProxied(response, orgName) {
  const networkMatch = networks.find((n) => orgName.toLowerCase().includes(n.org));
  const headerMatch = platforms.find((p) => p.cdn && response.headers.get(p.header));

  return Boolean(networkMatch?.cdn || headerMatch);
}
