import type { ReactNode } from "react";
import Link from "next/link";

import { PostDiagram } from "components/diagrams/PostDiagram";
import { ProjectDecisionCard } from "components/Projects/ProjectDecisionCard";
import { ProjectFigure } from "components/Projects/ProjectFigure";
import { ProjectLinkAnchor } from "components/Projects/ProjectLinkAnchor";
import {
  TableOfContents,
  TableOfContentsDisclosure,
} from "components/TableOfContents/TableOfContents";
import type { CaseStudySectionKey, Project } from "data/projects";
import {
  PROJECT_CASE_STUDY_SECTION_CONTEXT,
  PROJECT_CASE_STUDY_SECTION_EVIDENCE,
  PROJECT_CASE_STUDY_SECTION_IMPROVE,
  PROJECT_CASE_STUDY_SECTION_OUTCOME,
  PROJECT_CASE_STUDY_SECTION_PROBLEM,
  PROJECT_CASE_STUDY_SECTION_TECHNICAL_DECISIONS,
  PROJECT_CASE_STUDY_SECTION_UX_DECISIONS,
  PROJECT_CASE_STUDY_SECTION_WHAT_I_BUILT,
  PROJECT_MY_ROLE_HEADING,
  PROJECT_SECTION_LINK_BACK,
  PROJECT_SECTION_LINK_NEXT,
  PROJECT_SECTION_RELATED_HEADING,
  projectCaseStudyTocAriaLabel,
  projectLiveLinksAriaLabel,
} from "data/projectsUi";
import type { PostHeading } from "utils/headings";

type ProjectCaseStudyArticleProps = {
  project: Project;
  nextProject?: Project;
  isDedicatedPage?: boolean;
};

type SectionKey = CaseStudySectionKey | "related";

interface CaseStudySection {
  key: SectionKey;
  title: string;
  body: ReactNode;
}

const Paragraph = ({ children }: { children: ReactNode }) => <p>{children}</p>;

