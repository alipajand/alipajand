import styles from "features/now/NowIntro.module.css";
import {
  NOW_ADDRESS_LABEL,
  NOW_INTRO_ARIA_LABEL,
  NOW_LEDE,
  NOW_UPDATED,
  NOW_UPDATED_PREFIX,
} from "data/now";
import { NOW_PAGE_HEADER_OVERLINE } from "data/pageChrome";
import { formatShortDate } from "utils/date";

/** The page address and overline beside the lede, with the date the content was last revised. */
export const NowIntro = () => (
  <section id="about-this-page" className={styles.intro} aria-label={NOW_INTRO_ARIA_LABEL}>
    <div className={styles.over}>
      <span className={styles.address}>{NOW_ADDRESS_LABEL}</span>
      <strong className={styles.overTitle}>{NOW_PAGE_HEADER_OVERLINE}</strong>
      <p className={styles.updated} data-now-updated="">
        {NOW_UPDATED_PREFIX} <time dateTime={NOW_UPDATED}>{formatShortDate(NOW_UPDATED)}</time>
      </p>
    </div>
    <p className={styles.lede}>{NOW_LEDE}</p>
  </section>
);
