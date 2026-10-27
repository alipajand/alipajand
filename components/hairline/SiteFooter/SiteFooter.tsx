import styles from "components/hairline/SiteFooter/SiteFooter.module.css";
import { FOOTER_ARIA_LABEL } from "data/footer";
import { CANONICAL_URL, LOCATION, SITE_NAME } from "data/site";

interface SiteFooterProps {
  /** Injected in tests; defaults to the current year at render time. */
  year?: number;
}

/** The three-cell mono footer that closes every page. */
export const SiteFooter = ({ year = new Date().getFullYear() }: SiteFooterProps) => (
  <footer className={styles.foot} aria-label={FOOTER_ARIA_LABEL}>
    <span>{SITE_NAME}</span>
    <span>{LOCATION}</span>
    <span>
      {new URL(CANONICAL_URL).host} · {year}
    </span>
  </footer>
);
