"use client";

import Image from "next/image";

import type { Project } from "data/projects";
import { splitRoleLine } from "utils/projectRole";
import { FOCUS_RING } from "utils/visual";

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

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
          <ul className="flex flex-wrap gap-2 list-none p-0 m-0" aria-label="Project themes">
            {project.badges.map((b) => (
              <li key={b}>
                <span className="inline-flex items-center rounded border border-border/80 bg-background/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  {b}
                </span>
              </li>
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
              <span className="text-foreground/80 font-medium">Best for:</span>{" "}
              {project.bestFor.join(" · ")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Technical signals
          </p>
          <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
            {project.signalStack.map((s) => (
              <li key={s}>
                <span className="inline-flex items-center rounded-md border border-border bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground/90">
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <details className="group/details rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-sm">
          <summary
            className={`cursor-pointer list-none font-medium text-muted transition-colors hover:text-foreground rounded-sm [&::-webkit-details-marker]:hidden ${FOCUS_RING}`}
          >
            <span className="inline-flex items-center gap-2">
              Full stack
              <span className="text-muted/80 text-xs font-normal group-open/details:hidden">+</span>
              <span className="text-muted/80 text-xs font-normal hidden group-open/details:inline">−</span>
            </span>
          </summary>
          <div className="mt-3 flex flex-wrap gap-2 pb-1">
            {project.tech.map((t) => (
              <span
                key={t}
                className="inline-flex px-2 py-0.5 rounded border border-border/80 text-foreground/70 text-xs"
              >
                {t}
              </span>
            ))}
          </div>
        </details>

        {project.image && project.image.trim() !== "" && (
          <figure className="space-y-2">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-background border border-border">
              <Image
                src={project.image}
                alt={project.imageCaption ? "" : `Case study visual: ${project.name}`}
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
            <h4 className="sr-only">Case study</h4>
            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              <div className="min-w-0 space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Problem
                </span>
                <p className="text-sm text-foreground/90 leading-relaxed">{project.caseStudy!.problem}</p>
              </div>
              <div className="min-w-0 space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Approach
                </span>
                <p className="text-sm text-foreground/90 leading-relaxed">{project.caseStudy!.approach}</p>
              </div>
            </div>
            <div className="min-w-0 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                Result
              </span>
              <p className="text-sm text-foreground/90 leading-relaxed">{project.caseStudy!.result}</p>
            </div>
          </div>
        )}

        {hasBeforeAfter && (
          <div className="flex flex-wrap gap-3 pt-1">
            {project.beforeAfter!.map((ba) => (
              <div
                key={ba.label}
                className="flex items-center gap-2 rounded-md bg-background/80 border border-border px-3 py-2 text-sm min-w-0"
              >
                <span className="text-muted shrink-0">{ba.label}:</span>
                <span className="text-foreground/60 line-through truncate">{ba.before}</span>
                <span className="text-foreground/50 shrink-0" aria-hidden>
                  →
                </span>
                <span className="text-foreground font-medium truncate">{ba.after}</span>
              </div>
            ))}
          </div>
        )}

        {supportingOutcomes.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              More outcomes
            </p>
            <ul className="flex flex-col gap-2 list-none pl-0 m-0">
              {supportingOutcomes.map((outcome, i) => (
                <li key={i} className="flex gap-2 text-sm text-foreground/90 leading-relaxed">
                  <span className="text-foreground/50 shrink-0" aria-hidden>
                    —
                  </span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.link ? (
          <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
            <a
              href={project.link}
              target={isExternalHref(project.link) ? "_blank" : undefined}
              rel={isExternalHref(project.link) ? "noopener noreferrer" : undefined}
              className={`inline-flex items-center gap-2 rounded-md border border-border bg-background/60 px-4 py-2.5 text-sm font-medium text-foreground hover:border-foreground/30 hover:bg-card/80 transition-colors ${FOCUS_RING}`}
            >
              Open site
              {isExternalHref(project.link) ? (
                <span aria-hidden className="text-muted">
                  ↗
                </span>
              ) : null}
              {isExternalHref(project.link) ? (
                <span className="sr-only"> (opens in new tab)</span>
              ) : null}
            </a>
          </div>
        ) : project.links && project.links.length > 0 ? (
          <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
            {project.links.map(({ label, href }) => {
              const ext = isExternalHref(href);
              return (
                <a
                  key={href}
                  href={href}
                  target={ext ? "_blank" : undefined}
                  rel={ext ? "noopener noreferrer" : undefined}
                  className={`inline-flex items-center gap-2 rounded-md border border-border bg-background/60 px-4 py-2.5 text-sm font-medium text-foreground hover:border-foreground/30 hover:bg-card/80 transition-colors ${FOCUS_RING}`}
                >
                  {label}
                  {ext ? (
                    <span aria-hidden className="text-muted">
                      ↗
                    </span>
                  ) : null}
                  {ext ? (
                    <span className="sr-only"> (opens in new tab)</span>
                  ) : null}
                </a>
              );
            })}
          </div>
        ) : null}
      </div>
    </article>
  );
}
