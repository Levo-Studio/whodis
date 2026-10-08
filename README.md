# whodis

Ask a domain who it is. It usually answers.

```
$ whodis google.com

██╗    ██╗██╗  ██╗ ██████╗ ██████╗ ██╗███████╗
██║    ██║██║  ██║██╔═══██╗██╔══██╗██║██╔════╝
██║ █╗ ██║███████║██║   ██║██║  ██║██║███████╗
██║███╗██║██╔══██║██║   ██║██║  ██║██║╚════██║
╚███╔███╔╝██║  ██║╚██████╔╝██████╔╝██║███████║
 ╚══╝╚══╝ ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝╚══════╝

  Domain    google.com
  Redirect  → www.google.com
  IP        142.251.20.100 (+5 more)
  Response  361ms
  SSL       Google Trust Services · 66 days left
  DNS       Google
  Platform  Google
  Network   Google LLC · Frankfurt am Main, DE
  A record  142.251.20.100
```

## What it does

You give it a domain. It looks up the IP, finds out where the website actually answers, measures how long that takes, and guesses who hosts it. Then it prints all of that in color, because plain text is for people with no joy.

- Tries `https`, `https://www.`, `http` and `http://www.` until something answers
- Shows where you end up if the site redirects you
- Warns in red if the site only speaks plain HTTP or has a broken SSL certificate
- Shows who issued the SSL certificate and how many days are left, green above 30, yellow at 30 or less, red at 7 or less
- Shows who runs the DNS of the domain (Cloudflare, AWS Route 53, Hetzner, …) from its nameservers
- Detects the platform from response headers (Vercel, Netlify, Cloudflare, …) or from the network behind the IP (Hetzner, AWS, Google, …)
- Tells you if the site sits behind a CDN like Cloudflare, Fastly or CloudFront, marked as `proxied` or `likely proxied`. If the real host is known it stays the platform and the CDN is shown as `(via Cloudflare)`
- Shows the A record of the root domain and marks it as `likely origin` if the site is proxied but the root domain is not

## Proxy detection

Each signal gives points. 5 or more is `proxied`, 3 or 4 is `likely proxied`.

| Signal | Points |
|---|---|
| IP is in the published range of a CDN | 5 |
| IP belongs to a CDN network | 3 |
| CDN header like `cf-ray` or `x-amz-cf-id` | 3 |
| IP answers as the CDN when asked directly (`--detailed` only) | 2 |
| `server` header names the CDN | 1 |

The IP ranges are a snapshot in `src/cdn-ranges.js`, so whodis does not need to download anything at runtime.

With `--detailed` the reasons are listed below the platform when a site counts as proxied:

```
  Platform  Cloudflare (proxied or hosted)
            ✓ IP in Cloudflare range
            ✓ cf-ray header
            ✓ direct IP answers as Cloudflare
```

## Detailed view

`whodis <domain> --detailed` shows everything whodis knows, grouped by section.

```
  google.com

  HOSTING ─────────────────────────────────────
  IPv4      6 addresses
            142.251.20.100    142.251.20.101    142.251.20.102
            142.251.20.113    142.251.20.138    142.251.20.139
  IPv6      1 address
            2a00:1450:4001:82f::200e
  Location  Frankfurt am Main, DE
  Platform  Google
  Network   Google LLC · AS15169

  WEBSITE ─────────────────────────────────────
  Redirect  → www.google.com
  Protocol  HTTPS
  Response  361ms · gws
  SSL       Google Trust Services · 71 days left

  DNS & MAIL ──────────────────────────────────
  DNS       Google
  Mail      Google Workspace

  DOMAIN ──────────────────────────────────────
  Registrar MarkMonitor Inc.
  Since     1997 (29 years)
```

- **IPv4 / IPv6**: every address the domain resolves to
- **Origin**: the A record of the root domain, only shown when the site is proxied but the root domain is not
- **Response**: response time and the `server` header
- **Mail**: who handles email, from the MX records (Google Workspace, Microsoft 365, Proton Mail, IONOS, …)
- **Registrar / Since**: from the registry of the domain via [RDAP](https://about.rdap.org). Some registries, like DENIC for `.de`, do not publish this, so the section is left out

The list of RDAP servers is a snapshot of the [IANA bootstrap file](https://data.iana.org/rdap/dns.json) in `src/rdap-servers.js`. Only registries that support HTTPS are used.

## Install

```
npm install -g whodiskit
```

The package is called `whodiskit`, the command is `whodis`.

## Usage

```
whodis <domain> [options]
```

Paste whatever you have. `google.com`, `https://www.google.com/search?q=cats` and `GOOGLE.COM` all work.

| Option | |
|---|---|
| `--help`, `-h` | show help |
| `--version`, `-v` | show the version |
| `--detailed`, `-d` | show everything, grouped by section |

## Requirements

Node.js 18 or newer. No dependencies, no build step.

## Privacy

Network and location info comes from [ipinfo.io](https://ipinfo.io). The first IP of the domain you look up is sent there. Nothing else leaves your machine except the DNS lookups and the request to the site itself. With `--detailed`, one extra plain HTTP request goes to that IP directly, without the domain, and the domain is looked up at its own registry over RDAP to read the registrar and registration date. No third party lookup service is used.

## Why

Because `dig`, `curl -I` and `openssl s_client` are three commands too many.

## License

MIT. Do whatever you want with it. See [LICENSE](LICENSE).
