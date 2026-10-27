import { MotionToggle } from "components/hairline/MotionToggle/MotionToggle";
import styles from "components/hairline/SiteFooter/SiteFooter.module.css";
import { FOOTER_ARIA_LABEL, FOOTER_CHANNEL_LABELS, FOOTER_CHANNELS_ARIA_LABEL } from "data/footer";
import { LINKS } from "data/links";
import { EXTERNAL_LINK_NEW_TAB_HINT } from "data/pageChrome";
import { CANONICAL_URL, LOCATION, SITE_NAME } from "data/site";

interface SiteFooterProps {
  /** Injected in tests; defaults to the current year at render time. */
  year?: number;
}

const CHANNELS = FOOTER_CHANNEL_LABELS.flatMap((label) => {
  const link = LINKS.find((item) => item.label === label);
  return link ? [link] : [];
});

/**
 * The mono footer that closes every page: the direct channels, then name, location, the site-wide
 * motion pause control, and the site and year.
 */
export const SiteFooter = ({ year = new Date().getFullYear() }: SiteFooterProps) => (
  <footer className={styles.foot} aria-label={FOOTER_ARIA_LABEL}>
    <ul className={styles.channels} aria-label={FOOTER_CHANNELS_ARIA_LABEL}>
      {CHANNELS.map((channel) => {
        const external = channel.href.startsWith("http");
        return (
          <li key={channel.label}>
            <a
              href={channel.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              aria-label={external ? `${channel.label}${EXTERNAL_LINK_NEW_TAB_HINT}` : undefined}
            >
              {channel.label}
            </a>
          </li>
        );
      })}
    </ul>
    <span>{SITE_NAME}</span>
    <span>{LOCATION}</span>
    <span>
      <MotionToggle />
    </span>
    <span>
      {new URL(CANONICAL_URL).host} · {year}
    </span>
  </footer>
);
