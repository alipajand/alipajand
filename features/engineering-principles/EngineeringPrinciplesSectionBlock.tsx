import Link from "next/link";

import { EngineeringPrinciplesParagraph } from "features/engineering-principles/EngineeringPrinciplesParagraph";
import {
  ENGINEERING_PRINCIPLES_EVIDENCE_LABEL,
  type EngineeringPrinciplesSection,
} from "data/engineeringPrinciples";
import { FOCUS_RING, LABEL_OVERLINE } from "utils/visual";

interface EngineeringPrinciplesSectionBlockProps {
  section: EngineeringPrinciplesSection;
  number?: number;
}

export const EngineeringPrinciplesSectionBlock = ({
  section,
  number,
}: EngineeringPrinciplesSectionBlockProps) => {
  return (
    <section
      data-reveal
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      className="scroll-mt-24"
    >
      {number ? (
        <p aria-hidden="true" className={`${LABEL_OVERLINE} mb-2 tabular-nums`}>
          {String(number).padStart(2, "0")}
        </p>
      ) : null}
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
      {section.evidence.length > 0 ? (
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <p id={`${section.id}-evidence`} className={LABEL_OVERLINE}>
            {ENGINEERING_PRINCIPLES_EVIDENCE_LABEL}
          </p>
          <ul aria-labelledby={`${section.id}-evidence`} className="flex flex-wrap gap-2">
            {section.evidence.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`inline-flex min-h-9 items-center rounded-full border border-border px-3 text-sm text-foreground/85 transition-colors hover:border-foreground/35 hover:text-foreground ${FOCUS_RING}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
};
