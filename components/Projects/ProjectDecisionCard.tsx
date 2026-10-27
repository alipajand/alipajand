import type { ProjectDecision } from "data/projects";
import {
  PROJECT_DECISION_LABEL,
  PROJECT_DECISION_RESULT_LABEL,
  PROJECT_DECISION_TRADE_OFF_LABEL,
  PROJECT_DECISION_WHY_LABEL,
} from "data/projectsUi";

export const ProjectDecisionCard = ({ decision }: { decision: ProjectDecision }) => {
  return (
    <article>
      <div>
        <div>
          <p>{PROJECT_DECISION_LABEL}</p>
          <p>{decision.decision}</p>
        </div>
        <div>
          <p>{PROJECT_DECISION_WHY_LABEL}</p>
          <p>{decision.why}</p>
        </div>
        <div>
          <p>{PROJECT_DECISION_TRADE_OFF_LABEL}</p>
          <p>{decision.tradeOff}</p>
        </div>
        <div>
          <p>{PROJECT_DECISION_RESULT_LABEL}</p>
          <p>{decision.result}</p>
        </div>
      </div>
    </article>
  );
};
