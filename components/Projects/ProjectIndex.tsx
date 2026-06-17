"use client";

import { useMemo } from "react";

import { ProjectIndexItem } from "components/Projects/ProjectIndexItem";
import { PORTFOLIO_ADDITIONAL_EXPERIENCE_HEADING } from "data/projectsUi";
import { getDedicatedCaseStudyProjects, getIndexOnlyProjects } from "utils/projects";
import { SECTION_INNER_WIDE, SECTION_RULE, SECTION_X, SECTION_Y } from "utils/visual";

export const ProjectIndex = () => {
  const dedicatedProjects = useMemo(() => getDedicatedCaseStudyProjects(), []);
  const indexOnlyProjects = useMemo(() => getIndexOnlyProjects(), []);

  return (
    <>
      <section
        id="case-studies"
        aria-labelledby="case-studies-heading"
        className={`${SECTION_X} ${SECTION_Y} ${SECTION_RULE}`}
      >
        <div className={SECTION_INNER_WIDE}>
          <h2 id="case-studies-heading" className="sr-only">
            Case studies
          </h2>
          <div className="space-y-0">
            {dedicatedProjects.map((project, index) => (
              <ProjectIndexItem key={project.id} project={project} isFirst={index === 0} />
            ))}
          </div>
        </div>
      </section>

      {indexOnlyProjects.length > 0 ? (
        <section
          id="additional-experience"
          aria-labelledby="additional-experience-heading"
          className={`${SECTION_X} ${SECTION_Y} ${SECTION_RULE}`}
        >
          <div className={SECTION_INNER_WIDE}>
            <h2
              id="additional-experience-heading"
              className="mb-10 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              {PORTFOLIO_ADDITIONAL_EXPERIENCE_HEADING}
            </h2>
            <div className="space-y-0">
              {indexOnlyProjects.map((project, index) => (
                <ProjectIndexItem key={project.id} project={project} isFirst={index === 0} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};
