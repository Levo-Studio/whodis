import { dnsProviders } from "../dns-providers.js";

export function detectDnsProvider(nameservers) {
  const names = new Set();

  for (const nameserver of [...nameservers].sort()) {
    const host = nameserver.toLowerCase();
    const match = dnsProviders.find((p) => host.includes(p.ns));

    if (match) {
      names.add(match.name);
    } else {
      names.add(host.split(".").slice(-2).join("."));
    }
  }

  return [...names].join(", ");
}
