import Link from "next/link";

import type { Project } from "data/projects";
import { PROJECT_CARD_READ_CASE_STUDY } from "data/projectsUi";
import { FOCUS_RING, LABEL_OVERLINE } from "utils/visual";

type ProjectIndexItemProps = {
  project: Project;
  isFirst?: boolean;
};

export const ProjectIndexItem = ({ project, isFirst = false }: ProjectIndexItemProps) => {
  const tags = project.capabilityTags.slice(0, 3);

  return (
    <article
      id={`project-${project.id}`}
      className={`border-t border-border py-12 sm:py-16 ${isFirst ? "border-t-0 pt-0" : ""}`}
    >
      <div className="max-w-3xl space-y-4">
        <p className={LABEL_OVERLINE}>{project.employerContext}</p>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {project.name}
        </h2>
        <p className="text-lg font-medium leading-snug text-foreground/90">
          {project.caseStudyTitle}
        </p>
        <p className="text-sm text-muted">{project.role}</p>
        <p className="text-[15px] leading-relaxed text-muted">{project.cardProblem}</p>
        <ul className="flex flex-wrap gap-2" aria-label={`${project.name} capabilities`}>
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-sm text-foreground/85"
            >
              {tag}
            </li>
          ))}
        </ul>
        {project.hasDedicatedCaseStudy ? (
          <p className="pt-2">
            <Link
              href={`/portfolio/${project.slug}`}
              className={`inline-flex min-h-11 items-center text-sm font-medium text-foreground underline-offset-4 hover:underline ${FOCUS_RING} rounded-sm`}
            >
              {PROJECT_CARD_READ_CASE_STUDY}
            </Link>
          </p>
        ) : null}
      </div>
    </article>
  );
};
