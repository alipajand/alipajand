import { CaseSection } from "components/hairline/CaseSection/CaseSection";
import styles from "features/portfolio/CaseStudyEngineering.module.css";
import { CaseStudySectionDiagrams } from "features/portfolio/CaseStudySectionDiagrams";
import type { CaseSectionModel } from "utils/caseStudySections";

interface CaseStudyEngineeringProps {
  section: CaseSectionModel & { body: Extract<CaseSectionModel["body"], { kind: "engineering" }> };
  index: number;
}

const pad = (index: number) => String(index + 1).padStart(2, "0");

export const CaseStudyEngineering = ({ section, index }: CaseStudyEngineeringProps) => (
  <CaseSection id={section.id} legacyId={section.legacyId} index={index} title={section.title}>
    <div>
      <ol className={styles.areas}>
        {section.body.areas.map((area, position) => (
          <li key={area.title} className={styles.area}>
            <h3 className={styles.title}>
              <span className={styles.number} aria-hidden="true">
                {pad(position)}
              </span>
              {area.title}
            </h3>
            <dl className={styles.points}>
              {area.points.map((point) => (
                <div key={point.label}>
                  <dt>{point.label}</dt>
                  <dd>{point.text}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ol>
    </div>
    <CaseStudySectionDiagrams diagrams={section.diagrams} />
  </CaseSection>
);
