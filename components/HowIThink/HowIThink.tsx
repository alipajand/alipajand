import {
  HOW_I_THINK_CARDS,
  HOW_I_THINK_HEADING,
  HOW_I_THINK_LEDE,
} from "data/howIThink";
import {
  CARD_SURFACE_HOVER,
  SECTION_INNER,
  SECTION_LEDE_LG,
  SECTION_SHELL,
  SECTION_TITLE,
} from "utils/visual";

export function HowIThink() {
  return (
    <section
      id="how-i-think"
      aria-labelledby="how-i-think-heading"
      className={SECTION_SHELL}
    >
      <div className={SECTION_INNER}>
        <h2 id="how-i-think-heading" className={`${SECTION_TITLE} mb-4 sm:mb-5`}>
          {HOW_I_THINK_HEADING}
        </h2>
        <p className={`${SECTION_LEDE_LG} mb-10 sm:mb-12`}>{HOW_I_THINK_LEDE}</p>

        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 list-none p-0 m-0">
          {HOW_I_THINK_CARDS.map((card) => (
            <li key={card.id}>
              <article className={`${CARD_SURFACE_HOVER} p-5 sm:p-6 h-full`}>
                <h3 className="font-display font-semibold text-lg text-foreground">
                  {card.title}
                </h3>
                <p className="mt-2 text-muted text-sm leading-relaxed">{card.body}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
