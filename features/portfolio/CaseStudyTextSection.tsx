import { CaseItems, CaseLead, CaseSection } from "components/hairline/CaseSection/CaseSection";
import { CaseStudySectionDiagrams } from "features/portfolio/CaseStudySectionDiagrams";
import type { CaseSectionModel } from "utils/caseStudySections";

interface CaseStudyTextSectionProps {
  section: CaseSectionModel & {
    body: Extract<CaseSectionModel["body"], { kind: "lead" | "items" }>;
  };
  index: number;
}

/**
 * Context, Problem, My role, What I built, UX decisions and What I would improve: a lead paragraph
 * or numbered points (rows, or cells for "What I built"), then any diagrams the data attaches.
 */
export const CaseStudyTextSection = ({ section, index }: CaseStudyTextSectionProps) => (
  <CaseSection id={section.id} index={index} title={section.title}>
    {section.body.kind === "lead" ? (
      <CaseLead>{section.body.text}</CaseLead>
    ) : (
      <CaseItems items={section.body.items} layout={section.body.layout} />
    )}
    <CaseStudySectionDiagrams diagrams={section.diagrams} />
  </CaseSection>
);
