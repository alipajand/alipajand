/**
 * `aria-current="page"` for primary nav: pathname-based routes only (not same-page hash links).
 */
export function navLinkAriaCurrent(
  href: string,
  pathname: string | null
): "page" | undefined {
  if (pathname == null) return undefined;
  if (href === "/blog") {
    return pathname === "/blog" || pathname.startsWith("/blog/") ? "page" : undefined;
  }
  if (href === "/portfolio") {
    return pathname === "/portfolio" ? "page" : undefined;
  }
  return undefined;
}

/** Brand link to `/` — current when the user is on the homepage route. */
export function homeBrandAriaCurrent(pathname: string | null): "page" | undefined {
  if (pathname == null) return undefined;
  return pathname === "/" ? "page" : undefined;
}
