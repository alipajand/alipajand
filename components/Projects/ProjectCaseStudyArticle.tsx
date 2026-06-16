"use client";

import Link from "next/link";

import { ProjectDecisionCard } from "components/Projects/ProjectDecisionCard";
import { ProjectFigure } from "components/Projects/ProjectFigure";
import type { Project } from "data/projects";
import {
  PROJECT_RESPONSIBILITY_COLLABORATIVE,
  PROJECT_RESPONSIBILITY_HEADING,
  PROJECT_RESPONSIBILITY_OUTSIDE,
  PROJECT_RESPONSIBILITY_OWNED,
  PROJECT_SECTION_LINK_BACK,
  PROJECT_SECTION_LINK_NEXT,
  PROJECT_SECTION_RELATED_HEADING,
} from "data/projectsUi";
import { FOCUS_RING, LABEL_OVERLINE } from "utils/visual";

type ProjectCaseStudyArticleProps = {
  project: Project;
  nextProject?: Project;
};

type TocItem = {
  id: string;
  label: string;
};

function ResponsibilityList({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div className="space-y-2">
      <h4 className="text-base font-semibold text-foreground">{heading}</h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="text-[15px] leading-relaxed text-muted">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectCaseStudyArticle({ project, nextProject }: ProjectCaseStudyArticleProps) {
  const tocItems: TocItem[] = [
    { id: `${project.id}-overview`, label: "Overview" },
    { id: `${project.id}-context`, label: "Context and constraints" },
    { id: `${project.id}-responsibility`, label: "My responsibility" },
    { id: `${project.id}-problem`, label: "The problem" },
    { id: `${project.id}-decisions`, label: "Key decisions" },
    { id: `${project.id}-workflow`, label: "Product workflow or system architecture" },
    { id: `${project.id}-evidence`, label: "Interface evidence" },
    { id: `${project.id}-states`, label: "Difficult states and edge cases" },
    { id: `${project.id}-outcome`, label: "Outcome" },
    { id: `${project.id}-improve`, label: "What I would improve next" },
    { id: `${project.id}-related`, label: "Related work" },
  ];

  return (
    <article
      id={`project-${project.id}`}
      className="scroll-mt-28 border-t border-border py-16 first:border-t-0 first:pt-0 sm:py-20"
      aria-labelledby={`${project.id}-heading`}
    >
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_15rem] xl:gap-12">
        <div className="min-w-0 space-y-12">
          <header className="space-y-6">
            <div className="space-y-3">
              <p className={LABEL_OVERLINE}>{project.employerContext}</p>
              <h2
                id={`${project.id}-heading`}
                className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                {project.name}
              </h2>
              <p className="text-xl font-medium leading-snug text-foreground/90">
                {project.caseStudyTitle}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm text-muted">
                <span>{project.role}</span>
                {project.timeframe ? <span>· {project.timeframe}</span> : null}
              </div>
              <ul className="flex flex-wrap gap-2">
                {project.capabilityTags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-sm text-foreground/85"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            <ProjectFigure figure={project.heroFigure} />
          </header>

          <section id={`${project.id}-overview`} className="scroll-mt-28 space-y-3">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Overview
            </h3>
            <p className="max-w-3xl text-[15px] leading-relaxed text-muted">
              {project.caseStudy.overview}
            </p>
          </section>

          <section id={`${project.id}-context`} className="scroll-mt-28 space-y-3">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Context and constraints
            </h3>
            <p className="max-w-3xl text-[15px] leading-relaxed text-muted">
              {project.caseStudy.contextAndConstraints}
            </p>
          </section>

          <section id={`${project.id}-responsibility`} className="scroll-mt-28 space-y-6">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {PROJECT_RESPONSIBILITY_HEADING}
            </h3>
            {project.caseStudy.responsibility.factualReviewNote ? (
              <p className="max-w-3xl rounded-xl border border-border/70 bg-card/50 px-4 py-3 text-sm leading-relaxed text-muted">
                Factual review note: {project.caseStudy.responsibility.factualReviewNote}
              </p>
            ) : null}
            <div className="grid gap-6 md:grid-cols-3">
              <ResponsibilityList
                heading={PROJECT_RESPONSIBILITY_OWNED}
                items={project.caseStudy.responsibility.owned}
              />
              <ResponsibilityList
                heading={PROJECT_RESPONSIBILITY_COLLABORATIVE}
                items={project.caseStudy.responsibility.collaborative}
              />
              <ResponsibilityList
                heading={PROJECT_RESPONSIBILITY_OUTSIDE}
                items={project.caseStudy.responsibility.outside}
              />
            </div>
          </section>

          <section id={`${project.id}-problem`} className="scroll-mt-28 space-y-3">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              The problem
            </h3>
            <p className="max-w-3xl text-[15px] leading-relaxed text-muted">
              {project.caseStudy.problem}
            </p>
          </section>

          <section id={`${project.id}-decisions`} className="scroll-mt-28 space-y-5">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Key decisions
            </h3>
            <div className="grid gap-4 lg:grid-cols-2">
              {project.caseStudy.decisions.map((decision) => (
                <ProjectDecisionCard key={decision.decision} decision={decision} />
              ))}
            </div>
          </section>

          <section id={`${project.id}-workflow`} className="scroll-mt-28 space-y-3">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Product workflow or system architecture
            </h3>
            <ol className="space-y-3">
              {project.caseStudy.workflow.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-card/60 text-sm font-medium text-foreground">
                    {index + 1}
                  </span>
                  <p className="text-[15px] leading-relaxed text-muted">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id={`${project.id}-evidence`} className="scroll-mt-28 space-y-5">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Interface evidence
            </h3>
            <div className="space-y-8">
              {project.caseStudy.interfaceEvidence.map((figure) => (
                <ProjectFigure key={`${figure.alt}-${figure.captionLead}`} figure={figure} />
              ))}
            </div>
          </section>

          <section id={`${project.id}-states`} className="scroll-mt-28 space-y-3">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Difficult states and edge cases
            </h3>
            <ul className="space-y-2">
              {project.caseStudy.difficultStates.map((item) => (
                <li key={item} className="text-[15px] leading-relaxed text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section id={`${project.id}-outcome`} className="scroll-mt-28 space-y-3">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Outcome
            </h3>
            <ul className="space-y-2">
              {project.caseStudy.outcome.map((item) => (
                <li key={item} className="text-[15px] leading-relaxed text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section id={`${project.id}-improve`} className="scroll-mt-28 space-y-3">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              What I would improve next
            </h3>
            <ul className="space-y-2">
              {project.caseStudy.nextImprovements.map((item) => (
                <li key={item} className="text-[15px] leading-relaxed text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section id={`${project.id}-related`} className="scroll-mt-28 space-y-3">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {PROJECT_SECTION_RELATED_HEADING}
            </h3>
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
                  href={`#project-${nextProject.id}`}
                  className={`inline-flex min-h-11 items-center rounded-lg border border-border bg-background/70 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/35 hover:bg-card/70 ${FOCUS_RING}`}
                >
                  {PROJECT_SECTION_LINK_NEXT}: {nextProject.name}
                </Link>
              ) : null}
              <Link
                href="#case-studies"
                className={`inline-flex min-h-11 items-center rounded-lg border border-border bg-background/70 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/35 hover:bg-card/70 ${FOCUS_RING}`}
              >
                {PROJECT_SECTION_LINK_BACK}
              </Link>
            </div>
          </section>
        </div>

        <aside className="hidden xl:block">
          <nav
            className="sticky top-28 rounded-2xl border border-border/70 bg-card/50 p-4"
            aria-label={`Table of contents for ${project.name}`}
          >
            <p className={`${LABEL_OVERLINE} mb-3`}>On this page</p>
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
}
