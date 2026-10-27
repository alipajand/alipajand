import Link from "next/link";

import { Chev } from "components/hairline/Icons/Icons";
import styles from "features/now/NowSnapshot.module.css";
import type { NowSection } from "data/now";

interface NowSectionBlockProps {
  section: NowSection;
  /** 1-based position shown as the cell's mono index. */
  position: number;
}

/** One numbered snapshot cell: index, heading, dash list and an optional link out. */
export const NowSectionBlock = ({ section, position }: NowSectionBlockProps) => {
  const headingId = `now-${section.id}-heading`;

  return (
    <li id={section.id} className={styles.cell}>
      <section aria-labelledby={headingId} className={styles.cellInner}>
        <span className={styles.cellIndex} aria-hidden="true">
          [ {String(position).padStart(2, "0")} ]
        </span>
        <h2 id={headingId} className={styles.cellHeading}>
          {section.title}
        </h2>
        <ul>
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {section.footer ? (
          <Link className={styles.cellLink} href={section.footer.href}>
            {section.footer.label}
            <Chev />
          </Link>
        ) : (
          <span />
        )}
      </section>
    </li>
  );
};
