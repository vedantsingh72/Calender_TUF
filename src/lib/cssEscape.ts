export function cssBackgroundUrl(href: string): string {
  return `url("${href.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}")`;
}
