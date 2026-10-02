import { dnsProviders } from "../dns-providers.js";

export function detectDnsProvider(nameservers) {
  const names = new Set();

  for (const nameserver of [...nameservers].sort()) {
    const host = nameserver.toLowerCase();
    const match = dnsProviders.find((p) => host.includes(p.ns));

    if (match) {
      names.add(match.name);
    } else {
      names.add(baseDomain(host));
    }
  }

  return [...names].join(", ");
}

const secondLevels = ["co", "com", "net", "org", "gov", "edu", "ac", "ne", "or"];

function baseDomain(host) {
  const parts = host.split(".");
  const tld = parts[parts.length - 1];
  const second = parts[parts.length - 2];
  const count = parts.length > 2 && tld.length === 2 && secondLevels.includes(second) ? 3 : 2;

  return parts.slice(-count).join(".");
}
