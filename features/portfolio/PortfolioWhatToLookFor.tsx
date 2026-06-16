import {
  PORTFOLIO_LOOK_FOR_CARDS,
  PORTFOLIO_LOOK_FOR_HEADING,
  PORTFOLIO_LOOK_FOR_LEDE,
} from "data/portfolioFit";
import { CARD_SURFACE, SECTION_INNER_WIDE, SECTION_RULE, SECTION_X } from "utils/visual";

export function PortfolioWhatToLookFor() {
  return (
    <section
      aria-labelledby="portfolio-look-for-heading"
      className={`${SECTION_X} border-b border-border ${SECTION_RULE} py-14 sm:py-16`}
    >
      <div className={SECTION_INNER_WIDE}>
        <h2
          id="portfolio-look-for-heading"
          className="font-display font-bold tracking-tight text-3xl sm:text-4xl text-foreground"
        >
          {PORTFOLIO_LOOK_FOR_HEADING}
        </h2>
        <p className="mt-4 max-w-4xl text-muted text-[15px] sm:text-base leading-relaxed">
          {PORTFOLIO_LOOK_FOR_LEDE}
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {PORTFOLIO_LOOK_FOR_CARDS.map((card) => (
            <article key={card.title} className={`${CARD_SURFACE} p-5 sm:p-6`}>
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                {card.title}
              </h3>
              <p className="mt-3 text-muted text-[15px] leading-relaxed">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
