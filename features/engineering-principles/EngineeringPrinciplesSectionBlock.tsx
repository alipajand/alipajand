import Link from "next/link";

import { Chev } from "components/hairline/Icons/Icons";
import styles from "features/engineering-principles/EngineeringPrinciplesList.module.css";
import {
  ENGINEERING_PRINCIPLES_EVIDENCE_LABEL,
  type EngineeringPrinciplesSection,
  engineeringPrinciplesEvidenceKind,
} from "data/engineeringPrinciples";

interface EngineeringPrinciplesSectionBlockProps {
  section: EngineeringPrinciplesSection;
  number: number;
}

export const EngineeringPrinciplesSectionBlock = ({
  section,
  number,
}: EngineeringPrinciplesSectionBlockProps) => (
  <section
    id={section.id}
    className={styles.principle}
    aria-labelledby={`${section.id}-heading`}
    tabIndex={-1}
    data-principle=""
  >
    <div className={styles.side}>
      <div className={styles.stick}>
        <span className={styles.numeral} aria-hidden="true">
          {String(number).padStart(2, "0")}
        </span>
        <h2 id={`${section.id}-heading`} className={styles.heading}>
          {section.title}
        </h2>
      </div>
    </div>
    <div className={styles.body}>
      <div className={styles.text}>
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {section.evidence.length > 0 ? (
        <div className={styles.evidence}>
          <p id={`${section.id}-evidence`} className={styles.evidenceLabel}>
            {ENGINEERING_PRINCIPLES_EVIDENCE_LABEL}
          </p>
          <ul aria-labelledby={`${section.id}-evidence`}>
            {section.evidence.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>
                  <span>{link.label}</span>
                  <small>{engineeringPrinciplesEvidenceKind(link.href)}</small>
                  <Chev />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  </section>
);
