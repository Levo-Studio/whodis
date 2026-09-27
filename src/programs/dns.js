import dns from "node:dns/promises";

export async function getIps(domain) {
  const alternative = domain.startsWith("www.") ? domain.slice(4) : "www." + domain;

  for (const host of [domain, alternative]) {
    try {
      const ips = await dns.resolve4(host);
      return { ips, host };
    } catch {
      // not found, try the next variant
    }
  }

  return null;
}
