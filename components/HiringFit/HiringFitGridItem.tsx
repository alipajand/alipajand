import { HiringFitCard } from "components/HiringFit/HiringFitCard";
import type { HiringFitCard as HiringFitCardModel } from "data/hiringFit";

interface HiringFitGridItemProps {
  card: HiringFitCardModel;
}

export function HiringFitGridItem({ card }: HiringFitGridItemProps) {
  return (
    <li>
      <HiringFitCard card={card} />
    </li>
  );
}
