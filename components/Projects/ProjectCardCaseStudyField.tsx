interface ProjectCardCaseStudyFieldProps {
  label: string;
  children: string;
}

export function ProjectCardCaseStudyField({ label, children }: ProjectCardCaseStudyFieldProps) {
  return (
    <div className="min-w-0 space-y-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
      <p className="text-sm text-foreground/90 leading-relaxed">{children}</p>
    </div>
  );
}
