import Link from "next/link";

import { Chev } from "components/hairline/Icons/Icons";
import styles from "features/open-source/OpenSourceCta.module.css";
import {
  OPEN_SOURCE_CTA_BODY,
  OPEN_SOURCE_CTA_CONTACT_HINT,
  OPEN_SOURCE_CTA_CONTACT_HREF,
  OPEN_SOURCE_CTA_CONTACT_LABEL,
  OPEN_SOURCE_CTA_EYEBROW,
  OPEN_SOURCE_CTA_HEADING,
  OPEN_SOURCE_CTA_LINKS_LABEL,
  OPEN_SOURCE_CTA_PRIMARY_HREF,
  OPEN_SOURCE_CTA_PRIMARY_LABEL,
  OPEN_SOURCE_CTA_SECONDARY_HREF,
  OPEN_SOURCE_CTA_SECONDARY_LABEL,
  OPEN_SOURCE_CTA_WRITING_HINT,
} from "data/openSourcePage";

export const OpenSourceCta = () => (
  <section id="explore" className={styles.cta} aria-labelledby="cta-title">
    <div className={styles.lead}>
      <span className={styles.label}>{OPEN_SOURCE_CTA_EYEBROW}</span>
      <h2 id="cta-title" className={styles.title}>
        {OPEN_SOURCE_CTA_HEADING}
      </h2>
      <p>{OPEN_SOURCE_CTA_BODY}</p>
    </div>
    <nav className={styles.next} aria-labelledby="cta-links-label">
      <span id="cta-links-label" className={styles.label}>
        {OPEN_SOURCE_CTA_LINKS_LABEL}
      </span>
      <div className={styles.links}>
        <Link href={OPEN_SOURCE_CTA_PRIMARY_HREF}>
          <span>{OPEN_SOURCE_CTA_PRIMARY_LABEL}</span>
          <Chev />
        </Link>
        <Link href={OPEN_SOURCE_CTA_SECONDARY_HREF}>
          <span>{OPEN_SOURCE_CTA_SECONDARY_LABEL}</span>
          <span className={styles.hint}>{OPEN_SOURCE_CTA_WRITING_HINT}</span>
        </Link>
        <Link href={OPEN_SOURCE_CTA_CONTACT_HREF}>
          <span>{OPEN_SOURCE_CTA_CONTACT_LABEL}</span>
          <span className={styles.hint}>{OPEN_SOURCE_CTA_CONTACT_HINT}</span>
        </Link>
      </div>
    </nav>
  </section>
);
