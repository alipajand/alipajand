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
}

/** The row of large "where to go next" links closing a page, up to three across. */
export const NextLinks = ({ links, label }: NextLinksProps) => (
  <nav className={styles.next} aria-label={label}>
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
