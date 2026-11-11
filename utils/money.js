export function parseMoney(text) {
  return Number(text.replace(/[$,]/g, ''));
}
