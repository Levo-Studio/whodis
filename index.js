#!/usr/bin/env node

import { printLogo } from "./src/programs/logo-display.js";
import { printSpinner, stopSpinner } from "./src/programs/spinner.js";
import { detectPlatform } from "./src/programs/platform.js";
import { getIps, getNameservers, getRootRecord } from "./src/programs/dns.js";
import { connect } from "./src/programs/connect.js";
import { getNetworkInfo } from "./src/programs/network.js";
import { printError, printResult, printHelp, printVersion } from "./src/programs/output.js";
import { normalizeDomain } from "./src/programs/domain.js";
import { parseArgs } from "./src/programs/args.js";
import { getVersion } from "./src/programs/version.js";
import { getCertificate } from "./src/programs/ssl.js";
import { detectDnsProvider } from "./src/programs/dns-provider.js";
import { detectProxy, findCdnRange } from "./src/programs/proxy.js";
import { probeIp } from "./src/programs/probe.js";

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

const [ipInfo, probe] = await Promise.all([
  getNetworkInfo(ips[0]),
  args.detailed ? probeIp(ips[0]) : null,
]);
const { zone, nameservers } = await getNameservers(domain);
const dnsProvider = detectDnsProvider(nameservers);
const rootRecord = await getRootRecord(zone);
const orgName = (ipInfo.org ?? "").split(" ").slice(1).join(" ");
const platform = detectPlatform(response, orgName);
const proxy = detectProxy({ ip: ips[0], orgName, response, probe });
const rootOrigin = proxy.proxied && rootRecord !== null && rootRecord !== ips[0] && !findCdnRange(rootRecord) && Boolean(findCdnRange(ips[0]));

stopSpinner();

printResult({ domain, redirect, insecure, ips, responseTime, platform, ipInfo, orgName, certificateError, certificate, dnsProvider, proxy, detailed: args.detailed, rootRecord, rootOrigin });

process.exit(0);
