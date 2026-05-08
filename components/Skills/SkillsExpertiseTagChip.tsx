import { SkillIcon } from "components/Skills/SkillIcon";

interface SkillsExpertiseTagChipProps {
  tag: string;
}

export function SkillsExpertiseTagChip({ tag }: SkillsExpertiseTagChipProps) {
  return (
    <span className="hover-scale inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-card border border-border text-foreground/80 text-xs font-medium hover:border-foreground/50">
      <SkillIcon skill={tag} />
      {tag}
    </span>
  );
}
