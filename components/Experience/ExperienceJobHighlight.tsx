interface ExperienceJobHighlightProps {
  children: string;
}

export function ExperienceJobHighlight({ children }: ExperienceJobHighlightProps) {
  return (
    <li className="flex gap-3 text-muted text-[15px] sm:text-base leading-relaxed">
      <span className="w-5 shrink-0 text-right text-foreground/90 select-none" aria-hidden>
        —
      </span>
      <span className="flex-1 min-w-0">{children}</span>
    </li>
  );
}
