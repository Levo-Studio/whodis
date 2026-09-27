import { printLogo } from "./src/programs/logo-display.js";
import { printSpinner, stopSpinner } from "./src/programs/spinner.js";
import { detectPlatform } from "./src/programs/platform.js";
import { getIps } from "./src/programs/dns.js";
import { checkWebsite } from "./src/programs/website.js";
import { getNetworkInfo } from "./src/programs/network.js";
import { printError, printResult, printUsage } from "./src/programs/output.js";

const domain = process.argv[2];

if (!domain) {
  printLogo();
  printUsage();
  process.exit(1)
}

printLogo();
printSpinner(domain);

const ips = await getIps(domain);

if (!ips) {
  stopSpinner();
  printError("Domain not found", domain);
  process.exit(1);
}

const website = await checkWebsite(domain);

if (!website) {
  stopSpinner();
  printError("Not responding", domain);
  process.exit(1);
}

const { response, time } = website;

const ipInfo = await getNetworkInfo(ips[0]);
const orgName = (ipInfo.org ?? "").split(" ").slice(1).join(" ");
const platform = detectPlatform(response, orgName);

stopSpinner();

printResult(domain, ips, time, platform, ipInfo, orgName);

process.exit(0);
