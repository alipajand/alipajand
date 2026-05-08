export function isHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}
