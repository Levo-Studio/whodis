import dns from "node:dns/promises";

const domain = process.argv[2];

if (!domain) {
  console.log("Usage: whodis <domain>")
  process.exit(1)
} else {
  console.log("Checking " + domain);

}

let ips;
try {
  ips = await dns.resolve4(domain);
} catch {
  console.log("Domain not found: " + domain);
  process.exit(1);
}

console.log("IP: " + ips[0]);

const start = performance.now();

const response = await fetch("https://" + domain);

const end = performance.now();
const endRounded = Math.round(end - start);

console.log("Response: " + endRounded + "ms");

const ipResponse = await fetch("https://ipinfo.io/" + ips[0] + "/json");
const ipInfo = await ipResponse.json();

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

console.log("Platform: " + platform);
console.log("Network:  " + orgName + " · " + ipInfo.city + ", " + ipInfo.country);
