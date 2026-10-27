import { HiringFitGridItem } from "components/HiringFit/HiringFitGridItem";
import { HIRING_FIT_CARDS, HIRING_FIT_HEADING } from "data/hiringFit";

export const HiringFit = () => {
  return (
    <section id="hiring-fit" aria-labelledby="hiring-fit-heading">
      <div>
        <h2 id="hiring-fit-heading">{HIRING_FIT_HEADING}</h2>

        <ul>
          {HIRING_FIT_CARDS.map((card) => (
            <HiringFitGridItem key={card.id} card={card} />
          ))}
        </ul>
      </div>
    </section>
  );
};
