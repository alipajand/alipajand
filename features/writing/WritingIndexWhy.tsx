import { Band } from "components/hairline/Band/Band";
import { BandChevrons } from "components/hairline/Band/BandChevrons";
import styles from "features/writing/WritingIndexWhy.module.css";
import { WRITING_WHY_EYEBROW, WRITING_WHY_IT_MATTERS, WRITING_WHY_LABEL } from "data/writing";

export const WritingIndexWhy = () => (
  <Band id="why-it-matters" aria-label={WRITING_WHY_LABEL}>
    <div className={styles.why}>
      <div className={styles.whySide}>
        <span className={styles.mono}>{WRITING_WHY_EYEBROW}</span>
      </div>
      <blockquote className={styles.quote}>{WRITING_WHY_IT_MATTERS}</blockquote>
    </div>
    <BandChevrons count={12} />
  </Band>
);
