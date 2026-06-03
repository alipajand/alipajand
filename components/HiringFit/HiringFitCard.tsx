import type { HiringFitCard as HiringFitCardModel } from "data/hiringFit";
import { CARD_SURFACE_HOVER } from "utils/visual";

interface HiringFitCardProps {
  card: HiringFitCardModel;
}

export function HiringFitCard({ card }: HiringFitCardProps) {
  return (
    <article className={`${CARD_SURFACE_HOVER} p-5 sm:p-6 h-full`}>
      <h3 className="font-display font-semibold text-lg text-foreground">{card.title}</h3>
      <p className="mt-2 text-muted text-sm leading-relaxed">{card.body}</p>
    </article>
  );
}
