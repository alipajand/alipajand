import { HowIThinkCard } from "components/HowIThink/HowIThinkCard";
import type { HowIThinkCard as HowIThinkCardModel } from "data/howIThink";

interface HowIThinkGridItemProps {
  card: HowIThinkCardModel;
}

export function HowIThinkGridItem({ card }: HowIThinkGridItemProps) {
  return (
    <li data-howitink-card>
      <HowIThinkCard card={card} />
    </li>
  );
}
