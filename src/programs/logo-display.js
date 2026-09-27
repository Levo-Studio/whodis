import { logo } from "../logo.js";
import { from, to } from "../colors.js";

export function printLogo() {
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
}
