"use client";

import { useMemo } from "react";

import { ProjectIndexItem } from "components/Projects/ProjectIndexItem";
import {
  PORTFOLIO_ADDITIONAL_EXPERIENCE_HEADING,
  PORTFOLIO_ADDITIONAL_EXPERIENCE_LINK_HREF,
  PORTFOLIO_ADDITIONAL_EXPERIENCE_LINK_LABEL,
} from "data/projectsUi";
import { EXTERNAL_LINK_NEW_TAB_HINT } from "data/pageChrome";
import { getDedicatedCaseStudyProjects, getIndexOnlyProjects } from "utils/projects";
import { FOCUS_RING, SECTION_INNER_WIDE, SECTION_RULE, SECTION_X, SECTION_Y } from "utils/visual";

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
            <p className="pt-8">
              <a
                href={PORTFOLIO_ADDITIONAL_EXPERIENCE_LINK_HREF}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${PORTFOLIO_ADDITIONAL_EXPERIENCE_LINK_LABEL}${EXTERNAL_LINK_NEW_TAB_HINT}`}
                className={`inline-flex min-h-11 items-center text-xl font-medium text-orange-200 underline-offset-4 hover:underline ${FOCUS_RING} rounded-sm`}
              >
                {PORTFOLIO_ADDITIONAL_EXPERIENCE_LINK_LABEL}...
              </a>
            </p>
          </div>
        </section>
      ) : null}
    </>
  );
};
