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
      const nameservers = await dns.resolveNs(name);
      return { zone: name, nameservers };
    } catch {
      name = name.split(".").slice(1).join(".");
    }
  }

  return { zone: null, nameservers: [] };
}

export async function getRootRecord(zone) {
  if (!zone) {
    return null;
  }

  try {
    const ips = await dns.resolve4(zone);
    return ips[0];
  } catch {
    return null;
  }
}

export async function getIpv6(host) {
  try {
    return await dns.resolve6(host);
  } catch {
    return [];
  }
}

export async function getMailServers(zone) {
  if (!zone) {
    return [];
  }

  try {
    const records = await dns.resolveMx(zone);
    return records
      .filter((r) => r.exchange !== "" && r.exchange !== ".")
      .sort((a, b) => a.priority - b.priority)
      .map((r) => r.exchange);
  } catch {
    return [];
  }
}
