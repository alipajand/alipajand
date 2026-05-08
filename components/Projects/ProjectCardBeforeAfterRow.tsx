import type { BeforeAfter } from "data/projects";

interface ProjectCardBeforeAfterRowProps {
  row: BeforeAfter;
}

export function ProjectCardBeforeAfterRow({ row }: ProjectCardBeforeAfterRowProps) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-background/80 border border-border px-3 py-2 text-sm min-w-0">
      <span className="text-muted shrink-0">{row.label}:</span>
      <span className="text-foreground/60 line-through truncate">{row.before}</span>
      <span className="text-foreground/50 shrink-0" aria-hidden>
        →
      </span>
      <span className="text-foreground font-medium truncate">{row.after}</span>
    </div>
  );
}
