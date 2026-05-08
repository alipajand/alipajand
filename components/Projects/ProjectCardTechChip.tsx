interface ProjectCardTechChipProps {
  children: string;
}

export function ProjectCardTechChip({ children }: ProjectCardTechChipProps) {
  return (
    <span className="inline-flex px-2 py-0.5 rounded border border-border/80 text-foreground/70 text-xs">
      {children}
    </span>
  );
}
