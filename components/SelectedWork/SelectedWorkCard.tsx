import Link from "next/link";

import { ProjectCardBadge } from "components/Projects/ProjectCardBadge";
import {
  SELECTED_WORK_CARD_CTA,
  SELECTED_WORK_CARD_CTA_SR,
  SELECTED_WORK_EVIDENCE_LABEL,
  SELECTED_WORK_OWNED_LABEL,
  SELECTED_WORK_PROBLEM_LABEL,
  SELECTED_WORK_ROLE_LABEL,
  SELECTED_WORK_THEMES_LABEL,
  type SelectedWorkItem,
} from "data/selectedWork";
import { FOCUS_RING } from "utils/visual";

const FIELD_LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em] text-muted";

export function SelectedWorkCard({ item }: { item: SelectedWorkItem }) {
  const href = `/portfolio#project-${item.projectId}`;

  return (
    <article className="group flex h-full flex-col gap-5 rounded-xl border border-border/70 bg-card/50 p-6 sm:p-8 transition-colors duration-200 hover:border-foreground/25 hover:bg-card/70">
      {item.themes.length > 0 && (
        <ul
          className="flex flex-wrap gap-2 list-none p-0 m-0"
          aria-label={SELECTED_WORK_THEMES_LABEL}
        >
          {item.themes.map((theme) => (
            <li key={theme}>
              <ProjectCardBadge>{theme}</ProjectCardBadge>
            </li>
          ))}
        </ul>
      )}

      <h3 className="font-display font-semibold text-xl sm:text-2xl text-foreground leading-tight">
        {item.name}
      </h3>

      <div className="space-y-1">
        <p className={FIELD_LABEL}>{SELECTED_WORK_PROBLEM_LABEL}</p>
        <p className="text-muted text-[15px] leading-relaxed">{item.problem}</p>
      </div>

      <div className="space-y-1">
        <p className={FIELD_LABEL}>{SELECTED_WORK_ROLE_LABEL}</p>
        <p className="text-foreground/90 text-sm font-medium leading-relaxed">{item.role}</p>
      </div>

      <div className="space-y-2">
        <p className={FIELD_LABEL}>{SELECTED_WORK_OWNED_LABEL}</p>
        <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
          {item.owned.map((point) => (
            <li
              key={point}
              className="relative pl-4 text-muted text-[15px] leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-foreground/40"
            >
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-1">
        <p className={FIELD_LABEL}>{SELECTED_WORK_EVIDENCE_LABEL}</p>
        <p className="text-foreground/85 text-[15px] leading-relaxed">{item.evidence}</p>
      </div>

      <div className="mt-auto pt-2">
        <Link
          href={href}
          className={`inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline ${FOCUS_RING} rounded-sm`}
        >
          {SELECTED_WORK_CARD_CTA}
          <span aria-hidden className="text-muted transition-transform group-hover:translate-x-0.5">
            →
          </span>
          <span className="sr-only">{SELECTED_WORK_CARD_CTA_SR}</span>
        </Link>
      </div>
    </article>
  );
}
