import { useId } from "react";

import { DiagramFigure } from "components/diagrams/DiagramFigure";
import type { CompareDiagramSpec } from "utils/diagramBlocks";

export const CompareDiagram = ({ spec }: { spec: CompareDiagramSpec }) => {
  const baseId = useId();

  return (
    <DiagramFigure title={spec.title} titleId={`${baseId}-title`} caption={spec.caption}>
      <div>
        {spec.columns.map((column, index) => (
          <section key={`${column.label}-${index}`} aria-label={column.label}>
            <p>{column.label}</p>
            <ul>
              {column.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </DiagramFigure>
  );
};
