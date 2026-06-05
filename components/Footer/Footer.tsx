import Link from "next/link";

import {
  FOOTER_ARIA_LABEL,
  FOOTER_DIRECT_LABEL,
  FOOTER_NAV_ARIA_LABEL,
  FOOTER_NAV_LINKS,
  FOOTER_RESUME_LABEL,
  FOOTER_TAGLINE,
  footerCopyright,
} from "data/footer";
import { LINKS } from "data/links";
import { HERO_CTA_DOWNLOAD_RESUME, RESUME_URL, SITE_NAME } from "data/site";
import { FOCUS_RING, SECTION_INNER, SECTION_X } from "utils/visual";

const LINK_CLASS = `text-sm text-muted hover:text-foreground transition-colors rounded-sm inline-flex min-h-9 items-center ${FOCUS_RING}`;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      aria-label={FOOTER_ARIA_LABEL}
      className={`${SECTION_X} border-t border-border bg-background py-12 sm:py-16`}
    >
      <div className={SECTION_INNER}>
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <p className="font-display font-semibold text-foreground text-base">{SITE_NAME}</p>
            <p className="mt-2 text-sm text-muted leading-relaxed">{FOOTER_TAGLINE}</p>
          </div>

          <nav
            aria-label={FOOTER_NAV_ARIA_LABEL}
            className="grid grid-cols-2 gap-x-10 gap-y-1 sm:flex sm:flex-col sm:gap-y-1"
          >
            {FOOTER_NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={LINK_CLASS}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-2">
              {FOOTER_DIRECT_LABEL}
            </p>
            <ul className="flex flex-col gap-1 list-none p-0 m-0">
              {LINKS.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={LINK_CLASS}
                  >
                    {channel.label}
                  </a>
                </li>
              ))}
              {RESUME_URL ? (
                <li>
                  <a href={RESUME_URL} download className={LINK_CLASS}>
                    {HERO_CTA_DOWNLOAD_RESUME}
                    <span className="sr-only"> ({FOOTER_RESUME_LABEL})</span>
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <p className="mt-10 pt-8 border-t border-border text-xs text-muted">
          {footerCopyright(year)}
        </p>
      </div>
    </footer>
  );
}
