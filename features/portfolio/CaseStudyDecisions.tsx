import { CaseSection } from "components/hairline/CaseSection/CaseSection";
import { DecisionCard } from "components/hairline/DecisionCard/DecisionCard";
import styles from "features/portfolio/CaseStudyDecisions.module.css";
import { CaseStudySectionDiagrams } from "features/portfolio/CaseStudySectionDiagrams";
import {
  PROJECT_DECISION_LABEL,
  PROJECT_DECISION_RESULT_LABEL,
  PROJECT_DECISION_TRADE_OFF_LABEL,
  PROJECT_DECISION_WHY_LABEL,
} from "data/projectsUi";
import type { CaseSectionModel } from "utils/caseStudySections";

const LABELS = {
  decision: PROJECT_DECISION_LABEL,
  why: PROJECT_DECISION_WHY_LABEL,
  tradeOff: PROJECT_DECISION_TRADE_OFF_LABEL,
  result: PROJECT_DECISION_RESULT_LABEL,
};

interface CaseStudyDecisionsProps {
  section: CaseSectionModel & { body: Extract<CaseSectionModel["body"], { kind: "decisions" }> };
  index: number;
}

/** Technical decisions: each call with its reasoning, trade-off and result. */
export const CaseStudyDecisions = ({ section, index }: CaseStudyDecisionsProps) => (
  <CaseSection id={section.id} index={index} title={section.title}>
    <div className={styles.decisions}>
      {section.body.decisions.map((decision, position) => (
        <DecisionCard key={decision.decision} index={position} labels={LABELS} {...decision} />
      ))}
    </div>
    <CaseStudySectionDiagrams diagrams={section.diagrams} />
  </CaseSection>
);
