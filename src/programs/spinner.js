let spinner;
export function printSpinner(domain) {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  const totalSteps = 4;
  let frame = 0;

  let status = "Checking " + domain

  spinner = setInterval(() => {
    process.stdout.write("\r" + frames[frame % frames.length] + " " + status);
    frame++;
  }, 80);
}

export function stopSpinner() {
  clearInterval(spinner);
  process.stdout.write("\r\x1b[2K");
}
