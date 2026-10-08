"use client";

import classNames from "classnames";
import { useId, useState } from "react";

import { DiagramFigure } from "components/diagrams/DiagramFigure";
import { WRITING_DIAGRAM_LAYERS_HINT } from "data/writing";
import type { LayersDiagramSpec } from "utils/diagramBlocks";
import { FOCUS_RING } from "utils/visual";

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
      <ol aria-labelledby={`${baseId}-title`} className="flex flex-col gap-1.5">
        {spec.layers.map((layer, index) => {
          const isOpen = open === index;
          const panelId = `${baseId}-layer-${index}`;
          return (
            <li
              key={`${layer.label}-${index}`}
              className={classNames(
                "rounded-lg border transition-colors duration-200",
                isOpen ? "border-[var(--organic-orange)] bg-foreground/[0.05]" : "border-border/70"
              )}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={layer.detail ? panelId : undefined}
                onClick={() => setOpen(isOpen ? null : index)}
                className={classNames(
                  "flex w-full min-h-11 items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors",
                  FOCUS_RING,
                  isOpen ? "text-foreground" : "text-muted hover:text-foreground"
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    "h-5 w-1 shrink-0 rounded-full transition-colors",
                    isOpen ? "bg-[var(--organic-orange)]" : "bg-border"
                  )}
                />
                <span className="flex-1">{layer.label}</span>
                {layer.detail ? (
                  <span
                    aria-hidden="true"
                    className={classNames(
                      "text-xs transition-transform duration-200 motion-reduce:transition-none",
                      isOpen && "rotate-180"
                    )}
                  >
                    ▾
                  </span>
                ) : null}
              </button>
              {layer.detail ? (
                <div id={panelId} hidden={!isOpen} className="px-4 pb-3.5 pl-12">
                  <p className="text-sm leading-relaxed text-muted">{layer.detail}</p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </DiagramFigure>
  );
};
