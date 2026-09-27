export function parseArgs(argv) {
  const result = {
    domain: null,
    help: false,
    version: false,
    detailed: false,
    ipcheck: false,
    unknown: [],
  };

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--version" || arg === "-v") {
      result.version = true;
    } else if (arg === "--detailed" || arg === "-d") {
      result.detailed = true;
    } else if (arg === "--ipcheck" || arg === "-i") {
      result.ipcheck = true;
    } else if (arg.startsWith("-")) {
      result.unknown.push(arg);
    } else if (!result.domain) {
      result.domain = arg;
    }
  }

  return result;
}
