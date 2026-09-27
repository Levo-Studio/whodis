import dns from "node:dns/promises";

export async function getIps(domain) {
  try {
    return await dns.resolve4(domain);
  } catch {
    return null;
  }
}
