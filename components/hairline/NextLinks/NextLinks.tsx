import Link from "next/link";

import { Chev } from "components/hairline/Icons/Icons";
import styles from "components/hairline/NextLinks/NextLinks.module.css";

export interface NextLink {
  /** Mono line above the title, such as "[ Next ] Case study". */
  eyebrow: string;
  title: string;
  href: string;
}

interface NextLinksProps {
  links: readonly NextLink[];
  label: string;
  /** `pager` is the case-study pager: up to two larger links, side by side. */
  variant?: "next" | "pager";
}

/** The row of large "where to go next" links closing a page, up to three across. */
export const NextLinks = ({ links, label, variant = "next" }: NextLinksProps) => (
  <nav
    className={variant === "pager" ? `${styles.next} ${styles.pager}` : styles.next}
    aria-label={label}
    data-count={links.length}
  >
    {links.map((link) => (
      <Link key={link.href} href={link.href} className={styles.link}>
        <span className={styles.eyebrow}>{link.eyebrow}</span>
        <strong className={styles.title}>
          {link.title}
          <Chev />
        </strong>
      </Link>
    ))}
  </nav>
);
