export async function checkWebsite(domain) {
  const start = performance.now();

  try {
    const response = await fetch("https://" + domain, { signal: AbortSignal.timeout(5000) });
    const time = Math.round(performance.now() - start);
    return { response, time };
  } catch {
    return null;
  }
}
