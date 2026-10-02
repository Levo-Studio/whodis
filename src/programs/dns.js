import dns from "node:dns/promises";
import { wwwVariant } from "./domain.js";

export async function getIps(domain) {
  for (const host of [domain, wwwVariant(domain)]) {
    try {
      const ips = await dns.resolve4(host);
      return { ips, host };
    } catch {
    }
  }

  return null;
}

export async function getNameservers(domain) {
  let name = domain;

  while (name.includes(".")) {
    try {
      return await dns.resolveNs(name);
    } catch {
      name = name.split(".").slice(1).join(".");
    }
  }

  return [];
}
