"use client";

import type { ProjectDecision } from "data/projects";
import { CARD_SURFACE, LABEL_OVERLINE } from "utils/visual";

export function ProjectDecisionCard({ decision }: { decision: ProjectDecision }) {
  return (
    <article className={`${CARD_SURFACE} p-5 sm:p-6`}>
      <div className="space-y-4">
        <div>
          <p className={LABEL_OVERLINE}>Decision</p>
          <p className="mt-2 text-[15px] leading-relaxed text-foreground">{decision.decision}</p>
        </div>
        <div>
          <p className={LABEL_OVERLINE}>Why</p>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{decision.why}</p>
        </div>
        <div>
          <p className={LABEL_OVERLINE}>Trade-off</p>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{decision.tradeOff}</p>
        </div>
        <div>
          <p className={LABEL_OVERLINE}>Result</p>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{decision.result}</p>
        </div>
      </div>
    </article>
  );
}
