import { Band } from "components/hairline/Band/Band";
import { BandChevrons } from "components/hairline/Band/BandChevrons";
import styles from "features/engineering-principles/EngineeringPrinciplesReview.module.css";
import {
  ENGINEERING_PRINCIPLES_REVIEW_LABEL,
  ENGINEERING_PRINCIPLES_REVIEW_QUOTE,
} from "data/engineeringPrinciples";

/** The closing bone band: the lede's last sentence set large, with the chevron row. */
export const EngineeringPrinciplesReview = () => (
  <Band id="design-review" aria-labelledby="design-review-label">
    <div className={styles.close}>
      <div className={styles.side}>
        <span id="design-review-label" className={styles.label}>
          [ {ENGINEERING_PRINCIPLES_REVIEW_LABEL} ]
        </span>
      </div>
      <blockquote className={styles.quote}>{ENGINEERING_PRINCIPLES_REVIEW_QUOTE}</blockquote>
    </div>
    <BandChevrons count={12} />
  </Band>
);
