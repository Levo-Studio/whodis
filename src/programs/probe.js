export async function probeIp(ip) {
  try {
    const response = await fetch("http://" + ip, { redirect: "manual", signal: AbortSignal.timeout(2000) });
    return { status: response.status, headers: response.headers };
  } catch {
    return null;
  }
}
