"use client";

import Link from "next/link";

import { MainReveal } from "components/MainReveal/MainReveal";
import { ProjectCardBadge } from "components/Projects/ProjectCardBadge";
import { PAGE_LINK_BACK_TO_HOMEPAGE } from "data/pageChrome";
import {
  OPEN_SOURCE_CTA_BODY,
  OPEN_SOURCE_CTA_HEADING,
  OPEN_SOURCE_CTA_PRIMARY_HREF,
  OPEN_SOURCE_CTA_PRIMARY_LABEL,
  OPEN_SOURCE_CTA_SECONDARY_HREF,
  OPEN_SOURCE_CTA_SECONDARY_LABEL,
  OPEN_SOURCE_HEADER_HEADING,
  OPEN_SOURCE_HEADER_INTRO,
  OPEN_SOURCE_HEADER_LEDE,
  OPEN_SOURCE_HEADER_OVERLINE,
  OPEN_SOURCE_PROJECTS,
  OPEN_SOURCE_SHARED_PRINCIPLES,
  OPEN_SOURCE_SHARED_PRINCIPLES_HEADING,
  OPEN_SOURCE_TECHNOLOGY_BADGES,
  OPEN_SOURCE_TECHNOLOGY_HEADING,
  OPEN_SOURCE_TOOLKIT_HEADING,
  OPEN_SOURCE_TOOLKIT_LEDE,
  type OpenSourcePrinciple,
  type OpenSourceProject,
} from "data/openSourcePage";
import { usePageHeader } from "utils/hooks/usePageHeader";
import { useScrollReveal } from "utils/hooks/useScrollReveal";
import {
  CARD_SURFACE_HOVER,
  CTA_PRIMARY,
  CTA_SECONDARY,
  FOCUS_RING,
  LABEL_OVERLINE,
  SECTION_INNER,
  SECTION_LEDE,
  SECTION_LEDE_LG,
  SECTION_TITLE,
  SECTION_X,
} from "utils/visual";

const SECTION_BLOCK = `${SECTION_X} border-t border-border bg-background py-14 sm:py-16 lg:py-20`;
const CARD_TITLE = "font-display font-semibold text-xl text-foreground leading-tight";
const CARD_TEXT = "text-muted text-[15px] leading-relaxed";
const FIELD_LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em] text-muted";

