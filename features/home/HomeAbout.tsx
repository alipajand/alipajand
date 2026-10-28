import { Band } from "components/hairline/Band/Band";
import { BandChevrons } from "components/hairline/Band/BandChevrons";
import styles from "features/home/HomeAbout.module.css";
import { ABOUT_HEADING, ABOUT_PARAGRAPHS } from "data/about";
import {
  HOMEPAGE_ABOUT_EYEBROW,
  HOMEPAGE_ABOUT_LABELS,
  HOMEPAGE_ABOUT_PULL_INDEX,
  HOMEPAGE_HERO_NAME,
} from "data/homepage";

const pad = (index: number) => String(index + 1).padStart(2, "0");

export const HomeAbout = () => (
  <Band id="about" aria-labelledby="about-heading">
    <div className={styles.about}>
      <div className={styles.side}>
        <span className={styles.eyebrow}>{HOMEPAGE_ABOUT_EYEBROW}</span>
        <h2 id="about-heading" className={styles.title}>
          {ABOUT_HEADING}
        </h2>
        <figure className={styles.pull} aria-hidden="true">
          <blockquote>{ABOUT_PARAGRAPHS[HOMEPAGE_ABOUT_PULL_INDEX]}</blockquote>
          <figcaption className={styles.cite}>— {HOMEPAGE_HERO_NAME}</figcaption>
        </figure>
      </div>
      <div>
        <div className={styles.text}>
          {ABOUT_PARAGRAPHS.map((paragraph, index) => (
            <div key={paragraph} className={styles.cell}>
              <span className={styles.index}>
                [ {pad(index)} ] {HOMEPAGE_ABOUT_LABELS[index]}
              </span>
              <p>{paragraph}</p>
            </div>
          ))}
        </div>
        <BandChevrons count={10} />
      </div>
    </div>
  </Band>
);
