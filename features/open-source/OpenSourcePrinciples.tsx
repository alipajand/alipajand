import { Band } from "components/hairline/Band/Band";
import { BandChevrons } from "components/hairline/Band/BandChevrons";
import styles from "features/open-source/OpenSourcePrinciples.module.css";
import {
  OPEN_SOURCE_SHARED_PRINCIPLES,
  OPEN_SOURCE_SHARED_PRINCIPLES_HEADING,
  OPEN_SOURCE_SHARED_PRINCIPLES_NOTE,
} from "data/openSourcePage";

const pad = (index: number) => String(index + 1).padStart(2, "0");

export const OpenSourcePrinciples = () => (
  <Band id="working-principles" aria-labelledby="principles-title">
    <div className={styles.head}>
      <h2 id="principles-title" className={styles.title}>
        {OPEN_SOURCE_SHARED_PRINCIPLES_HEADING}
      </h2>
      <span className={styles.note}>{OPEN_SOURCE_SHARED_PRINCIPLES_NOTE}</span>
    </div>
    <ul className={styles.principles}>
      {OPEN_SOURCE_SHARED_PRINCIPLES.map((principle, index) => (
        <li key={principle.title} className={styles.principle}>
          <span className={styles.note} aria-hidden="true">
            [ {pad(index)} ]
          </span>
          <h3 className={styles.principleTitle}>{principle.title}</h3>
          <p>{principle.body}</p>
        </li>
      ))}
    </ul>
    <BandChevrons count={12} />
  </Band>
);
