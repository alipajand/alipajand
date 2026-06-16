import Link from "next/link";

import { FooterDirectChannel } from "components/Footer/FooterDirectChannel";
import {
  FOOTER_ARIA_LABEL,
  FOOTER_DIRECT_LABEL,
  FOOTER_NAV_LINKS,
  FOOTER_RESUME_LABEL,
  FOOTER_WRITING_ARCHIVE_HREF,
  FOOTER_WRITING_ARCHIVE_LABEL,
  FOOTER_WRITING_LABEL,
  footerCopyright,
} from "data/footer";
import { LINKS } from "data/links";
import { HERO_CTA_DOWNLOAD_RESUME, RESUME_URL } from "data/site";
import type { WritingIndexPost } from "features/writing/WritingIndexPost";
import { FOCUS_RING, SECTION_INNER, SECTION_X } from "utils/visual";

const LINK_CLASS = `text-sm text-muted hover:text-foreground transition-colors rounded-sm inline-flex min-h-9 items-center ${FOCUS_RING}`;

const CATEGORY_LABEL_CLASS =
  "text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-2";

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
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-4">
          {FOOTER_NAV_LINKS.map((category) => (
            <nav key={category.label} aria-label={category.label}>
              <p className={CATEGORY_LABEL_CLASS}>{category.label}</p>
              <ul className="flex flex-col gap-1 list-none p-0 m-0">
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
            <ul className="flex flex-col gap-1 list-none p-0 m-0">
              <li>
                <Link href={FOOTER_WRITING_ARCHIVE_HREF} className={LINK_CLASS}>
                  {FOOTER_WRITING_ARCHIVE_LABEL}
                </Link>
              </li>
              {latestWritings.map((post) => (
                <li key={post.slug}>
                  <Link href={`/writing/${post.slug}`} className={LINK_CLASS}>
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className={CATEGORY_LABEL_CLASS}>{FOOTER_DIRECT_LABEL}</p>
            <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
              {LINKS.map((channel) => (
                <li key={channel.label}>
                  <FooterDirectChannel label={channel.label} href={channel.href} />
                </li>
              ))}
            </ul>
            {RESUME_URL ? (
              <a href={RESUME_URL} download className={`${LINK_CLASS} mt-3`}>
                {HERO_CTA_DOWNLOAD_RESUME}
                <span className="sr-only"> ({FOOTER_RESUME_LABEL})</span>
              </a>
            ) : null}
          </div>
        </div>

        <p className="mt-10 pt-8 border-t border-border text-xs text-muted">
          {footerCopyright(year)}
        </p>
      </div>
    </footer>
  );
};
