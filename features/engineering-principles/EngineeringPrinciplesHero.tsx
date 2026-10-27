import Link from "next/link";

import { Chev } from "components/hairline/Icons/Icons";
import styles from "features/engineering-principles/EngineeringPrinciplesHero.module.css";
import { PrinciplesAlignment } from "features/engineering-principles/PrinciplesAlignment";
import {
  ENGINEERING_PRINCIPLES_CTAS,
  ENGINEERING_PRINCIPLES_HEADER_OVERLINE,
  ENGINEERING_PRINCIPLES_LEDE,
  ENGINEERING_PRINCIPLES_SECTIONS,
  ENGINEERING_PRINCIPLES_TITLE_ID,
  engineeringPrinciplesCountLabel,
} from "data/engineeringPrinciples";

const TITLES = ENGINEERING_PRINCIPLES_SECTIONS.map((section) => section.title);

/** The introduction: lede and links on the left, the settling-lines diagram on the right. */
export const EngineeringPrinciplesHero = () => (
  <section
    id="introduction"
    className={styles.hero}
    aria-labelledby={ENGINEERING_PRINCIPLES_TITLE_ID}
  >
    <div className={styles.copy}>
      <p className={styles.eyebrow}>
        <span>[ {ENGINEERING_PRINCIPLES_HEADER_OVERLINE} ]</span>
        <span>{engineeringPrinciplesCountLabel(ENGINEERING_PRINCIPLES_SECTIONS.length)}</span>
      </p>
      <p className={styles.lede}>{ENGINEERING_PRINCIPLES_LEDE}</p>
      <div className={styles.ctas}>
        {ENGINEERING_PRINCIPLES_CTAS.map((cta) => (
          <Link key={cta.href} href={cta.href}>
            {cta.label}
            <Chev />
          </Link>
        ))}
      </div>
    </div>
    <PrinciplesAlignment titles={TITLES} />
  </section>
);
