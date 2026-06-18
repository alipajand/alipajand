"use client";

import Link from "next/link";

import { ProjectDecisionCard } from "components/Projects/ProjectDecisionCard";
import { ProjectHighlightCard } from "components/Projects/ProjectHighlightCard";
import type { Project } from "data/projects";
import { isFounderProductCaseStudy } from "data/projects";
import {
  PROJECT_CASE_STUDY_FACTUAL_REVIEW_PREFIX,
  PROJECT_CASE_STUDY_SECTION_CONTEXT,
  PROJECT_CASE_STUDY_SECTION_DECISIONS,
  PROJECT_CASE_STUDY_SECTION_EVIDENCE,
  PROJECT_CASE_STUDY_SECTION_IMPROVE,
  PROJECT_CASE_STUDY_SECTION_OUTCOME,
  PROJECT_CASE_STUDY_SECTION_OVERVIEW,
  PROJECT_CASE_STUDY_SECTION_PROBLEM,
  PROJECT_CASE_STUDY_SECTION_PRODUCT_DECISIONS,
  PROJECT_CASE_STUDY_SECTION_RESULT,
  PROJECT_CASE_STUDY_SECTION_SCREENSHOTS,
  PROJECT_CASE_STUDY_SECTION_STATES,
  PROJECT_CASE_STUDY_SECTION_TECHNICAL_HIGHLIGHTS,
  PROJECT_CASE_STUDY_SECTION_WHAT_I_BUILT,
  PROJECT_CASE_STUDY_SECTION_WORKFLOW,
  PROJECT_CASE_STUDY_TOC_HEADING,
  PROJECT_CASE_STUDY_TOC_ITEMS,
  PROJECT_FOUNDER_CASE_STUDY_TOC_ITEMS,
  PROJECT_OVERVIEW_META_LINK,
  PROJECT_OVERVIEW_META_ROLE,
  PROJECT_OVERVIEW_META_SCOPE,
  PROJECT_OVERVIEW_META_STACK,
  PROJECT_OVERVIEW_META_STATUS,
  PROJECT_RESPONSIBILITY_COLLABORATIVE,
  PROJECT_RESPONSIBILITY_HEADING,
  PROJECT_RESPONSIBILITY_OUTSIDE,
  PROJECT_RESPONSIBILITY_OWNED,
  PROJECT_SECTION_LINK_BACK,
  PROJECT_SECTION_LINK_NEXT,
  PROJECT_SECTION_RELATED_HEADING,
  projectCaseStudyTocAriaLabel,
} from "data/projectsUi";
import { FOCUS_RING, LABEL_OVERLINE } from "utils/visual";
import { ProjectFigure } from "components/Projects/ProjectFigure";

type ProjectCaseStudyArticleProps = {
  project: Project;
  nextProject?: Project;
  isDedicatedPage?: boolean;
};

type TocItem = {
  id: string;
  label: string;
};

const ResponsibilityList = ({ heading, items }: { heading: string; items: string[] }) => {
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
};

