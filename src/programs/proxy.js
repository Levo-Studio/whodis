import { platforms, networks } from "../platforms.js";
import { cloudflareRanges } from "../cloudflare-ranges.js";

export function isProxied(response, orgName, ip) {
  const cloudflareIp = cloudflareRanges.some((range) => inRange(ip, range));
  const networkMatch = networks.find((n) => orgName.toLowerCase().includes(n.org));
  const headerMatch = platforms.find((p) => p.cdn && response.headers.get(p.header));

  return Boolean(cloudflareIp || networkMatch?.cdn || headerMatch);
}

function inRange(ip, range) {
  const [base, bits] = range.split("/");
  const start = toNumber(base);
  const size = 2 ** (32 - Number(bits));

  return toNumber(ip) >= start && toNumber(ip) < start + size;
}

function toNumber(ip) {
  return ip.split(".").reduce((number, part) => number * 256 + Number(part), 0);
}
