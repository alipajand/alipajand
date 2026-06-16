export const FOOTER_ARIA_LABEL = "Site footer";

export const FOOTER_NAV_ARIA_LABEL = "Footer";

export const FOOTER_TAGLINE = "Senior Frontend / Product Engineer · Montreal, Canada";

export const FOOTER_NAV_LINKS = [
  { href: "/portfolio", label: "Work" },
  { href: "/open-source", label: "Open source" },
  { href: "/writing", label: "Writing" },
  { href: "/portfolio#about", label: "About" },
  { href: "/now", label: "Now" },
  { href: "/engineering-principles", label: "Engineering principles" },
  { href: "/#contact", label: "Contact" },
] as const;

export const FOOTER_DIRECT_LABEL = "Direct";

export const FOOTER_RESUME_LABEL = "Résumé";

export function footerCopyright(year: number): string {
  return `© ${year} Ali Pajand`;
}
