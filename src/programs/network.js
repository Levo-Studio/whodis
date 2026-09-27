export async function getNetworkInfo(ip) {
  try {
    const response = await fetch("https://ipinfo.io/" + ip + "/json");
    return await response.json();
  } catch {
    return {};
  }
}
