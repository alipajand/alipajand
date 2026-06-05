"use client";

import { HowIThinkGridItem } from "components/HowIThink/HowIThinkGridItem";
import { useHowIThinkReveal } from "components/HowIThink/hooks/useHowIThinkReveal";
import { HOW_I_THINK_CARDS, HOW_I_THINK_HEADING, HOW_I_THINK_LEDE } from "data/howIThink";
import { SECTION_INNER, SECTION_LEDE_LG, SECTION_SHELL, SECTION_TITLE } from "utils/visual";

export function HowIThink() {
  const {
    selectors: { sectionRef },
  } = useHowIThinkReveal();

  return (
    <section
      id="how-i-think"
      ref={sectionRef}
      aria-labelledby="how-i-think-heading"
      className={SECTION_SHELL}
    >
      <div className={SECTION_INNER}>
        <h2
          id="how-i-think-heading"
          data-howitink-heading
          className={`${SECTION_TITLE} mb-4 sm:mb-5`}
        >
          {HOW_I_THINK_HEADING}
        </h2>
        <p data-howitink-lede className={`${SECTION_LEDE_LG} mb-10 sm:mb-12`}>
          {HOW_I_THINK_LEDE}
        </p>

        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 list-none p-0 m-0">
          {HOW_I_THINK_CARDS.map((card) => (
            <HowIThinkGridItem key={card.id} card={card} />
          ))}
        </ul>
      </div>
    </section>
  );
}
