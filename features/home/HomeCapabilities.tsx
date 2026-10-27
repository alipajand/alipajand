import { SectionHead } from "components/hairline/SectionHead/SectionHead";
import { LitList } from "components/hairline/LitList/LitList";
import styles from "features/home/HomeCapabilities.module.css";
import { homepageCapabilityCount } from "data/homepage";
import { HIRING_FIT_CARDS, HIRING_FIT_HEADING } from "data/hiringFit";

const pad = (index: number) => String(index + 1).padStart(2, "0");

export const HomeCapabilities = () => (
  <section id="hiring-fit" aria-labelledby="hiring-fit-heading">
    <SectionHead
      title={HIRING_FIT_HEADING}
      titleId="hiring-fit-heading"
      note={homepageCapabilityCount(HIRING_FIT_CARDS.length)}
    />
    <LitList>
      {HIRING_FIT_CARDS.map((card, index) => (
        <li key={card.id} className={styles.cap}>
          <span className={styles.index} aria-hidden="true">
            [{pad(index)}]
          </span>
          <h3 className={styles.title}>{card.title}</h3>
          <ul className={styles.list}>
            {card.body.split(", ").map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </li>
      ))}
    </LitList>
  </section>
);
