import { SkillsExpertiseTagChip } from "components/Skills/SkillsExpertiseTagChip";
import type { ExpertiseArea } from "data/expertise";

interface SkillsExpertiseAreaProps {
  area: ExpertiseArea;
}

export function SkillsExpertiseArea({ area }: SkillsExpertiseAreaProps) {
  return (
    <div data-reveal className="space-y-3">
      <h3 className="font-display font-semibold text-foreground text-lg">{area.title}</h3>
      <p className="text-muted text-[15px] sm:text-base leading-relaxed">{area.sentence}</p>
      <div className="flex flex-wrap gap-2">
        {area.tags.map((tag) => (
          <SkillsExpertiseTagChip key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
}
