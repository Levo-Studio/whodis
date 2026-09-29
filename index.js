#!/usr/bin/env node

import { printLogo } from "./src/programs/logo-display.js";
import { printSpinner, stopSpinner } from "./src/programs/spinner.js";
import { detectPlatform } from "./src/programs/platform.js";
import { getIps, getNameservers } from "./src/programs/dns.js";
import { connect } from "./src/programs/connect.js";
import { getNetworkInfo } from "./src/programs/network.js";
import { printError, printResult, printHelp, printVersion } from "./src/programs/output.js";
import { normalizeDomain } from "./src/programs/domain.js";
import { parseArgs } from "./src/programs/args.js";
import { getVersion } from "./src/programs/version.js";
import { getCertificate } from "./src/programs/ssl.js";
import { detectDnsProvider } from "./src/programs/dns-provider.js";

const args = parseArgs(process.argv.slice(2));

if (args.version) {
  printLogo();
  printVersion(getVersion());
  process.exit(0);
}

if (args.help) {
  printLogo();
  printHelp();
  process.exit(0);
}

if (args.unknown.length > 0) {
  printLogo();
  printError("Unknown option", args.unknown[0], " (see whodis --help)");
  process.exit(1);
}

if (!args.domain) {
  printLogo();
  printHelp();
  process.exit(1);
}

const domain = normalizeDomain(args.domain);

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
    printError("Not responding", domain, " (tried https, http, www)");
  }
  process.exit(1);
}

const { response, url, responseTime, certificateError } = connection;

const landed = new URL(url);
const redirect = landed.hostname !== domain ? landed.hostname : null;
const insecure = landed.protocol === "http:";
const certificate = insecure ? null : await getCertificate(landed.hostname);

const ipInfo = await getNetworkInfo(ips[0]);
const nameServer = await getNameservers(domain);
const dnsProvider = detectDnsProvider(nameServer);
const orgName = (ipInfo.org ?? "").split(" ").slice(1).join(" ");
const platform = detectPlatform(response, orgName);

stopSpinner();

printResult({ domain, redirect, insecure, ips, responseTime, platform, ipInfo, orgName, certificateError, certificate, dnsProvider });

process.exit(0);
