export const navLinkAriaCurrent = (href: string, pathname: string | null): "page" | undefined => {
  if (pathname == null) return undefined;
  if (href === "/writing") {
    return pathname === "/writing" || pathname.startsWith("/writing/") ? "page" : undefined;
  }
  if (href === "/portfolio") {
    return pathname === "/portfolio" || pathname.startsWith("/portfolio/") ? "page" : undefined;
  }
  return undefined;
};

export const homeBrandAriaCurrent = (pathname: string | null): "page" | undefined => {
  if (pathname == null) return undefined;
  return pathname === "/" ? "page" : undefined;
};
