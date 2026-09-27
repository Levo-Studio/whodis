import { readFileSync } from "node:fs";

export function getVersion() {
  const packageJson = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8"));
  return packageJson.version;
}
