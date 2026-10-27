import type { CSSProperties } from "react";

import styles from "components/hairline/CompareDiagram/CompareDiagram.module.css";
import {
  DiagramCaption,
  diagramFigureClass,
  DiagramHead,
} from "components/hairline/Diagram/Diagram";
import type { CompareDiagramSpec } from "utils/diagramBlocks";

interface CompareDiagramProps extends Omit<CompareDiagramSpec, "type"> {
  /** Spoken before each item so the marks are not the only signal. */
  rejectedLabel?: string;
  chosenLabel?: string;
}

/**
 * Side-by-side columns where the last column is the chosen approach: its header is lit and its
 * items carry a check; the others are muted with a cross.
 */
export const CompareDiagram = ({
  title,
  caption,
  columns,
  rejectedLabel = "Not chosen",
  chosenLabel = "Chosen",
}: CompareDiagramProps) => (
  <figure className={diagramFigureClass}>
    <DiagramHead title={title} />
    <div className={styles.compare} style={{ "--cols": columns.length } as CSSProperties}>
      {columns.map((column, index) => {
        const chosen = index === columns.length - 1;
        return (
          <div key={column.label} className={chosen ? styles.chosen : undefined}>
            <h4>{column.label}</h4>
            <ul>
              {column.items.map((item) => (
                <li key={item}>
                  <span className={styles.mark} aria-hidden="true">
                    {chosen ? "✓" : "×"}
                  </span>
                  <span className={styles.srOnly}>{chosen ? chosenLabel : rejectedLabel}: </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
    <DiagramCaption caption={caption} />
  </figure>
);
