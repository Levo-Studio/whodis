import dns from "node:dns/promises";

// ---------- Colors ----------

const gray = "\x1b[38;2;200;200;200m";
const bold = "\x1b[1m";
const value = "\x1b[38;2;96;165;250m";
const reset = "\x1b[0m";
const red = "\x1b[38;2;248;113;113m";

const from = [91, 227, 139];  // #5BE38B
const to = [59, 130, 246];    // #3B82F6

// ---------- Logo-Symbol ----------

const logo = [
  "██╗    ██╗██╗  ██╗ ██████╗ ██████╗ ██╗███████╗",
  "██║    ██║██║  ██║██╔═══██╗██╔══██╗██║██╔════╝",
  "██║ █╗ ██║███████║██║   ██║██║  ██║██║███████╗",
  "██║███╗██║██╔══██║██║   ██║██║  ██║██║╚════██║",
  "╚███╔███╔╝██║  ██║╚██████╔╝██████╔╝██║███████║",
  " ╚══╝╚══╝ ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝╚══════╝",
];

// ---------- Domain-Check ----------

const domain = process.argv[2];

if (!domain) {
  console.log("Usage: whodis <domain>")
  process.exit(1)
}

// ---------- Logo ----------

console.log();
let i = 0;
for (const line of logo) {
  const t = i / (logo.length - 1);
  const r = Math.round(from[0] + (to[0] - from[0]) * t);
  const g = Math.round(from[1] + (to[1] - from[1]) * t);
  const b = Math.round(from[2] + (to[2] - from[2]) * t);

  console.log("\x1b[38;2;" + r + ";" + g + ";" + b + "m" + line + "\x1b[0m");
  i++;
}
console.log();

// ---------- Spinner ----------

const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const totalSteps = 4;
let frame = 0;

let status = "Checking " + domain

const spinner = setInterval(() => {
  process.stdout.write("\r" + frames[frame % frames.length] + " " + status);
  frame++;
}, 80);

function stopSpinner() {
  clearInterval(spinner);
  process.stdout.write("\r\x1b[2K");
}


// ---------- 1. DNS ----------

let ips;
try {
  ips = await dns.resolve4(domain);
} catch {
  stopSpinner();
  console.log("  " + red + "✗" + reset + " " + gray + "Domain not found: " + reset + bold + value + domain + reset + "\n");
  process.exit(1);
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

const platforms = [
  { header: "x-vercel-id", name: "Vercel" },
  { header: "x-nf-request-id", name: "Netlify" },
  { header: "x-render-origin-server", name: "Render" },
  { header: "fly-request-id", name: "Fly.io" },
  { header: "x-railway-edge", name: "Railway" },
  { header: "x-github-request-id", name: "GitHub" },
  { header: "x-shopid", name: "Shopify" },
  { header: "x-wix-request-id", name: "Wix" },
  { header: "x-azure-ref", name: "Azure" },
  { header: "x-amz-cf-id", name: "AWS CloudFront" },
  { header: "cdn-pullzone", name: "Bunny CDN" },
  { header: "x-akamai-transformed", name: "Akamai" },
  { header: "cf-ray", name: "Cloudflare" },
  { header: "x-served-by", name: "Fastly" },
];

const networks = [
  { org: "amazon", name: "AWS" },
  { org: "google", name: "Google" },
  { org: "microsoft", name: "Azure" },
  { org: "hetzner", name: "Hetzner" },
  { org: "digitalocean", name: "DigitalOcean" },
  { org: "ovh", name: "OVHcloud" },
  { org: "oracle", name: "Oracle Cloud" },
  { org: "akamai", name: "Akamai / Linode" },
  { org: "ionos", name: "IONOS" },
  { org: "strato", name: "Strato" },
  { org: "netcup", name: "netcup" },
  { org: "scaleway", name: "Scaleway" },
  { org: "constant company", name: "Vultr" },
  { org: "cloudflare", name: "Cloudflare" },
  { org: "fastly", name: "Fastly" },
];

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
console.log("  " + gray + "IP" + reset + "        " + bold + value + ips[0] + reset + "\n");
console.log("  " + gray + "Response" + reset + "  " + bold + value + endRounded + "ms" + reset + "\n");
console.log("  " + gray + "Platform" + reset + "  " + bold + value + platform + reset + "\n");

if (ipInfo.org) {
  console.log("  " + gray + "Network" + reset + "   " + bold + value + orgName + " · " + ipInfo.city + ", " + ipInfo.country + reset + "\n");
} else {
  console.log("  " + gray + "Network" + reset + "   " + bold + value + "unavailable" + reset + "\n");
}

process.exit(1);
