import { PlatesField } from "features/portfolio/PlatesField";
import styles from "features/portfolio/PortfolioHero.module.css";
import { PORTFOLIO_HERO_COORDINATES, PORTFOLIO_SCROLL_CUE } from "data/portfolioIndex";
import { PORTFOLIO_PAGE_HEADER_TITLE, PORTFOLIO_PROFILE_DETAILS, PROJECTS } from "data/projects";
import { TAGLINE } from "data/site";

/** "Senior Software Engineer · Frontend … · React, TypeScript, …" → its three parts. */
const [ROLE, FOCUS, STACK] = TAGLINE.split(" · ");

/** First year any case study starts and the current year, from the project timeframes. */
const yearSpan = (now = new Date()) => {
  const years = PROJECTS.flatMap((project) => project.timeframe?.match(/\d{4}/g) ?? []).map(Number);
  return `${Math.min(...years)} — ${now.getFullYear()}`;
};

export const PortfolioHero = () => (
  <section className={styles.hero} aria-labelledby="portfolio-heading">
    <PlatesField />
    <div className={styles.copy} data-hero-copy>
      <div className={styles.eyebrow}>
        <h1 id="portfolio-heading" className={styles.title}>
          <span aria-hidden="true">[ </span>
          {PORTFOLIO_PAGE_HEADER_TITLE}
          <span aria-hidden="true"> ]</span>
        </h1>
        <span>{yearSpan()}</span>
      </div>
      <p className={styles.lede}>
        <b>{ROLE}.</b> {FOCUS}.
      </p>
      <p className={styles.meta}>
        <strong>{STACK.replaceAll(", ", " · ")}</strong>
        <span>{PORTFOLIO_PROFILE_DETAILS}</span>
      </p>
    </div>
    <div className={styles.coords} aria-hidden="true">
      {PORTFOLIO_HERO_COORDINATES.map((coordinate) => (
        <span key={coordinate}>{coordinate}</span>
      ))}
    </div>
    <div className={styles.cue} aria-hidden="true">
      <i />
      {PORTFOLIO_SCROLL_CUE}
    </div>
  </section>
);
