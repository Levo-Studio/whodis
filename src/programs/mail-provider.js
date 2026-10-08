import { mailProviders } from "../mail-providers.js";
import { baseDomain } from "./dns-provider.js";

export function detectMailProvider(mailServers) {
  const names = new Set();

  for (const server of mailServers) {
    const host = server.toLowerCase();
    const match = mailProviders.find((p) => host.includes(p.mx));

    if (match) {
      names.add(match.name);
    } else {
      names.add(baseDomain(host));
    }
  }

  return [...names].join(", ");
}
