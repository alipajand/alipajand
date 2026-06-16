"use client";

import Image from "next/image";

import { LedgerGuardArchitectureDiagram } from "components/diagrams/LedgerGuardArchitectureDiagram";
import { ProjectCardBadge } from "components/Projects/ProjectCardBadge";
import { ProjectCardBeforeAfterRow } from "components/Projects/ProjectCardBeforeAfterRow";
import { ProjectCardCaseStudyField } from "components/Projects/ProjectCardCaseStudyField";
import { ProjectCardHighLevelFlow } from "components/Projects/ProjectCardHighLevelFlow";
import { ProjectCardFooterLink } from "components/Projects/ProjectCardFooterLink";
import { ProjectCardSignalStackItem } from "components/Projects/ProjectCardSignalStackItem";
import { ProjectCardSupportingOutcome } from "components/Projects/ProjectCardSupportingOutcome";
import { ProjectCardTechChip } from "components/Projects/ProjectCardTechChip";
import type { Project } from "data/projects";
import {
  PROJECT_CARD_ARIA_BADGES,
  PROJECT_CARD_BEST_FOR_PREFIX,
  PROJECT_CARD_CASE_STUDY_SR,
  PROJECT_CARD_CONTRIBUTION_LABEL,
  PROJECT_CARD_EXTERNAL_NEW_TAB_HINT,
  PROJECT_CARD_FULL_STACK_SUMMARY,
  PROJECT_CARD_LEDGER_DIAGRAM_CAPTION,
  PROJECT_CARD_MORE_OUTCOMES,
  PROJECT_CARD_OPEN_PROJECT,
  PROJECT_CARD_OWNED_LABEL,
  PROJECT_CARD_TECHNICAL_SIGNALS,
  PROJECT_CASE_STUDY_ROWS,
  projectCaseStudyImageAlt,
} from "data/projectsUi";
import { splitRoleLine } from "utils/projectRole";
import { isHref } from "utils/isHttpOrHttpsHref";
import { FOCUS_RING } from "utils/visual";

