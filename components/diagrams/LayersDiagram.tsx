"use client";

import { useId, useState } from "react";

import { DiagramFigure } from "components/diagrams/DiagramFigure";
import { WRITING_DIAGRAM_LAYERS_HINT } from "data/writing";
import type { LayersDiagramSpec } from "utils/diagramBlocks";

export const LayersDiagram = ({ spec }: { spec: LayersDiagramSpec }) => {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <DiagramFigure
      title={spec.title}
      titleId={`${baseId}-title`}
      caption={spec.caption}
      hint={WRITING_DIAGRAM_LAYERS_HINT}
    >
      <ol aria-labelledby={`${baseId}-title`}>
        {spec.layers.map((layer, index) => {
          const isOpen = open === index;
          const panelId = `${baseId}-layer-${index}`;
          return (
            <li key={`${layer.label}-${index}`}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={layer.detail ? panelId : undefined}
                onClick={() => setOpen(isOpen ? null : index)}
              >
                <span>{layer.label}</span>
                {layer.detail ? <span aria-hidden="true">▾</span> : null}
              </button>
              {layer.detail ? (
                <div id={panelId} hidden={!isOpen}>
                  <p>{layer.detail}</p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </DiagramFigure>
  );
};
