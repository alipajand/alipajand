import Link from "next/link";

import { Chev } from "components/hairline/Icons/Icons";
import styles from "features/not-found/NotFoundWays.module.css";
import { NOT_FOUND_WAYS, NOT_FOUND_WAYS_ARIA_LABEL } from "data/notFound";

/** Two boxed ways back, set in display type. */
export const NotFoundWays = () => (
  <nav className={styles.ways} aria-label={NOT_FOUND_WAYS_ARIA_LABEL}>
    {NOT_FOUND_WAYS.map((way, index) => (
      <Link key={way.href} href={way.href} className={styles.way}>
        <span className={styles.wayIndex} aria-hidden="true">
          [ {String(index + 1).padStart(2, "0")} ]
        </span>
        <span className={styles.wayLabel}>{way.label}</span>
        <Chev className={styles.wayChev} />
      </Link>
    ))}
  </nav>
);
