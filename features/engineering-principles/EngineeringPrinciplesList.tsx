import type { CSSProperties } from "react";

import styles from "features/engineering-principles/EngineeringPrinciplesList.module.css";
import { EngineeringPrinciplesSectionBlock } from "features/engineering-principles/EngineeringPrinciplesSectionBlock";
import { PrinciplesTracker } from "features/engineering-principles/PrinciplesTracker";
import {
  ENGINEERING_PRINCIPLES_SECTIONS,
  ENGINEERING_PRINCIPLES_TOC_ARIA_LABEL,
} from "data/engineeringPrinciples";

const pad = (index: number) => String(index + 1).padStart(2, "0");
const ROWS = Math.ceil(ENGINEERING_PRINCIPLES_SECTIONS.length / 2);
const LAST = ENGINEERING_PRINCIPLES_SECTIONS.length - 1;

/**
 * The index of principles (two columns, filled top to bottom) followed by one boxed row per
 * principle. The principle on screen is lit here and in the index.
 */
export const EngineeringPrinciplesList = () => (
  <PrinciplesTracker>
    <nav id="principles" aria-label={ENGINEERING_PRINCIPLES_TOC_ARIA_LABEL}>
      <ol className={styles.index} style={{ "--rows": ROWS } as CSSProperties}>
        {ENGINEERING_PRINCIPLES_SECTIONS.map((section, index) => (
          <li
            key={section.id}
            data-column={index < ROWS ? "first" : "second"}
            data-column-end={index === ROWS - 1 || index === LAST ? "" : undefined}
          >
            <a href={`#${section.id}`} data-index-link="">
              <span className={styles.indexNumber}>{pad(index)}</span>
              <span>{section.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
    {ENGINEERING_PRINCIPLES_SECTIONS.map((section, index) => (
      <EngineeringPrinciplesSectionBlock key={section.id} section={section} number={index + 1} />
    ))}
  </PrinciplesTracker>
);
