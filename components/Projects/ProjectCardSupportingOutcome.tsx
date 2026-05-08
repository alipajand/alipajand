interface ProjectCardSupportingOutcomeProps {
  children: string;
}

export function ProjectCardSupportingOutcome({ children }: ProjectCardSupportingOutcomeProps) {
  return (
    <li className="flex gap-2 text-sm text-foreground/90 leading-relaxed">
      <span className="text-foreground/50 shrink-0" aria-hidden>
        —
      </span>
      <span>{children}</span>
    </li>
  );
}
