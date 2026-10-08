import { gray, bold, value, reset, red, green, yellow } from "../colors.js";
import { yearsSince } from "./rdap.js";

const indent = "    ";
const labelWidth = 12;
const gap = indent + " ".repeat(labelWidth);

export function printHelp() {
  console.log("  " + gray + "Usage" + reset + "     " + bold + value + "whodis <domain> [options]" + reset + "\n");
  console.log("  " + gray + "Options" + reset + "   " + bold + value + "--help, -h" + reset + "       " + gray + "show this help" + reset);
  console.log("            " + bold + value + "--version, -v" + reset + "    " + gray + "show the version" + reset);
  console.log("            " + bold + value + "--detailed, -d" + reset + "   " + gray + "show everything, grouped by section" + reset + "\n");
  console.log("  " + gray + "Example" + reset + "   " + bold + value + "whodis google.com" + reset + "\n");
}

export function printVersion(version) {
  console.log("  " + gray + "Version" + reset + "   " + bold + value + version + reset + "\n");
}

export function printError(message, domain, hint = "") {
  console.log("  " + red + "✗" + reset + " " + gray + message + ": " + reset + bold + value + domain + reset + gray + hint + reset + "\n");
}

export function printResult({ domain, redirect, insecure, ips, responseTime, platform, ipInfo, orgName, certificateError, certificate, dnsProvider, proxy, rootRecord, rootOrigin }) {
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

  if (dnsProvider) {
    console.log("  " + gray + "DNS" + reset + "       " + bold + value + dnsProvider + reset + "\n");
  }

  const { name: platformName, hint } = platformLabel(platform, proxy, false);

  console.log("  " + gray + "Platform" + reset + "  " + bold + value + platformName + reset + gray + hint + reset + "\n");

  if (ipInfo.org) {
    console.log("  " + gray + "Network" + reset + "   " + bold + value + orgName + " · " + ipInfo.city + ", " + ipInfo.country + reset + "\n");
  } else {
    console.log("  " + gray + "Network" + reset + "   " + bold + value + "unavailable" + reset + "\n");
  }

  let rootHint = "";
  if (rootOrigin) {
    rootHint = " (not proxied, likely origin)";
  }

  console.log("  " + gray + "A record" + reset + "  " + bold + value + (rootRecord ?? "none") + reset + yellow + rootHint + reset + "\n");
}

function platformLabel(platform, proxy, detailed) {
  const hosted = platform !== "unknown" && platform !== proxy.cdn;

  if ((proxy.proxied || proxy.likely) && hosted) {
    return { name: platform, hint: " (via " + proxy.cdn + ")" };
  } else if (proxy.proxied && detailed && proxy.cdn === "Cloudflare") {
    return { name: proxy.cdn, hint: " (proxied or hosted)" };
  } else if (proxy.proxied) {
    return { name: proxy.cdn, hint: " (proxied)" };
  } else if (proxy.likely) {
    return { name: proxy.cdn, hint: " (likely proxied)" };
  } else {
    return { name: platform, hint: "" };
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

export function printDetailed({ domain, redirect, insecure, ips, ipv6, responseTime, server, platform, ipInfo, orgName, certificateError, certificate, dnsProvider, mailProvider, registration, proxy, rootRecord, rootOrigin }) {
  console.log("  " + bold + value + domain + reset + "\n");

  printSection("HOSTING");
  printAddresses("IPv4", ips, 3);
  if (ipv6.length > 0) {
    printAddresses("IPv6", ipv6, 2);
  }
  printLine("Location", ipInfo.city ? ipInfo.city + ", " + ipInfo.country : "unavailable");

  const { name: platformName, hint } = platformLabel(platform, proxy, true);
  const reasons = proxy.proxied || proxy.likely ? proxy.reasons.map((reason) => green + "✓ " + reset + gray + reason) : [];
  printLine("Platform", platformName, gray + hint, reasons);

  if (ipInfo.org) {
    printLine("Network", orgName + " · " + ipInfo.org.split(" ")[0]);
  } else {
    printLine("Network", "unavailable");
  }

  if (rootOrigin) {
    printLine("Origin", rootRecord, yellow + " (root domain not proxied)");
  }

  printSection("WEBSITE");
  if (redirect) {
    printLine("Redirect", "→ " + redirect);
  }
  if (insecure) {
    printLine("Protocol", red + "HTTP (no SSL)");
  } else {
    printLine("Protocol", "HTTPS");
  }
  printLine("Response", responseTime + "ms" + (server ? " · " + server : ""));
  if (certificate) {
    printLine("SSL", certificate.issuer + " · " + urgencyColor(certificate.daysLeft) + certificate.daysLeft + " days left");
  }
  if (certificateError) {
    printLine("SSL", red + certificateError);
  }

  printSection("DNS & MAIL");
  printLine("DNS", dnsProvider || "unavailable");
  printLine("Mail", mailProvider || "none");

  if (registration) {
    printSection("DOMAIN");
    if (registration.registrar) {
      printLine("Registrar", registration.registrar);
    }
    if (registration.since) {
      printLine("Since", registration.since.slice(0, 4) + " (" + age(yearsSince(registration.since)) + ")");
    }
  }
}

function printSection(title) {
  console.log("  " + bold + gray + title + reset + " " + gray + "─".repeat(48 - title.length) + reset + "\n");
}

function printLine(label, text, extra = "", below = []) {
  console.log(indent + gray + label.padEnd(labelWidth) + reset + bold + value + text + reset + extra + reset);
  for (const line of below) {
    console.log(gap + line + reset);
  }
  console.log("");
}

function printAddresses(label, addresses, perRow) {
  const width = Math.max(...addresses.map((a) => a.length)) + 4;
  const rows = [];

  for (let i = 0; i < addresses.length; i += perRow) {
    rows.push(value + addresses.slice(i, i + perRow).map((a) => a.padEnd(width)).join("").trimEnd());
  }

  printLine(label, addresses.length + (addresses.length === 1 ? " address" : " addresses"), "", rows);
}

function age(years) {
  if (years < 1) {
    return "less than a year";
  } else if (years === 1) {
    return "1 year";
  } else {
    return years + " years";
  }
}
