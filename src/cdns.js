export const cdns = [
  { name: "Cloudflare", orgs: ["cloudflare"], headers: ["cf-ray"], server: "cloudflare" },
  { name: "Fastly", orgs: ["fastly"], headers: ["x-fastly-request-id", "x-served-by"], server: null },
  { name: "AWS CloudFront", orgs: [], headers: ["x-amz-cf-id"], server: "cloudfront" },
  { name: "Akamai", orgs: ["akamai international", "akamai technologies"], headers: ["x-akamai-transformed"], server: "akamaighost" },
  { name: "Bunny CDN", orgs: ["bunnyway"], headers: ["cdn-pullzone"], server: "bunnycdn" },
];
