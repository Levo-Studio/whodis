export function daysUntil(date) {
  const milliseconds = new Date(date) - Date.now();
  return Math.floor(milliseconds / (1000 * 60 * 60 * 24));
}
