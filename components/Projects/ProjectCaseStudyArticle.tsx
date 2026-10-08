"use client";

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
import {
  ARTICLE_BODY_TEXT,
  ARTICLE_SECTION,
  ARTICLE_SECTION_TITLE,
  ARTICLE_TOC_ASIDE,
  ARTICLE_TOC_GRID,
  CTA_PRIMARY,
  INLINE_LINK,
  LABEL_OVERLINE,
} from "utils/visual";

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

const Paragraph = ({ children }: { children: ReactNode }) => (
  <p className={`max-w-3xl ${ARTICLE_BODY_TEXT}`}>{children}</p>
);

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="max-w-3xl space-y-2.5">
    {items.map((item) => (
      <li key={item} className={`flex gap-3 ${ARTICLE_BODY_TEXT}`}>
        <span
          aria-hidden="true"
          className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-[var(--organic-orange)]"
        />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const RelatedItem = ({ children }: { children: ReactNode }) => (
  <li className={`flex gap-3 ${ARTICLE_BODY_TEXT}`}>
    <span
      aria-hidden="true"
      className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-[var(--organic-orange)]"
    />
    <span>{children}</span>
  </li>
);

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
        <div className="grid gap-4 lg:grid-cols-2">
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
              <div className="space-y-8">
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
        <ul className="max-w-3xl space-y-2.5">
          {project.relatedLinks.map((link) => (
            <RelatedItem key={link.href}>
              <ProjectLinkAnchor href={link.href} label={link.label} className={INLINE_LINK}>
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
                className={INLINE_LINK}
              >
                {PROJECT_SECTION_LINK_NEXT}: {nextProject.name}
              </Link>
            </RelatedItem>
          ) : null}
          <RelatedItem>
            <Link
              href={isDedicatedPage ? "/portfolio#case-studies" : "#case-studies"}
              className={INLINE_LINK}
            >
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
      className={
        isDedicatedPage
          ? undefined
          : "scroll-mt-28 border-t border-border py-16 first:border-t-0 first:pt-0 sm:py-20"
      }
      aria-labelledby={`${project.id}-heading`}
    >
      <header data-reveal className="mb-10 space-y-6">
        <div className="space-y-3">
          <p className={LABEL_OVERLINE}>{project.employerContext}</p>
          <TitleTag
            id={`${project.id}-heading`}
            className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {project.name}
          </TitleTag>
          <p className="text-xl font-medium leading-snug text-foreground/90">
            {project.caseStudyTitle}
          </p>
          <p className={`max-w-3xl ${ARTICLE_BODY_TEXT}`}>{caseStudy.overview}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm text-muted">
            <span>{project.role}</span>
            {project.timeframe ? <span>· {project.timeframe}</span> : null}
          </div>
          <ul className="flex flex-wrap gap-2" aria-label={`${project.name} capabilities`}>
            {project.capabilityTags.slice(0, 5).map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-sm text-foreground/85"
              >
                {tag}
              </li>
            ))}
          </ul>
          {project.liveLinks.length > 0 ? (
            <ul
              aria-label={projectLiveLinksAriaLabel(project.name)}
              className="flex flex-wrap gap-3 pt-2"
            >
              {project.liveLinks.map((link) => (
                <li key={link.href}>
                  <ProjectLinkAnchor href={link.href} label={link.label} className={CTA_PRIMARY}>
                    {link.label}
                  </ProjectLinkAnchor>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {isDedicatedPage && heroFigure ? (
          <div className="max-w-4xl">
            <ProjectFigure figure={heroFigure} />
          </div>
        ) : null}
      </header>

      <div className={ARTICLE_TOC_GRID}>
        <div className="min-w-0">
          <TableOfContentsDisclosure
            headings={headings}
            ariaLabel={tocLabel}
            className="mb-10 lg:hidden"
          />
          <div className="space-y-12">
            {sections.map((section) => {
              const id = caseStudySectionId(project.id, section.key);
              const diagrams =
                caseStudy.diagrams?.filter((diagram) => diagram.section === section.key) ?? [];
              return (
                <section
                  key={section.key}
                  data-reveal
                  id={id}
                  aria-labelledby={`${id}-title`}
                  className={`${ARTICLE_SECTION} space-y-4`}
                >
                  <h2 id={`${id}-title`} className={ARTICLE_SECTION_TITLE}>
                    {section.title}
                  </h2>
                  {section.body}
                  {diagrams.map((diagram) => (
                    <PostDiagram key={diagram.spec.title} spec={diagram.spec} />
                  ))}
                </section>
              );
            })}
          </div>
        </div>
        <aside className="hidden lg:block">
          <TableOfContents headings={headings} ariaLabel={tocLabel} className={ARTICLE_TOC_ASIDE} />
        </aside>
      </div>
    </article>
  );
};
