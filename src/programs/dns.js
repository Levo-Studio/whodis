import dns from "node:dns/promises";
import { wwwVariant } from "./domain.js";

export async function getIps(domain) {
  for (const host of [domain, wwwVariant(domain)]) {
    try {
      const ips = await dns.resolve4(host);
      return { ips, host };
    } catch {
      // not found, try the next variant
    }
  }

  return null;
}
