"use client";

import type { ProjectDecision } from "data/projects";
import {
  PROJECT_DECISION_LABEL,
  PROJECT_DECISION_RESULT_LABEL,
  PROJECT_DECISION_TRADE_OFF_LABEL,
  PROJECT_DECISION_WHY_LABEL,
} from "data/projectsUi";
import { CARD_SURFACE, LABEL_OVERLINE } from "utils/visual";

export const ProjectDecisionCard = ({ decision }: { decision: ProjectDecision }) => {
  return (
    <article className={`${CARD_SURFACE} p-5 sm:p-6`}>
      <div className="space-y-4">
        <div>
          <p className={LABEL_OVERLINE}>{PROJECT_DECISION_LABEL}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-foreground">{decision.decision}</p>
        </div>
        <div>
          <p className={LABEL_OVERLINE}>{PROJECT_DECISION_WHY_LABEL}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{decision.why}</p>
        </div>
        <div>
          <p className={LABEL_OVERLINE}>{PROJECT_DECISION_TRADE_OFF_LABEL}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{decision.tradeOff}</p>
        </div>
        <div>
          <p className={LABEL_OVERLINE}>{PROJECT_DECISION_RESULT_LABEL}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{decision.result}</p>
        </div>
      </div>
    </article>
  );
};
