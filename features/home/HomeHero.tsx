import Link from "next/link";

import { Chev } from "components/hairline/Icons/Icons";
import { StrataCanvas } from "features/home/StrataCanvas";
import styles from "features/home/HomeHero.module.css";
import {
  HOMEPAGE_HERO_BODY,
  HOMEPAGE_HERO_EYEBROW,
  HOMEPAGE_HERO_LOCATION,
  HOMEPAGE_HERO_PRIMARY_CTA_HREF,
  HOMEPAGE_HERO_PRIMARY_CTA_LABEL,
  HOMEPAGE_HERO_SECONDARY_CTA_HREF,
  HOMEPAGE_HERO_SECONDARY_CTA_LABEL,
  HOMEPAGE_HERO_TITLE,
  HOMEPAGE_PROOF_ARIA_LABEL,
} from "data/homepage";
import { HERO_PROOF_ROW, HERO_SECTION_ARIA_LABEL } from "data/site";

export const HomeHero = () => (
  <>
    <section id="hero" className={styles.hero} aria-label={HERO_SECTION_ARIA_LABEL}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>
          <span>{HOMEPAGE_HERO_EYEBROW}</span>
          <span>{HOMEPAGE_HERO_LOCATION}</span>
        </p>
        <h1 className={styles.lede}>{HOMEPAGE_HERO_TITLE}</h1>
        <p className={styles.body}>{HOMEPAGE_HERO_BODY}</p>
        <div className={styles.ctas}>
          <Link href={HOMEPAGE_HERO_PRIMARY_CTA_HREF}>
            {HOMEPAGE_HERO_PRIMARY_CTA_LABEL}
            <Chev />
          </Link>
          <Link href={HOMEPAGE_HERO_SECONDARY_CTA_HREF}>
            {HOMEPAGE_HERO_SECONDARY_CTA_LABEL}
            <Chev />
          </Link>
        </div>
      </div>
      <StrataCanvas />
    </section>

    <dl className={styles.proof} aria-label={HOMEPAGE_PROOF_ARIA_LABEL}>
      {HERO_PROOF_ROW.map((proof) => (
        <div key={proof.value}>
          <dt>{proof.value}</dt>
          <dd>{proof.label}</dd>
        </div>
      ))}
    </dl>
  </>
);
