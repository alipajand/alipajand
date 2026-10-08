import Link from "next/link";

import { ProjectLinkAnchor } from "components/Projects/ProjectLinkAnchor";
import type { Project } from "data/projects";
import { projectReadCaseStudyLabel } from "data/projectsUi";
import { FOCUS_RING, INLINE_LINK, LABEL_OVERLINE } from "utils/visual";

type ProjectIndexItemProps = {
  project: Project;
  isFirst?: boolean;
};

export const ProjectIndexItem = ({ project, isFirst = false }: ProjectIndexItemProps) => {
  const tags = project.capabilityTags.slice(0, 3);
  const caseStudyHref = project.hasDedicatedCaseStudy ? `/portfolio/${project.slug}` : null;
  const links = [...project.liveLinks, ...project.relatedLinks];

  return (
    <article
      data-reveal
      id={`project-${project.id}`}
      className={`scroll-mt-24 border-t border-border py-12 sm:py-16 ${isFirst ? "border-t-0 pt-0" : ""}`}
    >
      <div className="max-w-3xl space-y-4">
        <p className={LABEL_OVERLINE}>{project.employerContext}</p>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {caseStudyHref ? (
            <Link
              href={caseStudyHref}
              className={`rounded-sm underline-offset-[6px] decoration-[var(--organic-orange)] hover:underline ${FOCUS_RING}`}
            >
              {project.name}
            </Link>
          ) : (
            project.name
          )}
        </h2>
        <p className="text-lg font-medium leading-snug text-foreground/90">
          {caseStudyHref ? (
            <Link
              href={caseStudyHref}
              tabIndex={-1}
              className="underline-offset-4 decoration-foreground/35 hover:underline"
            >
              {project.caseStudyTitle}
            </Link>
          ) : (
            project.caseStudyTitle
          )}
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
        {caseStudyHref ? (
          <p className="pt-2">
            <Link
              href={caseStudyHref}
              className={`inline-flex min-h-11 items-center gap-1.5 text-base font-medium ${INLINE_LINK}`}
            >
              {projectReadCaseStudyLabel(project.name)}
              <span aria-hidden>→</span>
            </Link>
          </p>
        ) : null}
        {links.length > 0 ? (
          <ul
            aria-label={`${project.name} links`}
            className="flex flex-wrap gap-x-5 gap-y-1 text-sm"
          >
            {links.map((link) => (
              <li key={link.href}>
                <ProjectLinkAnchor
                  href={link.href}
                  label={link.label}
                  className={`inline-flex min-h-11 items-center ${INLINE_LINK}`}
                >
                  {link.label}
                </ProjectLinkAnchor>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
};
