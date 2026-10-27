import styles from "features/writing/WritingPostProse.module.css";
import { WritingPostDiagram } from "features/writing/WritingPostDiagram";
import { proseSegments } from "features/writing/proseHtml";
import { WRITING_TABLE_REGION_LABEL } from "data/writing";
import type { DiagramSpec } from "utils/diagramBlocks";

interface WritingPostProseProps {
  /** Sanitised post HTML from the Markdown pipeline, with heading ids and diagram slots. */
  contentHtml: string;
  diagrams: readonly DiagramSpec[];
  /** `reader` is the standard article; `launch` is the Agent Readiness Doctor article. */
  variant?: "reader" | "launch";
}

/**
 * The article body: Markdown HTML with each ```diagram block rendered as a hairline figure in its
 * place. Sections are numbered "[ 01 ]" by CSS so the numbers always match the contents.
 */
export const WritingPostProse = ({
  contentHtml,
  diagrams,
  variant = "reader",
}: WritingPostProseProps) => (
  <div className={`${styles.prose} ${styles[variant]}`} data-prose="">
    {proseSegments(contentHtml, WRITING_TABLE_REGION_LABEL).map((segment, index) =>
      segment.kind === "html" ? (
        <div
          key={index}
          className={styles.segment}
          dangerouslySetInnerHTML={{ __html: segment.html }}
        />
      ) : diagrams[segment.index] ? (
        <WritingPostDiagram
          key={index}
          spec={diagrams[segment.index]}
          sectionId={segment.sectionId ?? ""}
        />
      ) : null
    )}
  </div>
);
