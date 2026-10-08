export function inRange(ip, cidr) {
  const [network, bits] = cidr.split("/");
  const mask = Number(bits) === 0 ? 0 : (~0 << (32 - Number(bits))) >>> 0;

  return ((toNumber(ip) & mask) >>> 0) === ((toNumber(network) & mask) >>> 0);
}

function toNumber(ip) {
  return ip.split(".").reduce((number, part) => ((number << 8) | Number(part)) >>> 0, 0);
}
