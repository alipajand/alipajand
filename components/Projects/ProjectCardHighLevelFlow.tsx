import {
  PROJECT_CARD_HIGH_LEVEL_FLOW_ARIA,
  PROJECT_CARD_HIGH_LEVEL_FLOW_LABEL,
} from "data/projectsUi";

interface ProjectCardHighLevelFlowProps {
  steps: string[];
}

export function ProjectCardHighLevelFlow({ steps }: ProjectCardHighLevelFlowProps) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
        {PROJECT_CARD_HIGH_LEVEL_FLOW_LABEL}
      </p>
      <ol
        className="flex flex-wrap items-center gap-x-2 gap-y-2 list-none p-0 m-0"
        aria-label={PROJECT_CARD_HIGH_LEVEL_FLOW_ARIA}
      >
        {steps.map((step, index) => (
          <li key={step} className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md border border-border bg-background/80 px-2.5 py-1 text-[13px] font-medium text-foreground/90">
              {step}
            </span>
            {index < steps.length - 1 ? (
              <span aria-hidden className="select-none text-muted/70">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
