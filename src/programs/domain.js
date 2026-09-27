export function normalizeDomain(input) {
  let url = input;

  if (!url.includes("://")) {
    url = "https://" + url;
  }

  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return input;
  }

  if (hostname.endsWith(".")) {
    hostname = hostname.slice(0, -1);
  }

  return hostname;
}

export function wwwVariant(domain) {
  return domain.startsWith("www.") ? domain.slice(4) : "www." + domain;
}
