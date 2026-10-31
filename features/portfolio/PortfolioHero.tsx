import { PlatesField } from "features/portfolio/PlatesField";
import styles from "features/portfolio/PortfolioHero.module.css";
import {
  PORTFOLIO_HERO_COORDINATES,
  PORTFOLIO_HERO_FOCUS,
  PORTFOLIO_HERO_ROLE,
  PORTFOLIO_HERO_STACK,
  PORTFOLIO_SCROLL_CUE,
} from "data/portfolioIndex";
import { PORTFOLIO_PAGE_HEADING, PORTFOLIO_PROFILE_DETAILS, PROJECTS } from "data/projects";

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
          {PORTFOLIO_PAGE_HEADING}
          <span aria-hidden="true"> ]</span>
        </h1>
        <span>{yearSpan()}</span>
      </div>
      <p className={styles.lede}>
        <b>{PORTFOLIO_HERO_ROLE}.</b> {PORTFOLIO_HERO_FOCUS}.
      </p>
      <p className={styles.meta}>
        <strong>{PORTFOLIO_HERO_STACK}</strong>
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
