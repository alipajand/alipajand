interface ProjectCardBadgeProps {
  children: string;
}

export function ProjectCardBadge({ children }: ProjectCardBadgeProps) {
  return (
    <li>
      <span className="inline-flex items-center rounded border border-border/80 bg-background/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        {children}
      </span>
    </li>
  );
}
