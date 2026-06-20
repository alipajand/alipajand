"use client";

import Link from "next/link";

import { ProjectDecisionCard } from "components/Projects/ProjectDecisionCard";
import { ProjectFigure } from "components/Projects/ProjectFigure";
import type { Project } from "data/projects";
import {
  PROJECT_CASE_STUDY_SECTION_CONTEXT,
  PROJECT_CASE_STUDY_SECTION_EVIDENCE,
  PROJECT_CASE_STUDY_SECTION_IMPROVE,
  PROJECT_CASE_STUDY_SECTION_OUTCOME,
  PROJECT_CASE_STUDY_SECTION_PROBLEM,
  PROJECT_CASE_STUDY_SECTION_TECHNICAL_DECISIONS,
  PROJECT_CASE_STUDY_SECTION_UX_DECISIONS,
  PROJECT_CASE_STUDY_SECTION_WHAT_I_BUILT,
  PROJECT_CASE_STUDY_TOC_HEADING,
  PROJECT_CASE_STUDY_TOC_ITEMS,
  PROJECT_MY_ROLE_HEADING,
  PROJECT_SECTION_LINK_BACK,
  PROJECT_SECTION_LINK_NEXT,
  PROJECT_SECTION_RELATED_HEADING,
  projectCaseStudyTocAriaLabel,
} from "data/projectsUi";
import { FOCUS_RING, LABEL_OVERLINE } from "utils/visual";

type ProjectCaseStudyArticleProps = {
  project: Project;
  nextProject?: Project;
  isDedicatedPage?: boolean;
};

const BulletList = ({ items }: { items: string[] }) => {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="text-[15px] leading-relaxed text-muted">
          {item}
        </li>
      ))}
    </ul>
  );
};

const RelatedLinksSection = ({
  project,
  nextProject,
  isDedicatedPage,
}: {
  project: Project;
  nextProject?: Project;
  isDedicatedPage: boolean;
}) => {
  return (
    <section id={`${project.id}-related`} className="scroll-mt-28 space-y-3">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
        {PROJECT_SECTION_RELATED_HEADING}
      </h2>
      <div className="flex flex-wrap gap-3">
        {project.relatedLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex min-h-11 items-center rounded-lg border border-border bg-background/70 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/35 hover:bg-card/70 ${FOCUS_RING}`}
          >
            {link.label}
          </Link>
        ))}
        {nextProject ? (
          <Link
            href={isDedicatedPage ? `/portfolio/${nextProject.slug}` : `#project-${nextProject.id}`}
            className={`inline-flex min-h-11 items-center rounded-lg border border-border bg-background/70 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/35 hover:bg-card/70 ${FOCUS_RING}`}
          >
            {PROJECT_SECTION_LINK_NEXT}: {nextProject.name}
          </Link>
        ) : null}
        <Link
          href={isDedicatedPage ? "/portfolio#case-studies" : "#case-studies"}
          className={`inline-flex min-h-11 items-center rounded-lg border border-border bg-background/70 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/35 hover:bg-card/70 ${FOCUS_RING}`}
        >
          {PROJECT_SECTION_LINK_BACK}
        </Link>
      </div>
    </section>
  );
};

