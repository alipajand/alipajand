import { Band } from "components/hairline/Band/Band";
import { BandChevrons } from "components/hairline/Band/BandChevrons";
import { PortfolioIntroParagraph } from "features/portfolio/PortfolioIntroParagraph";
import { StackWords } from "features/portfolio/StackWords";
import styles from "features/portfolio/PortfolioBand.module.css";
import {
  PORTFOLIO_LOOK_FOR_CARDS,
  PORTFOLIO_LOOK_FOR_HEADING,
  PORTFOLIO_LOOK_FOR_LEDE,
} from "data/portfolioFit";
import {
  PORTFOLIO_BAND_EYEBROW,
  PORTFOLIO_BAND_HEADING,
  PORTFOLIO_QUOTE,
  PORTFOLIO_QUOTE_CITE,
} from "data/portfolioIndex";
import { PORTFOLIO_PAGE_INTRO, PORTFOLIO_PAGE_INTRO_LINKS } from "data/projects";

const pad = (index: number) => String(index + 1).padStart(2, "0");

export const PortfolioBand = () => (
  <Band aria-labelledby="portfolio-band-heading">
    <div className={styles.top}>
      <div className={styles.label}>
        <span className={styles.eyebrow}>{PORTFOLIO_BAND_EYEBROW}</span>
        <h2 id="portfolio-band-heading" className={styles.heading}>
          {PORTFOLIO_BAND_HEADING}
        </h2>
      </div>
      <BandChevrons count={9} layout="cell" reach={0.7} />
    </div>
    <div className={styles.body}>
      <div className={styles.intro}>
        {PORTFOLIO_PAGE_INTRO.map((paragraph, index) => (
          <PortfolioIntroParagraph
            key={paragraph}
            text={paragraph}
            links={PORTFOLIO_PAGE_INTRO_LINKS}
            className={index === 0 ? undefined : styles.small}
          />
        ))}
      </div>
      <StackWords>
        <figure className={styles.quote}>
          <blockquote>“{PORTFOLIO_QUOTE}”</blockquote>
          <figcaption className={styles.cite}>— {PORTFOLIO_QUOTE_CITE}</figcaption>
        </figure>
      </StackWords>
    </div>
    <section className={styles.look} aria-labelledby="portfolio-look-heading">
      <div className={styles.lookHead}>
        <h3 id="portfolio-look-heading">{PORTFOLIO_LOOK_FOR_HEADING}</h3>
        <p>{PORTFOLIO_LOOK_FOR_LEDE}</p>
      </div>
      <ul className={styles.pillars}>
        {PORTFOLIO_LOOK_FOR_CARDS.map((card, index) => (
          <li key={card.title} className={styles.pillar}>
            <span className={styles.eyebrow} aria-hidden="true">
              [ {pad(index)} ]
            </span>
            <h4>{card.title}</h4>
            <p>{card.body}</p>
          </li>
        ))}
      </ul>
    </section>
  </Band>
);
