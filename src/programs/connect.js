import { wwwVariant } from "./domain.js";
import { certificateErrors } from "../certificate-errors.js";

export async function connect(domain) {
  const alternative = wwwVariant(domain);

  const attempts = [
    "https://" + domain,
    "https://" + alternative,
    "http://" + domain,
    "http://" + alternative,
  ];

  let certificateError = null;

  for (const url of attempts) {
    const start = performance.now();
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
      const responseTime = Math.round(performance.now() - start);
      const usedHttps = response.url.startsWith("https://");
      return { response, url: response.url, responseTime, certificateError: usedHttps ? null : certificateError };
    } catch (error) {
      const match = certificateErrors.find((c) => c.code === error.cause?.code);
      if (match && !certificateError) {
        certificateError = match.message;
      }
    }
  }

  return { response: null, certificateError };
}
