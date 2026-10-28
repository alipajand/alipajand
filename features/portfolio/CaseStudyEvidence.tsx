import { CaseSection } from "components/hairline/CaseSection/CaseSection";
import { ReviewSample } from "components/hairline/ReviewSample/ReviewSample";
import { ScreenshotFrame } from "components/hairline/ScreenshotFrame/ScreenshotFrame";
import styles from "features/portfolio/CaseStudyEvidence.module.css";
import { CaseStudySectionDiagrams } from "features/portfolio/CaseStudySectionDiagrams";
import type { Project } from "data/projects";
import { PROJECT_FIGURE_CLOSE_LABEL, PROJECT_FIGURE_ENLARGE_LABEL } from "data/projectsUi";
import { type CaseSectionModel, figureHost } from "utils/caseStudySections";

interface CaseStudyEvidenceProps {
  project: Project;
  section: CaseSectionModel & { body: Extract<CaseSectionModel["body"], { kind: "evidence" }> };
  index: number;
}

/**
 * Interface evidence: the interactive sample when the project has one, then every screenshot after
 * the hero, each in its own ruled row.
 */
export const CaseStudyEvidence = ({ project, section, index }: CaseStudyEvidenceProps) => (
  <CaseSection id={section.id} legacyId={section.legacyId} index={index} title={section.title}>
    <div className={styles.evidence}>
      {section.body.sample ? <ReviewSample {...section.body.sample} /> : null}
      {section.body.figures.map((figure) =>
        figure.src ? (
          <ScreenshotFrame
            key={figure.src}
            src={figure.src}
            alt={figure.alt}
            width={figure.width}
            height={figure.height}
            trimTop={figure.trimTop}
            captionLead={figure.captionLead}
            captionBody={figure.captionBody}
            provenance={figure.provenance}
            host={figureHost(project, figure)}
            layout={figure.layout}
            sizes={
              figure.layout === "side"
                ? "(max-width: 960px) 100vw, 42vw"
                : "(max-width: 760px) 100vw, 64vw"
            }
            enlargeLabel={PROJECT_FIGURE_ENLARGE_LABEL}
            closeLabel={PROJECT_FIGURE_CLOSE_LABEL}
          />
        ) : null
      )}
    </div>
    <CaseStudySectionDiagrams diagrams={section.diagrams} />
  </CaseSection>
);
