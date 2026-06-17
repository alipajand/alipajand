import { HiringFitGridItem } from "components/HiringFit/HiringFitGridItem";
import { useHiringFitReveal } from "components/HiringFit/hooks/useHiringFitReveal";
import { HIRING_FIT_CARDS, HIRING_FIT_HEADING } from "data/hiringFit";
import { SECTION_INNER, SECTION_SHELL, SECTION_TITLE } from "utils/visual";

export const HiringFit = () => {
  const {
    selectors: { sectionRef },
  } = useHiringFitReveal();

  return (
    <section
      id="hiring-fit"
      ref={sectionRef}
      aria-labelledby="hiring-fit-heading"
      className={SECTION_SHELL}
    >
      <div className={SECTION_INNER}>
        <h2 id="hiring-fit-heading" data-hiring-heading className={`${SECTION_TITLE} mb-4 sm:mb-5`}>
          {HIRING_FIT_HEADING}
        </h2>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 list-none p-0 m-0">
          {HIRING_FIT_CARDS.map((card) => (
            <HiringFitGridItem key={card.id} card={card} />
          ))}
        </ul>
      </div>
    </section>
  );
};
