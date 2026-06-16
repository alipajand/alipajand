export const FOOTER_ARIA_LABEL = "Site footer";

export interface FooterNavLink {
  href: string;
  label: string;
}

export interface FooterNavCategory {
  label: string;
  links: readonly FooterNavLink[];
}

export const FOOTER_NAV_LINKS: readonly FooterNavCategory[] = [
  {
    label: "Work",
    links: [
      { href: "/portfolio", label: "Portfolio" },
      { href: "/open-source", label: "Open source" },
    ],
  },
  {
    label: "About",
    links: [
      { href: "/", label: "Home" },
      { href: "/now", label: "Now" },
      { href: "/engineering-principles", label: "Principles" },
      { href: "/#contact", label: "Contact" },
    ],
  },
] as const;

export const FOOTER_WRITING_LABEL = "Writing";

export const FOOTER_WRITING_ARCHIVE_LABEL = "All writing";

export const FOOTER_WRITING_ARCHIVE_HREF = "/writing";

export const FOOTER_LATEST_WRITINGS_COUNT = 4;

export const FOOTER_DIRECT_LABEL = "Direct";

export const FOOTER_RESUME_LABEL = "Résumé";

export function footerCopyright(year: number): string {
  return `©${year} by Ali Pajand`;
}

export function getFooterNavLinksFlat(): FooterNavLink[] {
  return FOOTER_NAV_LINKS.flatMap((category) => [...category.links]);
}
