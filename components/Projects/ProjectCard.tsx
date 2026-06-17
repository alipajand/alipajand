"use client";

import Link from "next/link";

import { ProjectFigure } from "components/Projects/ProjectFigure";
import type { Project } from "data/projects";
import { PROJECT_CARD_CAPABILITIES_LABEL, PROJECT_CARD_READ_CASE_STUDY } from "data/projectsUi";
import { CARD_SURFACE_HOVER, FOCUS_RING, LABEL_OVERLINE } from "utils/visual";

export const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <article
      className={`${CARD_SURFACE_HOVER} flex h-full flex-col overflow-hidden rounded-2xl`}
      data-project-card
    >
      {project.caseStudy.interfaceEvidence?.length ? (
        <div className="border-b border-border/70 bg-background/60 p-4 sm:p-5">
          <ProjectFigure figure={project.caseStudy.interfaceEvidence[0]} compact />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="space-y-2.5">
          <p className={LABEL_OVERLINE}>{project.employerContext}</p>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            {project.name}
          </h3>
          <p className="text-sm font-medium text-foreground/85">{project.role}</p>
          <p className="text-[15px] leading-relaxed text-muted">{project.cardProblem}</p>
        </div>

        <div className="mt-auto space-y-4">
          <div>
            <p className={`${LABEL_OVERLINE} mb-2`}>{PROJECT_CARD_CAPABILITIES_LABEL}</p>
            <ul className="flex flex-wrap gap-2">
              {project.capabilityTags.slice(0, 3).map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-sm text-foreground/85"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <Link
            href={`#project-${project.id}`}
            className={`inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-background/70 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/35 hover:bg-card/70 ${FOCUS_RING}`}
          >
            {PROJECT_CARD_READ_CASE_STUDY}
          </Link>
        </div>
      </div>
    </article>
  );
};
