export const FOOTER_ARIA_LABEL = "Site footer";

export const FOOTER_NAV_ARIA_LABEL = "Footer";

export const FOOTER_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/writing", label: "Writing" },
  { href: "/engineering-principles", label: "Principles" },
  { href: "/open-source", label: "Open source" },
  { href: "/#contact", label: "Contact" },
] as const;

export const FOOTER_DIRECT_LABEL = "Direct";

export const FOOTER_RESUME_LABEL = "Résumé";

export function footerCopyright(year: number): string {
  return `©${year} by Ali Pajand`;
}
