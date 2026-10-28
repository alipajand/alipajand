import { Fragment } from "react";

import { ChapterRail } from "components/hairline/ChapterRail/ChapterRail";
import { FlowBand } from "components/hairline/FlowBand/FlowBand";
import { CaseStudyCrumbs } from "features/portfolio/CaseStudyCrumbs";
import { CaseStudyDecisions } from "features/portfolio/CaseStudyDecisions";
import { CaseStudyDisplayName } from "features/portfolio/CaseStudyDisplayName";
import { CaseStudyEvidence } from "features/portfolio/CaseStudyEvidence";
import { CaseStudyIntro } from "features/portfolio/CaseStudyIntro";
import { CaseStudyOutcome } from "features/portfolio/CaseStudyOutcome";
import { CaseStudyPager } from "features/portfolio/CaseStudyPager";
import { CaseStudyRelated } from "features/portfolio/CaseStudyRelated";
import { CaseStudyTextSection } from "features/portfolio/CaseStudyTextSection";
import type { Project } from "data/projects";
import {
  projectCaseStudyTocAriaLabel,
  projectFlowBandLabel,
  projectFlowEyebrow,
} from "data/projectsUi";
import { buildCaseSections, type CaseSectionModel } from "utils/caseStudySections";

type ProjectCaseStudyPageContentProps = {
  project: Project;
  nextProject?: Project;
};

const CaseStudySection = ({
  project,
  section,
  index,
}: {
  project: Project;
  section: CaseSectionModel;
  index: number;
}) => {
  const { body } = section;
  switch (body.kind) {
    case "lead":
    case "items":
      return <CaseStudyTextSection section={{ ...section, body }} index={index} />;
    case "decisions":
      return <CaseStudyDecisions section={{ ...section, body }} index={index} />;
    case "evidence":
      return <CaseStudyEvidence project={project} section={{ ...section, body }} index={index} />;
    case "outcome":
      return <CaseStudyOutcome section={{ ...section, body }} index={index} />;
    case "related":
      return (
        <CaseStudyRelated projectName={project.name} section={{ ...section, body }} index={index} />
      );
  }
};

export const ProjectCaseStudyPageContent = ({
  project,
  nextProject,
}: ProjectCaseStudyPageContentProps) => {
  const sections = buildCaseSections(project);
  return (
    <main id="main-content" tabIndex={-1}>
      <CaseStudyCrumbs name={project.name} />
      <CaseStudyDisplayName project={project} />
      <CaseStudyIntro project={project} />
      <ChapterRail
        label={projectCaseStudyTocAriaLabel(project.name)}
        chapters={sections.map(({ id, title }) => ({ id, label: title }))}
      />
      {sections.map((section, index) => (
        <Fragment key={section.id}>
          <CaseStudySection project={project} section={section} index={index} />
          {section.flow ? (
            <FlowBand
              chapterId={section.id}
              label={projectFlowBandLabel(section.title)}
              eyebrow={projectFlowEyebrow(section.title)}
              title={section.flow.title}
              steps={section.flow.steps}
              loop={section.flow.loop}
              caption={section.flow.caption}
            />
          ) : null}
        </Fragment>
      ))}
      <CaseStudyPager nextProject={nextProject} />
    </main>
  );
};
