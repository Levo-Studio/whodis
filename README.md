# whodis

Ask a domain who it is. It usually answers.

```
$ whodis github.com

◉ github.com
  IP          140.82.121.4
  Server      GitHub.com
  Response    23 ms
  Mail        MX → aspmx.l.google.com
  SSL         valid until 05.03.2027 (160 days)
```

## What it does

You give it a domain. It looks up the IP, measures how long the server takes to answer, reads the server header, finds the mail servers and checks the SSL certificate. Then it prints all of that in color, because plain text is for people with no joy.

## Requirements

Node.js 18 or newer. That's it. No dependencies, no build step, no framework. Just one file doing its best.

## Install

```
git clone <repo-url>
cd whodis
npm link
```

Now `whodis` works everywhere in your terminal.

## Usage

```
whodis example.com
```

No `https://`, no path. Just the domain. It's not complicated and neither is the tool.

## Why

Because `dig`, `curl -I` and `openssl s_client` are three commands too many.

## License

MIT. Do whatever you want with it. See [LICENSE](LICENSE).
