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

With `--detailed` the reasons are listed below the platform:

```
  Platform  Cloudflare (proxied or hosted)
            ✓ IP in Cloudflare range
            ✓ cf-ray header
            ✓ direct IP answers as Cloudflare
```

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
| `--detailed`, `-d` | show why a domain counts as proxied |

## Requirements

Node.js 18 or newer. No dependencies, no build step.

## Privacy

Network and location info comes from [ipinfo.io](https://ipinfo.io). The first IP of the domain you look up is sent there. Nothing else leaves your machine except the DNS lookups and the request to the site itself. With `--detailed`, one extra plain HTTP request goes to that IP directly, without the domain.

## Why

Because `dig`, `curl -I` and `openssl s_client` are three commands too many.

## License

MIT. Do whatever you want with it. See [LICENSE](LICENSE).
