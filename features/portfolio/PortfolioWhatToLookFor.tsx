import {
  PORTFOLIO_LOOK_FOR_CARDS,
  PORTFOLIO_LOOK_FOR_HEADING,
  PORTFOLIO_LOOK_FOR_LEDE,
} from "data/portfolioFit";

export function PortfolioWhatToLookFor() {
  return (
    <section aria-labelledby="portfolio-look-for-heading">
      <div>
        <h2 id="portfolio-look-for-heading">{PORTFOLIO_LOOK_FOR_HEADING}</h2>
        <p>{PORTFOLIO_LOOK_FOR_LEDE}</p>
        <div>
          {PORTFOLIO_LOOK_FOR_CARDS.map((card) => (
            <article key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
