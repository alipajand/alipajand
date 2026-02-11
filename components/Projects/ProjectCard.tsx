"use client";

import Image from "next/image";

import type { Project } from "data/projects";

export function ProjectCard({ project }: { project: Project }) {
  const hasCaseStudy = project.caseStudy != null;
  const hasBeforeAfter = project.beforeAfter != null && project.beforeAfter.length > 0;

  return (
    <article
      data-project-card
      className="group rounded-xl border border-border bg-card/50 p-6 sm:p-8 transition-all duration-300 hover:border-foreground/20 hover:bg-card hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
    >
      <div className="flex flex-col gap-4">
        {project.image && (
          <figure className="space-y-2">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-background border border-border">
              <Image
                src={project.image}
                alt={project.imageCaption ?? ""}
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
        {project.secondaryMedia && (
          <figure className="space-y-2">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-background border border-border">
              <Image
                src={project.secondaryMedia.src}
                alt={project.secondaryMedia.caption}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
            <figcaption className="text-muted text-sm">{project.secondaryMedia.caption}</figcaption>
          </figure>
        )}
        <div>
          <h3 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
            {project.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-muted">{project.role}</p>
        </div>
        <p className="text-muted text-[15px] sm:text-base leading-relaxed">{project.description}</p>

        {hasCaseStudy && (
          <div className="grid sm:grid-cols-3 gap-4 pt-2 border-t border-border">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                The issue
              </span>
              <p className="mt-1 text-sm text-foreground/90 leading-relaxed">
                {project.caseStudy!.problem}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                What we did
              </span>
              <p className="mt-1 text-sm text-foreground/90 leading-relaxed">
                {project.caseStudy!.approach}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Outcome
              </span>
              <p className="mt-1 text-sm text-foreground/90 leading-relaxed">
                {project.caseStudy!.result}
              </p>
            </div>
          </div>
        )}

        {hasBeforeAfter && (
          <div className="flex flex-wrap gap-4 pt-2">
            {project.beforeAfter!.map((ba) => (
              <div
                key={ba.label}
                className="flex items-center gap-2 rounded-md bg-background/80 border border-border px-3 py-2 text-sm"
              >
                <span className="text-muted shrink-0">{ba.label}:</span>
                <span className="text-foreground/70 line-through">{ba.before}</span>
                <span className="text-foreground" aria-hidden>
                  →
                </span>
                <span className="text-foreground font-medium">{ba.after}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="inline-flex px-2.5 py-1 rounded-md bg-background border border-border text-foreground/80 text-xs font-medium"
            >
              {t}
            </span>
          ))}
        </div>
        <ul className="flex flex-col gap-1.5 pt-1">
          {project.outcomes.map((outcome, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground/90 leading-relaxed">
              <span className="text-foreground/60 shrink-0" aria-hidden>
                —
              </span>
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
        {project.link && (
          <a
            href={project.link}
            target={project.link.startsWith("http") ? "_blank" : undefined}
            rel={project.link.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-sm font-medium text-foreground hover:text-muted transition-colors mt-1"
          >
            View project →
          </a>
        )}
      </div>
    </article>
  );
}
