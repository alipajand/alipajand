import type { ReactNode } from "react";

import styles from "components/hairline/CaseSection/CaseSection.module.css";

interface CaseSectionProps {
  id: string;
  /** Zero-based position, shown as "[ 01 ]". */
  index: number;
  title: string;
  /** Each child becomes one ruled row in the main column. */
  children: ReactNode;
}

const pad = (index: number) => String(index + 1).padStart(2, "0");

/** A numbered case-study chapter: a sticky title column beside ruled content rows. */
export const CaseSection = ({ id, index, title, children }: CaseSectionProps) => (
  <section id={id} className={styles.section} aria-labelledby={`${id}-heading`}>
    <div className={styles.side}>
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

/** The opening paragraph of a section, set larger. Its row spans the column; the text keeps its measure. */
export const CaseLead = ({ children }: { children: ReactNode }) => (
  <div>
    <p className={styles.lead}>{children}</p>
  </div>
);

interface CaseItemsProps {
  items: readonly string[];
  /** `rows` is a numbered list; `cells` is a two-column grid whose last item spans the row. */
  layout?: "rows" | "cells";
}

/** Numbered points inside a section. */
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
