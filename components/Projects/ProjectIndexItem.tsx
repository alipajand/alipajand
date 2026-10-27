import Link from "next/link";

import { ProjectLinkAnchor } from "components/Projects/ProjectLinkAnchor";
import type { Project } from "data/projects";
import { projectReadCaseStudyLabel } from "data/projectsUi";

type ProjectIndexItemProps = {
  project: Project;
};

export const ProjectIndexItem = ({ project }: ProjectIndexItemProps) => {
  const tags = project.capabilityTags.slice(0, 3);
  const caseStudyHref = project.hasDedicatedCaseStudy ? `/portfolio/${project.slug}` : null;
  const links = [...project.liveLinks, ...project.relatedLinks];

  return (
    <article id={`project-${project.id}`}>
      <div>
        <p>{project.employerContext}</p>
        <h2>{caseStudyHref ? <Link href={caseStudyHref}>{project.name}</Link> : project.name}</h2>
        <p>
          {caseStudyHref ? (
            <Link href={caseStudyHref} tabIndex={-1}>
              {project.caseStudyTitle}
            </Link>
          ) : (
            project.caseStudyTitle
          )}
        </p>
        <p>{project.role}</p>
        <p>{project.cardProblem}</p>
        <ul aria-label={`${project.name} capabilities`}>
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        {caseStudyHref ? (
          <p>
            <Link href={caseStudyHref}>
              {projectReadCaseStudyLabel(project.name)}
              <span aria-hidden>→</span>
            </Link>
          </p>
        ) : null}
        {links.length > 0 ? (
          <ul aria-label={`${project.name} links`}>
            {links.map((link) => (
              <li key={link.href}>
                <ProjectLinkAnchor href={link.href} label={link.label}>
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
