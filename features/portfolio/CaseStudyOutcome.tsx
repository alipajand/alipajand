import { CaseSection } from "components/hairline/CaseSection/CaseSection";
import styles from "features/portfolio/CaseStudyOutcome.module.css";
import { CaseStudySectionDiagrams } from "features/portfolio/CaseStudySectionDiagrams";
import type { CaseSectionModel } from "utils/caseStudySections";

interface CaseStudyOutcomeProps {
  section: CaseSectionModel & { body: Extract<CaseSectionModel["body"], { kind: "outcome" }> };
  index: number;
}

const pad = (index: number) => String(index + 1).padStart(2, "0");

/** Outcome: the results as large numbered statements. */
export const CaseStudyOutcome = ({ section, index }: CaseStudyOutcomeProps) => (
  <CaseSection id={section.id} index={index} title={section.title}>
    <div>
      <ol className={styles.outcome}>
        {section.body.items.map((item, position) => (
          <li key={item}>
            <span className={styles.number} aria-hidden="true">
              {pad(position)}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </div>
    <CaseStudySectionDiagrams diagrams={section.diagrams} />
  </CaseSection>
);
