import { wwwVariant } from "./domain.js";

export async function connect(domain) {
  const alternative = wwwVariant(domain);

  const attempts = [
    "https://" + domain,
    "https://" + alternative,
    "http://" + domain,
    "http://" + alternative,
  ];

  for (const url of attempts) {
    const start = performance.now();
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
      const responseTime = Math.round(performance.now() - start);
      return { response, url: response.url, responseTime };
    } catch {
    }
  }

  return null;
}
