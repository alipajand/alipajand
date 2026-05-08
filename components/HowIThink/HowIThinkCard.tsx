import type { HowIThinkCard as HowIThinkCardModel } from "data/howIThink";
import { CARD_SURFACE_HOVER } from "utils/visual";

interface HowIThinkCardProps {
  card: HowIThinkCardModel;
}

export function HowIThinkCard({ card }: HowIThinkCardProps) {
  return (
    <article className={`${CARD_SURFACE_HOVER} p-5 sm:p-6 h-full`}>
      <h3 className="font-display font-semibold text-lg text-foreground">{card.title}</h3>
      <p className="mt-2 text-muted text-sm leading-relaxed">{card.body}</p>
    </article>
  );
}
