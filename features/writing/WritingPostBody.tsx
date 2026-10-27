import styles from "features/writing/WritingPostBody.module.css";
import { WritingPostProse } from "features/writing/WritingPostProse";
import { WritingPostToc } from "features/writing/WritingPostToc";
import {
  WRITING_ARTICLE_TOC_EYEBROW,
  WRITING_LAUNCH_TOC_EYEBROW,
  WRITING_TOC_ARIA_LABEL,
} from "data/writing";
import type { DiagramSpec } from "utils/diagramBlocks";
import type { PostHeading } from "utils/headings";

interface WritingPostBodyProps {
  contentHtml: string;
  headings: readonly PostHeading[];
  diagrams: readonly DiagramSpec[];
  variant?: "reader" | "launch";
}

/** The sticky contents beside the article text. */
export const WritingPostBody = ({
  contentHtml,
  headings,
  diagrams,
  variant = "reader",
}: WritingPostBodyProps) => (
  <div className={`${styles.body} ${styles[variant]}`}>
    <WritingPostToc
      headings={headings}
      label={WRITING_TOC_ARIA_LABEL}
      eyebrow={variant === "launch" ? WRITING_LAUNCH_TOC_EYEBROW : WRITING_ARTICLE_TOC_EYEBROW}
      variant={variant}
    />
    <WritingPostProse contentHtml={contentHtml} diagrams={diagrams} variant={variant} />
  </div>
);
