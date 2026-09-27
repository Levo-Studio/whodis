import { gray, bold, value, reset, red } from "./src/colors.js";
import { printLogo } from "./src/programs/logo-display.js";
import { printSpinner, stopSpinner } from "./src/programs/spinner.js";
import { detectPlatform } from "./src/programs/platform.js";
import { getIps } from "./src/programs/dns.js";
import { checkWebsite } from "./src/programs/website.js";
import { getNetworkInfo } from "./src/programs/network.js";

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

const website = await checkWebsite(domain);

if (!website) {
  stopSpinner();
  console.log("  " + red + "✗" + reset + " " + gray + "Not responding: " + reset + bold + value + domain + reset + "\n");
  process.exit(1);
}

const { response, time } = website;

// ---------- 3. Network ----------

const ipInfo = await getNetworkInfo(ips[0]);

// ---------- 4. Platform ----------

const orgName = (ipInfo.org ?? "").split(" ").slice(1).join(" ");

const platform = detectPlatform(response, orgName);

// ---------- Output ----------

stopSpinner();

console.log("  " + gray + "Domain:" + reset + "   " + bold + value + domain + reset + "\n");
console.log("  " + gray + "IP" + reset + "        " + bold + value + ips[0] + reset + gray + extra + reset + "\n");
console.log("  " + gray + "Response" + reset + "  " + bold + value + time + "ms" + reset + "\n");
console.log("  " + gray + "Platform" + reset + "  " + bold + value + platform + reset + "\n");

if (ipInfo.org) {
  console.log("  " + gray + "Network" + reset + "   " + bold + value + orgName + " · " + ipInfo.city + ", " + ipInfo.country + reset + "\n");
} else {
  console.log("  " + gray + "Network" + reset + "   " + bold + value + "unavailable" + reset + "\n");
}

process.exit(0);
