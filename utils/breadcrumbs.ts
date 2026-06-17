import type { BreadcrumbNavItem } from "data/breadcrumbs";
import { CANONICAL_URL } from "data/site";

export const toBreadcrumbJsonLdItems = (
  items: BreadcrumbNavItem[],
  currentPageUrl: string
): { name: string; url: string }[] =>
  items.map((item) => {
    if (item.href) {
      const url = item.href === "/" ? CANONICAL_URL : `${CANONICAL_URL}${item.href}`;
      return { name: item.label, url };
    }
    return { name: item.label, url: currentPageUrl };
  });
