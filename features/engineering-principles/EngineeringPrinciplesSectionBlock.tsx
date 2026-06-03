import { EngineeringPrinciplesParagraph } from "features/engineering-principles/EngineeringPrinciplesParagraph";
import type { EngineeringPrinciplesSection } from "data/engineeringPrinciples";

interface EngineeringPrinciplesSectionBlockProps {
  section: EngineeringPrinciplesSection;
}

export function EngineeringPrinciplesSectionBlock({
  section,
}: EngineeringPrinciplesSectionBlockProps) {
  return (
    <section aria-labelledby={`${section.id}-heading`}>
      <h2
        id={`${section.id}-heading`}
        className="font-display font-semibold text-xl sm:text-2xl text-foreground tracking-tight"
      >
        {section.title}
      </h2>
      <div className="mt-4 space-y-4">
        {section.paragraphs.map((p, i) => (
          <EngineeringPrinciplesParagraph key={`${section.id}-${i}`}>
            {p}
          </EngineeringPrinciplesParagraph>
        ))}
      </div>
    </section>
  );
}
