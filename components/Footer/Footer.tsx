import Link from "next/link";

import { FooterDirectChannel } from "components/Footer/FooterDirectChannel";
import {
  FOOTER_ARIA_LABEL,
  FOOTER_BRAND,
  FOOTER_LOCATION,
  FOOTER_NAV_LINKS,
  FOOTER_WRITING_LABEL,
  footerCopyright,
} from "data/footer";
import { LINKS } from "data/links";
import type { WritingIndexPost } from "features/writing/WritingIndexPost";

interface FooterProps {
  latestWritings: WritingIndexPost[];
}

export const Footer = ({ latestWritings }: FooterProps) => {
  const year = new Date().getFullYear();

  return (
    <footer aria-label={FOOTER_ARIA_LABEL}>
      <div>
        <div>
          <p>{FOOTER_BRAND}</p>
          <p>{FOOTER_LOCATION}</p>
        </div>

        <div>
          {FOOTER_NAV_LINKS.map((category) => (
            <nav key={category.label} aria-label={category.label}>
              <p>{category.label}</p>
              <ul>
                {category.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-label={FOOTER_WRITING_LABEL}>
            <p>{FOOTER_WRITING_LABEL}</p>
            <ul>
              {latestWritings.map((post) => (
                <li key={post.slug}>
                  <Link href={`/writing/${post.slug}`}>{post.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div>
          <p>{footerCopyright(year)}</p>
          <ul>
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