function OpenSourceProjectCard({ project }: { project: OpenSourceProject }) {
  return (
    <article className={`${CARD_SURFACE_HOVER} flex h-full flex-col gap-6 p-6 sm:p-8`}>
      <div className="space-y-3">
        <h3 className={CARD_TITLE}>{project.title}</h3>
        <p className={CARD_TEXT}>{project.summary}</p>
      </div>

      <div className="space-y-3">
        <p className={FIELD_LABEL}>{project.checklistLabel}</p>
        <ul
          className="flex flex-col gap-2 list-none p-0 m-0"
          aria-label={`${project.title} checks`}
        >
          {project.checklistItems.map((item) => (
            <li
              key={item}
              className="relative pl-4 text-foreground/85 text-[15px] leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-foreground/40"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <p className={FIELD_LABEL}>Contribution</p>
        <p className={CARD_TEXT}>{project.contribution}</p>
      </div>

      <div className="mt-auto pt-1">
        <Link
          href={project.repositoryUrl}
          aria-label={`Open ${project.title} repository on GitHub`}
          className={`inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground underline underline-offset-4 decoration-foreground/40 hover:decoration-foreground rounded-sm ${FOCUS_RING}`}
        >
          <span>Repository</span>
          <span aria-hidden className="text-muted">
            ↗
          </span>
        </Link>
      </div>
    </article>
  );
}

function OpenSourcePrincipleCard({ principle }: { principle: OpenSourcePrinciple }) {
  return (
    <article className={`${CARD_SURFACE_HOVER} h-full p-5 sm:p-6`}>
      <h3 className="font-display font-semibold text-lg text-foreground">{principle.title}</h3>
      <p className="mt-2 text-muted text-sm leading-relaxed">{principle.body}</p>
    </article>
  );
}

export function OpenSourcePageContent() {
  const {
    selectors: { headerRef },
  } = usePageHeader();

  const {
    selectors: { sectionRef: contentRef },
  } = useScrollReveal({ y: 36, stagger: 0.1, start: "top 90%" });

  return (
    <MainReveal>
      <header
        ref={headerRef}
        className={`${SECTION_X} border-b border-border bg-background pt-28 pb-10 sm:pb-12 sm:pt-32`}
      >
        <div className={SECTION_INNER}>
          <p data-header-overline className={`${LABEL_OVERLINE} mb-2`}>
            {OPEN_SOURCE_HEADER_OVERLINE}
          </p>
          <h1 data-header-title className={SECTION_TITLE}>
            {OPEN_SOURCE_HEADER_HEADING}
          </h1>
          <p data-header-lede className={`${SECTION_LEDE} mt-4 max-w-3xl`}>
            {OPEN_SOURCE_HEADER_LEDE}
          </p>
          <p className="mt-4 max-w-3xl text-[15px] sm:text-base text-foreground/85 leading-relaxed border-l-2 border-border pl-4 sm:pl-5">
            {OPEN_SOURCE_HEADER_INTRO}
          </p>
          <p data-header-back className="mt-8">
            <Link
              href="/"
              className={`text-sm font-medium text-foreground underline-offset-4 hover:underline rounded-sm ${FOCUS_RING}`}
            >
              {PAGE_LINK_BACK_TO_HOMEPAGE}
            </Link>
          </p>
        </div>
      </header>

      <div ref={contentRef as React.Ref<HTMLDivElement>}>
        <section aria-labelledby="open-source-toolkit-heading" className={SECTION_BLOCK}>
          <div className={SECTION_INNER}>
            <header className="mb-10 sm:mb-12" data-reveal>
              <h2 id="open-source-toolkit-heading" className={`${SECTION_TITLE} mb-4 sm:mb-5`}>
                {OPEN_SOURCE_TOOLKIT_HEADING}
              </h2>
              <p className={SECTION_LEDE_LG}>{OPEN_SOURCE_TOOLKIT_LEDE}</p>
            </header>

            <ul className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 list-none p-0 m-0">
              {OPEN_SOURCE_PROJECTS.map((project) => (
                <li key={project.title} data-reveal data-open-source-project className="h-full">
                  <OpenSourceProjectCard project={project} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="open-source-principles-heading" className={SECTION_BLOCK}>
          <div className={SECTION_INNER}>
            <header className="mb-10 sm:mb-12" data-reveal>
              <h2 id="open-source-principles-heading" className={`${SECTION_TITLE} mb-4 sm:mb-5`}>
                {OPEN_SOURCE_SHARED_PRINCIPLES_HEADING}
              </h2>
            </header>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 list-none p-0 m-0">
              {OPEN_SOURCE_SHARED_PRINCIPLES.map((principle) => (
                <li key={principle.title} data-reveal data-open-source-principle className="h-full">
                  <OpenSourcePrincipleCard principle={principle} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="open-source-technology-heading" className={SECTION_BLOCK}>
          <div className={SECTION_INNER}>
            <header className="mb-8 sm:mb-10" data-reveal>
              <h2 id="open-source-technology-heading" className={`${SECTION_TITLE} mb-4 sm:mb-5`}>
                {OPEN_SOURCE_TECHNOLOGY_HEADING}
              </h2>
            </header>

            <ul
              aria-label={OPEN_SOURCE_TECHNOLOGY_HEADING}
              className="flex flex-wrap gap-2 list-none p-0 m-0"
              data-reveal
            >
              {OPEN_SOURCE_TECHNOLOGY_BADGES.map((badge) => (
                <ProjectCardBadge key={badge}>{badge}</ProjectCardBadge>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="open-source-cta-heading" className={SECTION_BLOCK}>
          <div className={SECTION_INNER}>
            <div className={`${CARD_SURFACE_HOVER} p-6 sm:p-8`} data-reveal>
              <h2 id="open-source-cta-heading" className={`${SECTION_TITLE} mb-4 sm:mb-5`}>
                {OPEN_SOURCE_CTA_HEADING}
              </h2>
              <p className={`${SECTION_LEDE_LG} max-w-3xl`}>{OPEN_SOURCE_CTA_BODY}</p>
              <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-4">
                <Link
                  href={OPEN_SOURCE_CTA_PRIMARY_HREF}
                  className={`${CTA_PRIMARY} w-full sm:w-auto`}
                >
                  {OPEN_SOURCE_CTA_PRIMARY_LABEL}
                </Link>
                <Link
                  href={OPEN_SOURCE_CTA_SECONDARY_HREF}
                  className={`${CTA_SECONDARY} w-full sm:w-auto`}
                >
                  {OPEN_SOURCE_CTA_SECONDARY_LABEL}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainReveal>
  );
}
