export function format(text) {
  return text
    .replace(/##+/g, "")          // remove headings
    .replace(/\|.*\|/g, "")       // remove tables
    .replace(/---+/g, "")         // remove separators
    .replace(/\n{3,}/g, "\n\n")   // normalize spacing
    .split("\n")
    .slice(0, 8)                  // limit length
    .join("\n")
    .trim();
}
