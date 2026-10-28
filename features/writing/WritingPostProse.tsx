import styles from "features/writing/WritingPostProse.module.css";
import { WritingPostDiagram } from "features/writing/WritingPostDiagram";
import { proseSegments } from "features/writing/proseHtml";
import { WRITING_CODE_REGION_LABEL, WRITING_TABLE_REGION_LABEL } from "data/writing";
import type { DiagramSpec } from "utils/diagramBlocks";

const PROSE_LABELS = { table: WRITING_TABLE_REGION_LABEL, code: WRITING_CODE_REGION_LABEL };

interface WritingPostProseProps {
  contentHtml: string;
  diagrams: readonly DiagramSpec[];
  variant?: "reader" | "launch";
}

export const WritingPostProse = ({
  contentHtml,
  diagrams,
  variant = "reader",
}: WritingPostProseProps) => (
  <div className={`${styles.prose} ${styles[variant]}`} data-prose="">
    {proseSegments(contentHtml, PROSE_LABELS).map((segment, index) =>
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
