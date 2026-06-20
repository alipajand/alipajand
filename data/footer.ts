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
      { href: "/open-source", label: "Open Source" },
      { href: "/writing", label: "Writing" },
    ],
  },
  {
    label: "About",
    links: [
      { href: "/engineering-principles", label: "Principles" },
      { href: "/#contact", label: "Contact" },
    ],
  },
] as const;

export const FOOTER_WRITING_LABEL = "Latest writing";

export const FOOTER_LATEST_WRITINGS_COUNT = 4;

export const FOOTER_BRAND =
  "Ali Pajand — Senior Frontend Engineer · Product Engineer · Design Systems";

export const FOOTER_LOCATION = "Montreal, Canada · Open to remote";

export const footerCopyright = (year: number): string => {
  return `©${year}`;
};

export const getFooterNavLinksFlat = (): FooterNavLink[] => {
  return FOOTER_NAV_LINKS.flatMap((category) => [...category.links]);
};
