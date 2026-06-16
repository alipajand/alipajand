import Image from "next/image";
import Link from "next/link";

import { ProjectCardBadge } from "components/Projects/ProjectCardBadge";
import type { HomepageCaseStudy } from "data/homepage";
import { SELECTED_WORK_CARD_CTA, SELECTED_WORK_CARD_CTA_SR } from "data/selectedWork";
import { FOCUS_RING } from "utils/visual";

const FIELD_LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em] text-muted";

export const SelectedWorkCard = ({ caseStudy }: { caseStudy: HomepageCaseStudy }) => {
  return (
    <article className="group flex h-full flex-col gap-5 rounded-xl border border-border/70 bg-card/50 p-6 sm:p-8 transition-colors duration-200 hover:border-foreground/25 hover:bg-card/70">
      <div className="space-y-3">
        <p className={FIELD_LABEL}>{caseStudy.label}</p>
        <h3 className="font-display font-semibold text-xl sm:text-2xl text-foreground leading-tight">
          {caseStudy.title}
        </h3>
        <p className="text-muted text-[15px] leading-relaxed">{caseStudy.summary}</p>
      </div>

      {caseStudy.image ? (
        <figure className="space-y-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-background">
            <Image
              src={caseStudy.image.src}
              alt={caseStudy.image.alt}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {caseStudy.image.caption ? (
            <figcaption className="text-xs text-muted">{caseStudy.image.caption}</figcaption>
          ) : null}
        </figure>
      ) : (
        <figure className="space-y-2">
          <div className="flex aspect-[16/10] items-end overflow-hidden rounded-lg border border-border bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.12),_transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-4">
            <div className="space-y-2">
              <span className="inline-flex rounded-full border border-border bg-background/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/80">
                {caseStudy.illustrativeLabel}
              </span>
              <p className="max-w-xs text-sm leading-relaxed text-foreground/80">
                Emplifi dashboard surface reconstructed to represent the layout and performance
                constraints described in the case study.
              </p>
            </div>
          </div>
          <figcaption className="text-xs text-muted">{caseStudy.illustrativeLabel}</figcaption>
        </figure>
      )}

      <ul className="flex flex-wrap gap-2 list-none p-0 m-0" aria-label={`${caseStudy.title} tags`}>
        {caseStudy.tags.map((tag) => (
          <ProjectCardBadge key={tag}>{tag}</ProjectCardBadge>
        ))}
      </ul>

      <div className="mt-auto pt-2">
        <Link
          href={caseStudy.href}
          aria-label={`${SELECTED_WORK_CARD_CTA}${SELECTED_WORK_CARD_CTA_SR}`}
          className={`inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline ${FOCUS_RING} rounded-sm`}
        >
          {SELECTED_WORK_CARD_CTA}
          <span aria-hidden className="text-muted transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </article>
  );
};
