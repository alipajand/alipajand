import Link from "next/link";
import type { ReactNode } from "react";

import { Chev } from "components/hairline/Icons/Icons";
import styles from "components/hairline/SectionHead/SectionHead.module.css";

export interface SectionAction {
  href: string;
  label: string;
}

interface SectionHeadProps {
  title: string;
  titleId: string;
  /** Muted copy beside the title. Pass several paragraphs as an array. */
  lede?: string | readonly string[];
  /** A short mono note beside the title, such as a count. */
  note?: string;
  action?: SectionAction;
}

const ActionLink = ({ action }: { action: SectionAction }) => (
  <Link className={styles.action} href={action.href}>
    {action.label}
    <Chev />
  </Link>
);

/**
 * A section's header row: an uppercase display title with an optional lede, note or link. When a
 * lede and a link are both given, the link sits under the lede on the right.
 */
export const SectionHead = ({ title, titleId, lede, note, action }: SectionHeadProps) => {
  const paragraphs = lede === undefined ? [] : typeof lede === "string" ? [lede] : lede;

  return (
    <div className={styles.head}>
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      {paragraphs.length > 0 ? (
        <div className={styles.aside}>
          <div className={styles.lede}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {action ? <ActionLink action={action} /> : null}
        </div>
      ) : null}
      {note ? <p className={styles.note}>{note}</p> : null}
      {action && paragraphs.length === 0 ? <ActionLink action={action} /> : null}
    </div>
  );
};

interface SectionFootProps {
  /** A mono count such as "2 of 7 case studies". */
  count: ReactNode;
  action: SectionAction;
}

/** The slim row closing a section: a count on the left and a link to the full index. */
export const SectionFoot = ({ count, action }: SectionFootProps) => (
  <div className={`${styles.head} ${styles.foot}`}>
    <span className={styles.count}>{count}</span>
    <ActionLink action={action} />
  </div>
);
