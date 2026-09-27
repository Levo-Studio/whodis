import { printLogo } from "./src/programs/logo-display.js";
import { printSpinner, stopSpinner } from "./src/programs/spinner.js";
import { detectPlatform } from "./src/programs/platform.js";
import { getIps } from "./src/programs/dns.js";
import { connect } from "./src/programs/connect.js";
import { getNetworkInfo } from "./src/programs/network.js";
import { printError, printResult, printUsage } from "./src/programs/output.js";
import { normalizeDomain } from "./src/programs/domain.js";

const input = process.argv[2];

if (!input) {
  printLogo();
  printUsage();
  process.exit(1);
}

const domain = normalizeDomain(input);

printLogo();
printSpinner(domain);

const dnsResult = await getIps(domain);

if (!dnsResult) {
  stopSpinner();
  printError("Domain not found", domain);
  process.exit(1);
}

const { ips } = dnsResult;

const connection = await connect(domain);

if (!connection.response) {
  stopSpinner();
  if (connection.certificateError) {
    printError("SSL " + connection.certificateError, domain);
  } else {
    printError("Not responding", domain);
  }
  process.exit(1);
}

const { response, url, responseTime, certificateError } = connection;

const landedHost = new URL(url).hostname;
const redirect = landedHost !== domain ? landedHost : null;

const ipInfo = await getNetworkInfo(ips[0]);
const orgName = (ipInfo.org ?? "").split(" ").slice(1).join(" ");
const platform = detectPlatform(response, orgName);

stopSpinner();

printResult({ domain, redirect, ips, responseTime, platform, ipInfo, orgName, certificateError });

process.exit(0);
