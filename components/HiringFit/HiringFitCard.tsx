import type { HiringFitCard as HiringFitCardModel } from "data/hiringFit";

interface HiringFitCardProps {
  card: HiringFitCardModel;
}

export const HiringFitCard = ({ card }: HiringFitCardProps) => {
  return (
    <article>
      <h3>{card.title}</h3>
      <p>{card.body}</p>
    </article>
  );
};
