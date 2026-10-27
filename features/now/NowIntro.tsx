import styles from "features/now/NowIntro.module.css";
import { NOW_ADDRESS_LABEL, NOW_INTRO_ARIA_LABEL, NOW_LEDE } from "data/now";
import { NOW_PAGE_HEADER_OVERLINE } from "data/pageChrome";

/** The page address and overline beside the lede. */
export const NowIntro = () => (
  <section id="about-this-page" className={styles.intro} aria-label={NOW_INTRO_ARIA_LABEL}>
    <div className={styles.over}>
      <span className={styles.address}>{NOW_ADDRESS_LABEL}</span>
      <strong className={styles.overTitle}>{NOW_PAGE_HEADER_OVERLINE}</strong>
    </div>
    <p className={styles.lede}>{NOW_LEDE}</p>
  </section>
);
