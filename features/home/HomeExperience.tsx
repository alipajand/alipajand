import { SectionHead } from "components/hairline/SectionHead/SectionHead";
import { LitList } from "components/hairline/LitList/LitList";
import styles from "features/home/HomeExperience.module.css";
import {
  EDUCATION,
  EDUCATION_HEADING,
  EXPERIENCE,
  EXPERIENCE_HEADING,
  experienceCount,
} from "data/experience";

const pad = (index: number) => String(index + 1).padStart(2, "0");

export const HomeExperience = () => (
  <>
    <section id="experience" aria-labelledby="experience-heading">
      <SectionHead
        title={EXPERIENCE_HEADING}
        titleId="experience-heading"
        note={experienceCount(EXPERIENCE.length)}
      />
      <LitList>
        {EXPERIENCE.map((entry, index) => (
          <li key={entry.id} className={styles.row}>
            <span className={styles.index} aria-hidden="true">
              [{pad(index)}]
            </span>
            <div>
              <h3 className={styles.title}>{entry.organization}</h3>
              <p className={styles.meta}>
                {entry.role} · {entry.period}
              </p>
            </div>
            <p className={styles.summary}>{entry.summary}</p>
          </li>
        ))}
      </LitList>
    </section>
    <section id="education" aria-labelledby="education-heading">
      <SectionHead title={EDUCATION_HEADING} titleId="education-heading" />
      <LitList>
        {EDUCATION.map((entry, index) => (
          <li key={entry.id} className={styles.row}>
            <span className={styles.index} aria-hidden="true">
              [{pad(index)}]
            </span>
            <h3 className={styles.degree}>{entry.degree}</h3>
            <p className={styles.summary}>
              {entry.institution} · {entry.period}
            </p>
          </li>
        ))}
      </LitList>
    </section>
  </>
);
