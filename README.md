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
  Platform  Google
  Network   Google LLC · Frankfurt am Main, DE
```

## What it does

You give it a domain. It looks up the IP, finds out where the website actually answers, measures how long that takes, and guesses who hosts it. Then it prints all of that in color, because plain text is for people with no joy.

- Tries `https`, `https://www.`, `http` and `http://www.` until something answers
- Shows where you end up if the site redirects you
- Warns in red if the site only speaks plain HTTP or has a broken SSL certificate
- Detects the platform from response headers (Vercel, Netlify, Cloudflare, …) or from the network behind the IP (Hetzner, AWS, Google, …)

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

## Requirements

Node.js 18 or newer. No dependencies, no build step.

## Privacy

Network and location info comes from [ipinfo.io](https://ipinfo.io). The first IP of the domain you look up is sent there. Nothing else leaves your machine except the DNS lookup and the request to the site itself.

## Why

Because `dig`, `curl -I` and `openssl s_client` are three commands too many.

## License

MIT. Do whatever you want with it. See [LICENSE](LICENSE).
