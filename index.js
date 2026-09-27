import { gray, bold, value, reset, red } from "./src/colors.js";
import { printLogo } from "./src/programs/logo-display.js";
import { printSpinner, stopSpinner } from "./src/programs/spinner.js";
import { platforms, networks } from "./src/platforms.js";
import { getIps } from "./src/programs/dns.js";

const domain = process.argv[2];

if (!domain) {
  console.log("Usage: whodis <domain>")
  process.exit(1)
}

printLogo();
printSpinner(domain);

// ---------- 1. DNS ----------

const ips = await getIps(domain);

if (!ips) {
  stopSpinner();
  console.log("  " + red + "✗" + reset + " " + gray + "Domain not found: " + reset + bold + value + domain + reset + "\n");
  process.exit(1);
}

let extra = "";
if (ips.length > 1) {
  extra = " (+" + (ips.length - 1) + " more)";
}

// ---------- 2. Website ----------

const start = performance.now();

let response;
try {
  response = await fetch("https://" + domain, { signal: AbortSignal.timeout(5000) });
} catch {
  stopSpinner();
  console.log("  " + red + "✗" + reset + " " + gray + "Not responding: " + reset + bold + value + domain + reset + "\n");
  process.exit(1);
}

const end = performance.now();
const endRounded = Math.round(end - start);

// ---------- 3. Network ----------

let ipInfo = {};
let ipResponse;
try {
  ipResponse = await fetch("https://ipinfo.io/" + ips[0] + "/json");
  ipInfo = await ipResponse.json();
} catch { }

// ---------- 4. Platform ----------

const orgName = (ipInfo.org ?? "").split(" ").slice(1).join(" ");

const headerMatch = platforms.find((p) => response.headers.get(p.header));
const networkMatch = networks.find((n) => orgName.toLowerCase().includes(n.org));

let platform;
if (headerMatch) {
  platform = headerMatch.name;
} else if (networkMatch) {
  platform = networkMatch.name;
} else {
  platform = "unknown";
}

// ---------- Output ----------

stopSpinner();

console.log("  " + gray + "Domain:" + reset + "   " + bold + value + domain + reset + "\n");
console.log("  " + gray + "IP" + reset + "        " + bold + value + ips[0] + reset + gray + extra + reset + "\n");
console.log("  " + gray + "Response" + reset + "  " + bold + value + endRounded + "ms" + reset + "\n");
console.log("  " + gray + "Platform" + reset + "  " + bold + value + platform + reset + "\n");

if (ipInfo.org) {
  console.log("  " + gray + "Network" + reset + "   " + bold + value + orgName + " · " + ipInfo.city + ", " + ipInfo.country + reset + "\n");
} else {
  console.log("  " + gray + "Network" + reset + "   " + bold + value + "unavailable" + reset + "\n");
}

process.exit(0);
