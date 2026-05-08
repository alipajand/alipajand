interface ProjectCardSignalStackItemProps {
  children: string;
}

export function ProjectCardSignalStackItem({ children }: ProjectCardSignalStackItemProps) {
  return (
    <li>
      <span className="inline-flex items-center rounded-md border border-border bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground/90">
        {children}
      </span>
    </li>
  );
}
