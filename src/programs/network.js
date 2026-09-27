export async function getNetworkInfo(ip) {
  try {
    const response = await fetch("https://ipinfo.io/" + ip + "/json", { signal: AbortSignal.timeout(3000) });
    return await response.json();
  } catch {
    return {};
  }
}