const CaseStudyBulletList = ({ items }: { items: string[] }) => {
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
  const founderCaseStudy = isFounderProductCaseStudy(project.caseStudy)
    ? project.caseStudy
    : undefined;
  const standardCaseStudy = !isFounderProductCaseStudy(project.caseStudy)
    ? project.caseStudy
    : undefined;
  const tocItems: TocItem[] = (
    founderCaseStudy ? PROJECT_FOUNDER_CASE_STUDY_TOC_ITEMS : PROJECT_CASE_STUDY_TOC_ITEMS
  ).map((item) => ({
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
              <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm text-muted">
                <span>{project.role}</span>
                {project.timeframe ? <span>· {project.timeframe}</span> : null}
              </div>
              <ul className="flex flex-wrap gap-2" aria-label={`${project.name} capabilities`}>
                {project.capabilityTags.slice(0, 3).map((tag) => (
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

          <section id={`${project.id}-overview`} className="scroll-mt-28 space-y-3">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {PROJECT_CASE_STUDY_SECTION_OVERVIEW}
            </h3>
            <p className="max-w-3xl text-[15px] leading-relaxed text-muted">
              {project.caseStudy.overview}
            </p>
            {founderCaseStudy ? (
              <dl className="grid max-w-3xl gap-4 pt-2 sm:grid-cols-2">
                <div>
                  <dt className={LABEL_OVERLINE}>{PROJECT_OVERVIEW_META_ROLE}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-muted">
                    {founderCaseStudy.overviewMeta.role}
                  </dd>
                </div>
                <div>
                  <dt className={LABEL_OVERLINE}>{PROJECT_OVERVIEW_META_STACK}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-muted">
                    {founderCaseStudy.overviewMeta.stack}
                  </dd>
                </div>
                <div>
                  <dt className={LABEL_OVERLINE}>{PROJECT_OVERVIEW_META_SCOPE}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-muted">
                    {founderCaseStudy.overviewMeta.scope}
                  </dd>
                </div>
                <div>
                  <dt className={LABEL_OVERLINE}>{PROJECT_OVERVIEW_META_STATUS}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-muted">
                    {founderCaseStudy.overviewMeta.status}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className={LABEL_OVERLINE}>{PROJECT_OVERVIEW_META_LINK}</dt>
                  <dd className="mt-1">
                    <Link
                      href={founderCaseStudy.overviewMeta.link.href}
                      className={`text-[15px] font-medium text-foreground underline-offset-4 hover:underline ${FOCUS_RING} rounded-sm`}
                    >
                      {founderCaseStudy.overviewMeta.link.label}
                    </Link>
                  </dd>
                </div>
              </dl>
            ) : null}
          </section>

          {founderCaseStudy ? (
            <>
              <section id={`${project.id}-problem`} className="scroll-mt-28 space-y-3">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {PROJECT_CASE_STUDY_SECTION_PROBLEM}
                </h3>
                <p className="max-w-3xl text-[15px] leading-relaxed text-muted">
                  {founderCaseStudy.problem}
                </p>
              </section>

              <section id={`${project.id}-decisions`} className="scroll-mt-28 space-y-3">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {PROJECT_CASE_STUDY_SECTION_PRODUCT_DECISIONS}
                </h3>
                <CaseStudyBulletList items={founderCaseStudy.productDecisions} />
              </section>

              <section id={`${project.id}-built`} className="scroll-mt-28 space-y-3">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {PROJECT_CASE_STUDY_SECTION_WHAT_I_BUILT}
                </h3>
                <CaseStudyBulletList items={founderCaseStudy.whatIBuilt} />
              </section>

              <section id={`${project.id}-highlights`} className="scroll-mt-28 space-y-5">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {PROJECT_CASE_STUDY_SECTION_TECHNICAL_HIGHLIGHTS}
                </h3>
                <div className="grid gap-4 lg:grid-cols-2">
                  {founderCaseStudy.technicalHighlights.map((highlight) => (
                    <ProjectHighlightCard key={highlight.title} highlight={highlight} />
                  ))}
                </div>
              </section>

              <section id={`${project.id}-result`} className="scroll-mt-28 space-y-3">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {PROJECT_CASE_STUDY_SECTION_RESULT}
                </h3>
                <p className="max-w-3xl text-[15px] leading-relaxed text-muted">
                  {founderCaseStudy.result}
                </p>
              </section>

              {evidenceFigures.length ? (
                <section id={`${project.id}-screenshots`} className="scroll-mt-28 space-y-5">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                    {PROJECT_CASE_STUDY_SECTION_SCREENSHOTS}
                  </h3>
                  <div className="space-y-8 empty:hidden">
                    {evidenceFigures.map((figure) => (
                      <ProjectFigure key={`${figure.alt}-${figure.captionLead}`} figure={figure} />
                    ))}
                  </div>
                </section>
              ) : null}

              <RelatedLinksSection
                project={project}
                nextProject={nextProject}
                isDedicatedPage={isDedicatedPage}
              />
            </>
          ) : standardCaseStudy ? (
            <>
              <section id={`${project.id}-context`} className="scroll-mt-28 space-y-3">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {PROJECT_CASE_STUDY_SECTION_CONTEXT}
                </h3>
                <p className="max-w-3xl text-[15px] leading-relaxed text-muted">
                  {standardCaseStudy.contextAndConstraints}
                </p>
              </section>

              <section id={`${project.id}-responsibility`} className="scroll-mt-28 space-y-6">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {PROJECT_RESPONSIBILITY_HEADING}
                </h3>
                {standardCaseStudy.responsibility.factualReviewNote ? (
                  <p className="max-w-3xl rounded-xl border border-border/70 bg-card/50 px-4 py-3 text-sm leading-relaxed text-muted">
                    {PROJECT_CASE_STUDY_FACTUAL_REVIEW_PREFIX}{" "}
                    {standardCaseStudy.responsibility.factualReviewNote}
                  </p>
                ) : null}
                <div className="grid gap-6 md:grid-cols-3">
                  <ResponsibilityList
                    heading={PROJECT_RESPONSIBILITY_OWNED}
                    items={standardCaseStudy.responsibility.owned}
                  />
                  <ResponsibilityList
                    heading={PROJECT_RESPONSIBILITY_COLLABORATIVE}
                    items={standardCaseStudy.responsibility.collaborative}
                  />
                  <ResponsibilityList
                    heading={PROJECT_RESPONSIBILITY_OUTSIDE}
                    items={standardCaseStudy.responsibility.outside}
                  />
                </div>
              </section>

              <section id={`${project.id}-problem`} className="scroll-mt-28 space-y-3">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {PROJECT_CASE_STUDY_SECTION_PROBLEM}
                </h3>
                <p className="max-w-3xl text-[15px] leading-relaxed text-muted">
                  {standardCaseStudy.problem}
                </p>
              </section>

              <section id={`${project.id}-decisions`} className="scroll-mt-28 space-y-5">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {PROJECT_CASE_STUDY_SECTION_DECISIONS}
                </h3>
                <div className="grid gap-4 lg:grid-cols-2">
                  {standardCaseStudy.decisions.map((decision) => (
                    <ProjectDecisionCard key={decision.decision} decision={decision} />
                  ))}
                </div>
              </section>

              <section id={`${project.id}-workflow`} className="scroll-mt-28 space-y-3">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {PROJECT_CASE_STUDY_SECTION_WORKFLOW}
                </h3>
                <ol className="space-y-3">
                  {standardCaseStudy.workflow.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-card/60 text-sm font-medium text-foreground">
                        {index + 1}
                      </span>
                      <p className="text-[15px] leading-relaxed text-muted">{step}</p>
                    </li>
                  ))}
                </ol>
              </section>

              {evidenceFigures.length ? (
                <section id={`${project.id}-evidence`} className="scroll-mt-28 space-y-5">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                    {PROJECT_CASE_STUDY_SECTION_EVIDENCE}
                  </h3>
                  <div className="space-y-8 empty:hidden">
                    {evidenceFigures.map((figure) => (
                      <ProjectFigure key={`${figure.alt}-${figure.captionLead}`} figure={figure} />
                    ))}
                  </div>
                </section>
              ) : null}

              <section id={`${project.id}-states`} className="scroll-mt-28 space-y-3">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {PROJECT_CASE_STUDY_SECTION_STATES}
                </h3>
                <ul className="space-y-2">
                  {standardCaseStudy.difficultStates.map((item) => (
                    <li key={item} className="text-[15px] leading-relaxed text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section id={`${project.id}-outcome`} className="scroll-mt-28 space-y-3">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {PROJECT_CASE_STUDY_SECTION_OUTCOME}
                </h3>
                <ul className="space-y-2">
                  {standardCaseStudy.outcome.map((item) => (
                    <li key={item} className="text-[15px] leading-relaxed text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section id={`${project.id}-improve`} className="scroll-mt-28 space-y-3">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {PROJECT_CASE_STUDY_SECTION_IMPROVE}
                </h3>
                <ul className="space-y-2">
                  {standardCaseStudy.nextImprovements.map((item) => (
                    <li key={item} className="text-[15px] leading-relaxed text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <RelatedLinksSection
                project={project}
                nextProject={nextProject}
                isDedicatedPage={isDedicatedPage}
              />
            </>
          ) : null}
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