const BulletList = ({ items }: { items: string[] }) => (
  <ul>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const RelatedItem = ({ children }: { children: ReactNode }) => <li>{children}</li>;

export const caseStudySectionId = (projectId: string, key: SectionKey): string =>
  `${projectId}-${key}`;

export const ProjectCaseStudyArticle = ({
  project,
  nextProject,
  isDedicatedPage = false,
}: ProjectCaseStudyArticleProps) => {
  const { caseStudy } = project;
  const heroFigure = caseStudy.interfaceEvidence?.[0];
  const evidenceFigures =
    caseStudy.interfaceEvidence?.slice(isDedicatedPage && heroFigure ? 1 : 0) ?? [];
  const TitleTag = isDedicatedPage ? "h1" : "h2";

  const sections: CaseStudySection[] = [
    {
      key: "context",
      title: PROJECT_CASE_STUDY_SECTION_CONTEXT,
      body: <Paragraph>{caseStudy.context}</Paragraph>,
    },
    {
      key: "problem",
      title: PROJECT_CASE_STUDY_SECTION_PROBLEM,
      body: <Paragraph>{caseStudy.problem}</Paragraph>,
    },
    { key: "role", title: PROJECT_MY_ROLE_HEADING, body: <BulletList items={caseStudy.myRole} /> },
    {
      key: "built",
      title: PROJECT_CASE_STUDY_SECTION_WHAT_I_BUILT,
      body: <BulletList items={caseStudy.whatIBuilt} />,
    },
    {
      key: "technical-decisions",
      title: PROJECT_CASE_STUDY_SECTION_TECHNICAL_DECISIONS,
      body: (
        <div>
          {caseStudy.technicalDecisions.map((decision) => (
            <ProjectDecisionCard key={decision.decision} decision={decision} />
          ))}
        </div>
      ),
    },
    {
      key: "ux-decisions",
      title: PROJECT_CASE_STUDY_SECTION_UX_DECISIONS,
      body: <BulletList items={caseStudy.uxDecisions} />,
    },
    ...(evidenceFigures.length
      ? [
          {
            key: "evidence" as const,
            title: PROJECT_CASE_STUDY_SECTION_EVIDENCE,
            body: (
              <div>
                {evidenceFigures.map((figure) => (
                  <ProjectFigure key={`${figure.alt}-${figure.captionLead}`} figure={figure} />
                ))}
              </div>
            ),
          },
        ]
      : []),
    {
      key: "outcome",
      title: PROJECT_CASE_STUDY_SECTION_OUTCOME,
      body: <BulletList items={caseStudy.outcome} />,
    },
    {
      key: "improve",
      title: PROJECT_CASE_STUDY_SECTION_IMPROVE,
      body: <BulletList items={caseStudy.nextImprovements} />,
    },
    {
      key: "related",
      title: PROJECT_SECTION_RELATED_HEADING,
      body: (
        <ul>
          {project.relatedLinks.map((link) => (
            <RelatedItem key={link.href}>
              <ProjectLinkAnchor href={link.href} label={link.label}>
                {link.label}
              </ProjectLinkAnchor>
            </RelatedItem>
          ))}
          {nextProject ? (
            <RelatedItem>
              <Link
                href={
                  isDedicatedPage ? `/portfolio/${nextProject.slug}` : `#project-${nextProject.id}`
                }
              >
                {PROJECT_SECTION_LINK_NEXT}: {nextProject.name}
              </Link>
            </RelatedItem>
          ) : null}
          <RelatedItem>
            <Link href={isDedicatedPage ? "/portfolio#case-studies" : "#case-studies"}>
              {PROJECT_SECTION_LINK_BACK}
            </Link>
          </RelatedItem>
        </ul>
      ),
    },
  ];

  const headings: PostHeading[] = sections.map((section) => ({
    id: caseStudySectionId(project.id, section.key),
    text: section.title,
    level: 2,
  }));
  const tocLabel = projectCaseStudyTocAriaLabel(project.name);

  return (
    <article
      {...(isDedicatedPage ? {} : { id: `project-${project.id}` })}
      aria-labelledby={`${project.id}-heading`}
    >
      <header>
        <div>
          <p>{project.employerContext}</p>
          <TitleTag id={`${project.id}-heading`}>{project.name}</TitleTag>
          <p>{project.caseStudyTitle}</p>
          <p>{caseStudy.overview}</p>
          <div>
            <span>{project.role}</span>
            {project.timeframe ? <span>· {project.timeframe}</span> : null}
          </div>
          <ul aria-label={`${project.name} capabilities`}>
            {project.capabilityTags.slice(0, 5).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          {project.liveLinks.length > 0 ? (
            <ul aria-label={projectLiveLinksAriaLabel(project.name)}>
              {project.liveLinks.map((link) => (
                <li key={link.href}>
                  <ProjectLinkAnchor href={link.href} label={link.label}>
                    {link.label}
                  </ProjectLinkAnchor>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {isDedicatedPage && heroFigure ? (
          <div>
            <ProjectFigure figure={heroFigure} />
          </div>
        ) : null}
      </header>

      <div>
        <div>
          <TableOfContentsDisclosure headings={headings} ariaLabel={tocLabel} />
          <div>
            {sections.map((section) => {
              const id = caseStudySectionId(project.id, section.key);
              const diagrams =
                caseStudy.diagrams?.filter((diagram) => diagram.section === section.key) ?? [];
              return (
                <section key={section.key} id={id} aria-labelledby={`${id}-title`}>
                  <h2 id={`${id}-title`}>{section.title}</h2>
                  {section.body}
                  {diagrams.map((diagram) => (
                    <PostDiagram key={diagram.spec.title} spec={diagram.spec} />
                  ))}
                </section>
              );
            })}
          </div>
        </div>
        <aside>
          <TableOfContents headings={headings} ariaLabel={tocLabel} />
        </aside>
      </div>
    </article>
  );
};