export const ProjectCaseStudyArticle = ({
  project,
  nextProject,
  isDedicatedPage = false,
}: ProjectCaseStudyArticleProps) => {
  const tocItems = PROJECT_CASE_STUDY_TOC_ITEMS.map((item) => ({
    id: `${project.id}-${item.suffix}`,
    label: item.label,
  }));
  const heroFigure = project.caseStudy.interfaceEvidence?.[0];
  const evidenceFigures =
    project.caseStudy.interfaceEvidence?.slice(isDedicatedPage && heroFigure ? 1 : 0) ?? [];
  const TitleTag = isDedicatedPage ? "h1" : "h2";

  return (
    <article
      {...(isDedicatedPage ? {} : { id: `project-${project.id}` })}
      className={
        isDedicatedPage
          ? "space-y-0"
          : "scroll-mt-28 border-t border-border py-16 first:border-t-0 first:pt-0 sm:py-20"
      }
      aria-labelledby={`${project.id}-heading`}
    >
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_15rem] xl:gap-12">
        <div className="min-w-0 space-y-12">
          <header className="space-y-6">
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
              <p className="max-w-3xl text-[15px] leading-relaxed text-muted">
                {project.caseStudy.overview}
              </p>
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
            </div>
            {isDedicatedPage && heroFigure ? (
              <div className="max-w-4xl">
                <ProjectFigure figure={heroFigure} />
              </div>
            ) : null}
          </header>

          <section id={`${project.id}-context`} className="scroll-mt-28 space-y-3">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {PROJECT_CASE_STUDY_SECTION_CONTEXT}
            </h2>
            <p className="max-w-3xl text-[15px] leading-relaxed text-muted">
              {project.caseStudy.context}
            </p>
          </section>

          <section id={`${project.id}-problem`} className="scroll-mt-28 space-y-3">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {PROJECT_CASE_STUDY_SECTION_PROBLEM}
            </h2>
            <p className="max-w-3xl text-[15px] leading-relaxed text-muted">
              {project.caseStudy.problem}
            </p>
          </section>

          <section id={`${project.id}-role`} className="scroll-mt-28 space-y-3">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {PROJECT_MY_ROLE_HEADING}
            </h2>
            <BulletList items={project.caseStudy.myRole} />
          </section>

          <section id={`${project.id}-built`} className="scroll-mt-28 space-y-3">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {PROJECT_CASE_STUDY_SECTION_WHAT_I_BUILT}
            </h2>
            <BulletList items={project.caseStudy.whatIBuilt} />
          </section>

          <section id={`${project.id}-technical-decisions`} className="scroll-mt-28 space-y-5">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {PROJECT_CASE_STUDY_SECTION_TECHNICAL_DECISIONS}
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {project.caseStudy.technicalDecisions.map((decision) => (
                <ProjectDecisionCard key={decision.decision} decision={decision} />
              ))}
            </div>
          </section>

          <section id={`${project.id}-ux-decisions`} className="scroll-mt-28 space-y-3">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {PROJECT_CASE_STUDY_SECTION_UX_DECISIONS}
            </h2>
            <BulletList items={project.caseStudy.uxDecisions} />
          </section>

          {evidenceFigures.length ? (
            <section id={`${project.id}-evidence`} className="scroll-mt-28 space-y-5">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                {PROJECT_CASE_STUDY_SECTION_EVIDENCE}
              </h2>
              <div className="space-y-8 empty:hidden">
                {evidenceFigures.map((figure) => (
                  <ProjectFigure key={`${figure.alt}-${figure.captionLead}`} figure={figure} />
                ))}
              </div>
            </section>
          ) : null}

          <section id={`${project.id}-outcome`} className="scroll-mt-28 space-y-3">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {PROJECT_CASE_STUDY_SECTION_OUTCOME}
            </h2>
            <BulletList items={project.caseStudy.outcome} />
          </section>

          <section id={`${project.id}-improve`} className="scroll-mt-28 space-y-3">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {PROJECT_CASE_STUDY_SECTION_IMPROVE}
            </h2>
            <BulletList items={project.caseStudy.nextImprovements} />
          </section>

          <RelatedLinksSection
            project={project}
            nextProject={nextProject}
            isDedicatedPage={isDedicatedPage}
          />
        </div>

        <aside className="hidden xl:block">
          <nav
            className="sticky top-28 rounded-2xl border border-border/70 bg-card/50 p-4"
            aria-label={projectCaseStudyTocAriaLabel(project.name)}
          >
            <p className={`${LABEL_OVERLINE} mb-3`}>{PROJECT_CASE_STUDY_TOC_HEADING}</p>
            <ul className="space-y-2">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`block text-sm leading-snug text-muted transition-colors hover:text-foreground ${FOCUS_RING}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </article>
  );
};