export function ProjectCard({ project }: { project: Project }) {
  const hasCaseStudy = project.caseStudy != null;
  const hasBeforeAfter = project.beforeAfter != null && project.beforeAfter.length > 0;
  const { title: roleTitle, company } = splitRoleLine(project.role);
  const leadOutcome = project.outcomes[0] ?? "";
  const supportingOutcomes = project.outcomes.slice(1);

  return (
    <article
      id={`project-${project.id}`}
      data-project-card
      className="group scroll-mt-28 rounded-xl border border-border/70 bg-card/50 p-6 sm:p-8 transition-all duration-300 hover:border-foreground/20 hover:bg-card hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
    >
      <div className="flex flex-col gap-6 sm:gap-7">
        {project.badges && project.badges.length > 0 && (
          <ul
            className="flex flex-wrap gap-2 list-none p-0 m-0"
            aria-label={PROJECT_CARD_ARIA_BADGES}
          >
            {project.badges.map((b) => (
              <ProjectCardBadge key={b}>{b}</ProjectCardBadge>
            ))}
          </ul>
        )}

        <div className="space-y-3">
          {leadOutcome ? (
            <p className="text-base sm:text-[17px] font-medium text-foreground leading-snug text-balance">
              {leadOutcome}
            </p>
          ) : null}
          <h3 className="font-display font-semibold text-xl sm:text-2xl text-foreground leading-tight">
            {project.name}
          </h3>
          <div className="text-sm text-muted leading-relaxed">
            <span className="text-foreground/90 font-medium">{roleTitle}</span>
            {company ? (
              <>
                <span className="text-muted"> · </span>
                <span className="text-muted">{company}</span>
              </>
            ) : null}
          </div>
          <p className="text-muted text-[15px] sm:text-base leading-relaxed max-w-prose">
            {project.description}
          </p>
          {project.bestFor && project.bestFor.length > 0 && (
            <p className="text-[13px] sm:text-sm text-muted leading-relaxed">
              <span className="text-foreground/80 font-medium">{PROJECT_CARD_BEST_FOR_PREFIX}</span>{" "}
              {project.bestFor.join(" · ")}
            </p>
          )}
          {project.contribution ? (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                {PROJECT_CARD_CONTRIBUTION_LABEL}
              </p>
              <p className="text-muted text-[15px] sm:text-base leading-relaxed max-w-prose">
                {project.contribution}
              </p>
            </div>
          ) : null}
        </div>

        {project.caseStudy && project.caseStudy.owned.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              {PROJECT_CARD_OWNED_LABEL}
            </p>
            <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
              {project.caseStudy.owned.map((point) => (
                <li
                  key={point}
                  className="relative pl-4 text-muted text-[15px] leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-foreground/40"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            {PROJECT_CARD_TECHNICAL_SIGNALS}
          </p>
          <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
            {project.signalStack.map((s) => (
              <ProjectCardSignalStackItem key={s}>{s}</ProjectCardSignalStackItem>
            ))}
          </ul>
        </div>

        <details className="group/details rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-sm">
          <summary
            className={`cursor-pointer list-none font-medium text-muted transition-colors hover:text-foreground rounded-sm [&::-webkit-details-marker]:hidden ${FOCUS_RING}`}
          >
            <span className="inline-flex items-center gap-2">
              {PROJECT_CARD_FULL_STACK_SUMMARY}
              <span className="text-muted/80 text-xs font-normal group-open/details:hidden">+</span>
              <span className="text-muted/80 text-xs font-normal hidden group-open/details:inline">
                −
              </span>
            </span>
          </summary>
          <div className="mt-3 flex flex-wrap gap-2 pb-1">
            {project.tech.map((t) => (
              <ProjectCardTechChip key={t}>{t}</ProjectCardTechChip>
            ))}
          </div>
        </details>

        {project.image && project.image.trim() !== "" && (
          <figure className="space-y-2">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-background border border-border">
              <Image
                src={project.image}
                alt={project.imageCaption ? "" : projectCaseStudyImageAlt(project.name)}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
            {project.imageCaption && (
              <figcaption className="text-muted text-sm">{project.imageCaption}</figcaption>
            )}
          </figure>
        )}
        {project.secondaryMedia &&
          project.secondaryMedia.src &&
          project.secondaryMedia.src.trim() !== "" && (
            <figure className="space-y-2">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-background border border-border">
                <Image
                  src={project.secondaryMedia.src}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>
              <figcaption className="text-muted text-sm">
                {project.secondaryMedia.caption}
              </figcaption>
            </figure>
          )}

        {hasCaseStudy && (
          <div className="space-y-5 pt-1 border-t border-border">
            <h4 className="sr-only">{PROJECT_CARD_CASE_STUDY_SR}</h4>
            {project.caseStudy?.highLevelFlow && project.caseStudy.highLevelFlow.length > 0 ? (
              <ProjectCardHighLevelFlow steps={project.caseStudy.highLevelFlow} />
            ) : null}
            {project.id === "ledgerguard-deterministic-commitments-ledger" ? (
              <figure className="space-y-2">
                <LedgerGuardArchitectureDiagram />
                <figcaption className="text-muted text-xs sm:text-sm leading-snug">
                  {PROJECT_CARD_LEDGER_DIAGRAM_CAPTION}
                </figcaption>
              </figure>
            ) : null}
            {project.caseStudy ? (
              <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                {PROJECT_CASE_STUDY_ROWS.map(({ key, label }) => (
                  <ProjectCardCaseStudyField key={key} label={label}>
                    {project.caseStudy![key]}
                  </ProjectCardCaseStudyField>
                ))}
              </div>
            ) : null}
          </div>
        )}

        {hasBeforeAfter && (
          <div className="flex flex-wrap gap-3 pt-1">
            {project.beforeAfter!.map((ba) => (
              <ProjectCardBeforeAfterRow key={ba.label} row={ba} />
            ))}
          </div>
        )}

        {supportingOutcomes.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              {PROJECT_CARD_MORE_OUTCOMES}
            </p>
            <ul className="flex flex-col gap-2 list-none pl-0 m-0">
              {supportingOutcomes.map((outcome, i) => (
                <ProjectCardSupportingOutcome key={i}>{outcome}</ProjectCardSupportingOutcome>
              ))}
            </ul>
          </div>
        )}

        {project.link ? (
          <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
            <a
              href={project.link}
              target={isHref(project.link) ? "_blank" : undefined}
              rel={isHref(project.link) ? "noopener noreferrer" : undefined}
              className={`inline-flex items-center gap-2 rounded-md border border-border bg-background/60 px-4 py-2.5 text-sm font-medium text-foreground hover:border-foreground/30 hover:bg-card/80 transition-colors ${FOCUS_RING}`}
            >
              {PROJECT_CARD_OPEN_PROJECT}
              {isHref(project.link) ? (
                <span aria-hidden className="text-muted">
                  ↗
                </span>
              ) : null}
              {isHref(project.link) ? (
                <span className="sr-only">{PROJECT_CARD_EXTERNAL_NEW_TAB_HINT}</span>
              ) : null}
            </a>
          </div>
        ) : project.links && project.links.length > 0 ? (
          <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
            {project.links.map(({ label, href }) => (
              <ProjectCardFooterLink key={href} label={label} href={href} />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
