"use client";

import { useMemo } from "react";

import { ProjectIndexItem } from "components/Projects/ProjectIndexItem";
import {
  TableOfContents,
  TableOfContentsDisclosure,
} from "components/TableOfContents/TableOfContents";
import {
  PORTFOLIO_ADDITIONAL_EXPERIENCE_HEADING,
  PORTFOLIO_ADDITIONAL_EXPERIENCE_LINK_HREF,
  PORTFOLIO_ADDITIONAL_EXPERIENCE_LINK_LABEL,
  PORTFOLIO_CASE_STUDIES_TOC_ARIA_LABEL,
} from "data/projectsUi";
import { EXTERNAL_LINK_NEW_TAB_HINT } from "data/pageChrome";
import { getDedicatedCaseStudyProjects, getIndexOnlyProjects } from "utils/projects";
import type { PostHeading } from "utils/headings";

export const ProjectIndex = () => {
  const dedicatedProjects = useMemo(() => getDedicatedCaseStudyProjects(), []);
  const indexOnlyProjects = useMemo(() => getIndexOnlyProjects(), []);
  const caseStudyHeadings = useMemo<PostHeading[]>(
    () =>
      dedicatedProjects.map((project) => ({
        id: `project-${project.id}`,
        text: project.name,
        level: 2,
      })),
    [dedicatedProjects]
  );

  return (
    <>
      <section id="case-studies" aria-labelledby="case-studies-heading">
        <div>
          <h2 id="case-studies-heading">Case studies</h2>
          <div>
            <div>
              <TableOfContentsDisclosure
                headings={caseStudyHeadings}
                ariaLabel={PORTFOLIO_CASE_STUDIES_TOC_ARIA_LABEL}
              />
              {dedicatedProjects.map((project) => (
                <ProjectIndexItem key={project.id} project={project} />
              ))}
            </div>
            <aside>
              <TableOfContents
                headings={caseStudyHeadings}
                ariaLabel={PORTFOLIO_CASE_STUDIES_TOC_ARIA_LABEL}
              />
            </aside>
          </div>
        </div>
      </section>

      {indexOnlyProjects.length > 0 ? (
        <section id="additional-experience" aria-labelledby="additional-experience-heading">
          <div>
            <h2 id="additional-experience-heading">{PORTFOLIO_ADDITIONAL_EXPERIENCE_HEADING}</h2>
            <div>
              {indexOnlyProjects.map((project) => (
                <ProjectIndexItem key={project.id} project={project} />
              ))}
            </div>
            <p>
              <a
                href={PORTFOLIO_ADDITIONAL_EXPERIENCE_LINK_HREF}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${PORTFOLIO_ADDITIONAL_EXPERIENCE_LINK_LABEL}${EXTERNAL_LINK_NEW_TAB_HINT}`}
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
