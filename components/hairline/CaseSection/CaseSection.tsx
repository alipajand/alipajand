import type { ReactNode } from "react";

import styles from "components/hairline/CaseSection/CaseSection.module.css";

interface CaseSectionProps {
  id: string;
  legacyId?: string;
  index: number;
  title: string;
  children: ReactNode;
}

const pad = (index: number) => String(index + 1).padStart(2, "0");

export const CaseSection = ({ id, legacyId, index, title, children }: CaseSectionProps) => (
  <section id={id} className={styles.section} aria-labelledby={`${id}-heading`}>
    <div className={styles.side}>
      {legacyId ? <span id={legacyId} className={styles.legacyAnchor} aria-hidden="true" /> : null}
      <div className={styles.stick}>
        <span className={styles.number} aria-hidden="true">
          [ {pad(index)} ]
        </span>
        <h2 id={`${id}-heading`} className={styles.title}>
          {title}
        </h2>
      </div>
    </div>
    <div className={styles.main}>{children}</div>
  </section>
);

export const CaseLead = ({ children }: { children: ReactNode }) => (
  <div>
    <p className={styles.lead}>{children}</p>
  </div>
);

interface CaseItemsProps {
  items: readonly string[];
  layout?: "rows" | "cells";
}

export const CaseItems = ({ items, layout = "rows" }: CaseItemsProps) => (
  <div>
    <ol className={layout === "cells" ? styles.cells : styles.items}>
      {items.map((item, index) => (
        <li key={item}>
          <span className={styles.itemNumber} aria-hidden="true">
            {pad(index)}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  </div>
);
