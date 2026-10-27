import Link from "next/link";

import { EngineeringPrinciplesParagraph } from "features/engineering-principles/EngineeringPrinciplesParagraph";
import {
  ENGINEERING_PRINCIPLES_EVIDENCE_LABEL,
  type EngineeringPrinciplesSection,
} from "data/engineeringPrinciples";

interface EngineeringPrinciplesSectionBlockProps {
  section: EngineeringPrinciplesSection;
  number?: number;
}

export const EngineeringPrinciplesSectionBlock = ({
  section,
  number,
}: EngineeringPrinciplesSectionBlockProps) => {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-heading`}>
      {number ? <p aria-hidden="true">{String(number).padStart(2, "0")}</p> : null}
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      <div>
        {section.paragraphs.map((p, i) => (
          <EngineeringPrinciplesParagraph key={`${section.id}-${i}`}>
            {p}
          </EngineeringPrinciplesParagraph>
        ))}
      </div>
      {section.evidence.length > 0 ? (
        <div>
          <p id={`${section.id}-evidence`}>{ENGINEERING_PRINCIPLES_EVIDENCE_LABEL}</p>
          <ul aria-labelledby={`${section.id}-evidence`}>
            {section.evidence.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
};
