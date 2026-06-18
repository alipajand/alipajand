import Link from "next/link";

import { FooterDirectChannel } from "components/Footer/FooterDirectChannel";
import {
  FOOTER_ARIA_LABEL,
  FOOTER_NAV_LINKS,
  FOOTER_RESUME_LABEL,
  FOOTER_WRITING_LABEL,
  footerCopyright,
} from "data/footer";
import { LINKS } from "data/links";
import { HERO_CTA_DOWNLOAD_RESUME, RESUME_URL } from "data/site";
import type { WritingIndexPost } from "features/writing/WritingIndexPost";
import { FOCUS_RING, SECTION_INNER, SECTION_X } from "utils/visual";

const LINK_CLASS = `text-sm text-muted hover:text-foreground transition-colors rounded-sm block items-center ${FOCUS_RING}`;

const CATEGORY_LABEL_CLASS =
  "text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-4";

interface FooterProps {
  latestWritings: WritingIndexPost[];
}

export const Footer = ({ latestWritings }: FooterProps) => {
  const year = new Date().getFullYear();

  return (
    <footer
      aria-label={FOOTER_ARIA_LABEL}
      className={`${SECTION_X} border-t border-border bg-background py-12 sm:py-16`}
    >
      <div className={SECTION_INNER}>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {FOOTER_NAV_LINKS.map((category) => (
            <nav key={category.label} aria-label={category.label}>
              <p className={CATEGORY_LABEL_CLASS}>{category.label}</p>
              <ul className="flex flex-col gap-2 list-none p-0 m-0">
                {category.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={LINK_CLASS}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-label={FOOTER_WRITING_LABEL}>
            <p className={CATEGORY_LABEL_CLASS}>{FOOTER_WRITING_LABEL}</p>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {latestWritings.map((post) => (
                <li key={post.slug}>
                  <Link href={`/writing/${post.slug}`} className={LINK_CLASS}>
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-border pt-5">
          <p className="flex-1 text-xs text-muted">{footerCopyright(year)}</p>
          {RESUME_URL ? (
            <a href={RESUME_URL} download className={LINK_CLASS}>
              {HERO_CTA_DOWNLOAD_RESUME}
              <span className="sr-only"> ({FOOTER_RESUME_LABEL})</span>
            </a>
          ) : null}
          <ul className="m-0 flex list-none gap-3 p-0">
            {LINKS.map((channel) => (
              <li key={channel.label}>
                <FooterDirectChannel label={channel.label} href={channel.href} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
