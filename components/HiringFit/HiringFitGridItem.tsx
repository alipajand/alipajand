import { HiringFitCard } from "components/HiringFit/HiringFitCard";
import type { HiringFitCard as HiringFitCardModel } from "data/hiringFit";

interface HiringFitGridItemProps {
  card: HiringFitCardModel;
}

export const HiringFitGridItem = ({ card }: HiringFitGridItemProps) => {
  return (
    <li data-hiring-card>
      <HiringFitCard card={card} />
    </li>
  );
};
