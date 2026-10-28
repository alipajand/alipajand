import Link from "next/link";

import { Chev } from "components/hairline/Icons/Icons";
import styles from "components/hairline/NextLinks/NextLinks.module.css";

export interface NextLink {
  eyebrow: string;
  title: string;
  href: string;
}

interface NextLinksProps {
  links: readonly NextLink[];
  label: string;
  variant?: "next" | "pager";
}

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
