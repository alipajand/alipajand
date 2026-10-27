import Link from "next/link";

import { Chev } from "components/hairline/Icons/Icons";
import styles from "features/open-source/OpenSourceHero.module.css";
import { OpenSourceRoute } from "features/open-source/OpenSourceRoute";
import {
  OPEN_SOURCE_CTA_PRIMARY_HREF,
  OPEN_SOURCE_CTA_PRIMARY_LABEL,
  OPEN_SOURCE_HEADER_HEADING,
  OPEN_SOURCE_HEADER_INTRO,
  OPEN_SOURCE_HEADER_LEDE,
  OPEN_SOURCE_HEADER_OVERLINE,
  OPEN_SOURCE_HERO_PROJECTS_CTA_LABEL,
  OPEN_SOURCE_PROJECTS,
  OPEN_SOURCE_PROJECTS_ID,
  OPEN_SOURCE_TITLE_ID,
  openSourceProjectCountLabel,
} from "data/openSourcePage";

/** The page title, lede and two ways in, beside the routing diagram. */
export const OpenSourceHero = () => (
  <section className={styles.hero} aria-labelledby={OPEN_SOURCE_TITLE_ID}>
    <div className={styles.copy}>
      <p className={styles.eyebrow}>
        <span>[ {OPEN_SOURCE_HEADER_OVERLINE} ]</span>
        <span>{openSourceProjectCountLabel(OPEN_SOURCE_PROJECTS.length)}</span>
      </p>
      <h1 id={OPEN_SOURCE_TITLE_ID} className={styles.title}>
        {OPEN_SOURCE_HEADER_HEADING}
      </h1>
      <p className={styles.lede}>{OPEN_SOURCE_HEADER_LEDE}</p>
      <p className={styles.body}>{OPEN_SOURCE_HEADER_INTRO}</p>
      <div className={styles.ctas}>
        <a href={`#${OPEN_SOURCE_PROJECTS_ID}`}>
          {OPEN_SOURCE_HERO_PROJECTS_CTA_LABEL}
          <Chev />
        </a>
        <Link href={OPEN_SOURCE_CTA_PRIMARY_HREF}>
          {OPEN_SOURCE_CTA_PRIMARY_LABEL}
          <Chev />
        </Link>
      </div>
    </div>
    <OpenSourceRoute />
  </section>
);
