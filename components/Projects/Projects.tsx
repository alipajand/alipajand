"use client";

import Link from "next/link";

import { ProjectCard } from "components/Projects/ProjectCard";
import { ProjectCaseStudyArticle } from "components/Projects/ProjectCaseStudyArticle";
import { useProjectsReveal } from "components/Projects/hooks/useProjectsReveal";
import {
  PORTFOLIO_CASE_STUDIES_HEADING,
  PORTFOLIO_CASE_STUDIES_LEDE,
  PORTFOLIO_OPEN_SOURCE_CALLOUT_BODY,
  PORTFOLIO_OPEN_SOURCE_CALLOUT_CTA,
  PORTFOLIO_OPEN_SOURCE_CALLOUT_HEADING,
  PORTFOLIO_OTHER_WORK_HEADING,
} from "data/projects";
import { PROJECT_COLLECTION_ARIA_LABEL } from "data/projectsUi";
import {
  CARD_SURFACE,
  CTA_SECONDARY,
  SECTION_INNER_WIDE,
  SECTION_RULE,
  SECTION_TITLE,
  SECTION_X,
  SECTION_Y,
} from "utils/visual";

export function Projects() {
  const {
    selectors: { sectionRef, orderedProjects, primaryProjects, secondaryProjects },
  } = useProjectsReveal();

  return (
    <section
      id="case-studies"
      ref={sectionRef}
      aria-labelledby="projects-heading"
      className={`${SECTION_X} ${SECTION_Y} ${SECTION_RULE}`}
    >
      <div className={SECTION_INNER_WIDE}>
        <div className="space-y-4">
          <h2 id="projects-heading" className={SECTION_TITLE} data-reveal>
            {PORTFOLIO_CASE_STUDIES_HEADING}
          </h2>
          <p className="max-w-4xl text-base leading-relaxed text-muted" data-reveal>
            {PORTFOLIO_CASE_STUDIES_LEDE}
          </p>
        </div>

        <div className="mt-10 space-y-8">
          <div
            className="grid gap-5 lg:grid-cols-2"
            aria-label={PROJECT_COLLECTION_ARIA_LABEL}
            data-reveal
          >
            {primaryProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {secondaryProjects.length > 0 ? (
            <div className="space-y-5" data-reveal>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                {PORTFOLIO_OTHER_WORK_HEADING}
              </h3>
              <div className="grid gap-5 lg:grid-cols-2">
                {secondaryProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <aside className={`${CARD_SURFACE} mt-10 p-5 sm:p-6`} data-reveal>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            {PORTFOLIO_OPEN_SOURCE_CALLOUT_HEADING}
          </h3>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted">
            {PORTFOLIO_OPEN_SOURCE_CALLOUT_BODY}
          </p>
          <div className="mt-5">
            <Link href="/open-source" className={CTA_SECONDARY}>
              {PORTFOLIO_OPEN_SOURCE_CALLOUT_CTA}
            </Link>
          </div>
        </aside>

        <div className="mt-14 space-y-0">
          {orderedProjects.map((project, index) => (
            <ProjectCaseStudyArticle
              key={project.id}
              project={project}
              nextProject={orderedProjects[index + 1]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
