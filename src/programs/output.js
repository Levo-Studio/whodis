import { gray, bold, value, reset, red } from "../colors.js";

export function printUsage() {
  console.log("  " + gray + "Usage" + reset + "     " + bold + value + "whodis <domain>" + reset + "\n");
  console.log("  " + gray + "Example" + reset + "   " + bold + value + "whodis google.com" + reset + "\n");
}

export function printError(message, domain) {
  console.log("  " + red + "✗" + reset + " " + gray + message + ": " + reset + bold + value + domain + reset + "\n");
}

export function printResult({ domain, ips, responseTime, platform, ipInfo, orgName, certificateError }) {
  let extra = "";
  if (ips.length > 1) {
    extra = " (+" + (ips.length - 1) + " more)";
  }

  console.log("  " + gray + "Domain" + reset + "    " + bold + value + domain + reset + "\n");
  console.log("  " + gray + "IP" + reset + "        " + bold + value + ips[0] + reset + gray + extra + reset + "\n");
  console.log("  " + gray + "Response" + reset + "  " + bold + value + responseTime + "ms" + reset + "\n");

  if (certificateError) {
    console.log("  " + gray + "SSL" + reset + "       " + bold + red + certificateError + reset + "\n");
  }

  console.log("  " + gray + "Platform" + reset + "  " + bold + value + platform + reset + "\n");

  if (ipInfo.org) {
    console.log("  " + gray + "Network" + reset + "   " + bold + value + orgName + " · " + ipInfo.city + ", " + ipInfo.country + reset + "\n");
  } else {
    console.log("  " + gray + "Network" + reset + "   " + bold + value + "unavailable" + reset + "\n");
  }
}
