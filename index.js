import dns from "node:dns/promises";

const domain = process.argv[2];
console.log("Checking " + domain);

const ips = await dns.resolve4(domain);
console.log("IP: " + ips[0]);

const start = performance.now();

const response = await fetch("https://" + domain);

const end = performance.now();
const endRounded = Math.round(end - start)

console.log("Response: " + endRounded + "ms")
