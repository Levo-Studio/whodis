import { gray, bold, value, reset, red, green, yellow } from "../colors.js";

export function printHelp() {
  console.log("  " + gray + "Usage" + reset + "     " + bold + value + "whodis <domain> [options]" + reset + "\n");
  console.log("  " + gray + "Options" + reset + "   " + bold + value + "--help, -h" + reset + "       " + gray + "show this help" + reset);
  console.log("            " + bold + value + "--version, -v" + reset + "    " + gray + "show the version" + reset + "\n");
  console.log("  " + gray + "Example" + reset + "   " + bold + value + "whodis google.com" + reset + "\n");
}

export function printVersion(version) {
  console.log("  " + gray + "Version" + reset + "   " + bold + value + version + reset + "\n");
}

export function printError(message, domain, hint = "") {
  console.log("  " + red + "✗" + reset + " " + gray + message + ": " + reset + bold + value + domain + reset + gray + hint + reset + "\n");
}

export function printResult({ domain, redirect, insecure, ips, responseTime, platform, ipInfo, orgName, certificateError, certificate, nameServer }) {
  let extra = "";
  if (ips.length > 1) {
    extra = " (+" + (ips.length - 1) + " more)";
  }

  console.log("  " + gray + "Domain" + reset + "    " + bold + value + domain + reset + "\n");

  if (redirect) {
    console.log("  " + gray + "Redirect" + reset + "  " + bold + value + "→ " + redirect + reset + "\n");
  }

  console.log("  " + gray + "IP" + reset + "        " + bold + value + ips[0] + reset + gray + extra + reset + "\n");
  console.log("  " + gray + "Response" + reset + "  " + bold + value + responseTime + "ms" + reset + "\n");

  if (insecure) {
    console.log("  " + gray + "Protocol" + reset + "  " + bold + red + "HTTP (no SSL)" + reset + "\n");
  }

  if (certificate) {
    console.log("  " + gray + "SSL" + reset + "       " + bold + value + certificate.issuer + " · " + urgencyColor(certificate.daysLeft) + certificate.daysLeft + " days left" + reset + "\n");
  }

  if (certificateError) {
    console.log("  " + gray + "SSL" + reset + "       " + bold + red + certificateError + reset + "\n");
  }

  if (nameServer.length > 0) {
    console.log("  " + gray + "DNS" + reset + "       " + bold + value + nameServer.join(", ") + reset + "\n");
  }

  console.log("  " + gray + "Platform" + reset + "  " + bold + value + platform + reset + "\n");

  if (ipInfo.org) {
    console.log("  " + gray + "Network" + reset + "   " + bold + value + orgName + " · " + ipInfo.city + ", " + ipInfo.country + reset + "\n");
  } else {
    console.log("  " + gray + "Network" + reset + "   " + bold + value + "unavailable" + reset + "\n");
  }
}

export function urgencyColor(days) {
  if (days <= 7) {
      return red;
  } else if (days > 30) {
      return green;
  } else {
      return yellow;
  }
}
