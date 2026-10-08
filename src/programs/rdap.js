import { rdapServers } from "../rdap-servers.js";

export async function getRegistration(zone) {
  if (!zone) {
    return null;
  }

  const tld = zone.split(".").pop().toLowerCase();
  const server = rdapServers.find((s) => s.tlds.includes(tld));

  if (!server) {
    return null;
  }

  try {
    const response = await fetch(server.url + "domain/" + zone, {
      headers: { accept: "application/rdap+json" },
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const registrar = findRegistrar(data.entities ?? []);
    const since = (data.events ?? []).find((e) => e.eventAction === "registration")?.eventDate ?? null;

    if (!registrar && !since) {
      return null;
    }

    return { registrar, since };
  } catch {
    return null;
  }
}

function findRegistrar(entities) {
  const entity = entities.find((e) => e.roles?.includes("registrar"));
  const fn = entity?.vcardArray?.[1]?.find((field) => field[0] === "fn");

  return fn?.[3] || null;
}

export function yearsSince(date) {
  const start = new Date(date);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();

  if (now.getMonth() < start.getMonth() || (now.getMonth() === start.getMonth() && now.getDate() < start.getDate())) {
    years--;
  }

  return years;
}
