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
  /** 1-based position, drawn as the outlined numeral beside the heading. */
  number: number;
}

/**
 * One principle: a sticky side with the numeral and heading, and the reasoning with the case studies
 * and posts where it shows up. The section is focusable so in-page links land focus on it.
 */
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
