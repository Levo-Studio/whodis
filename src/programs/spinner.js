let spinner;

export function printSpinner(domain) {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let frame = 0;

  const status = "Checking " + domain;

  spinner = setInterval(() => {
    process.stdout.write("\r" + frames[frame % frames.length] + " " + status);
    frame++;
  }, 80);
}

export function stopSpinner() {
  clearInterval(spinner);
  process.stdout.write("\r\x1b[2K");
}
