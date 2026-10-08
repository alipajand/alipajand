import classNames from "classnames";
import { useId } from "react";

import { DiagramFigure } from "components/diagrams/DiagramFigure";
import type { CompareDiagramSpec } from "utils/diagramBlocks";

export const CompareDiagram = ({ spec }: { spec: CompareDiagramSpec }) => {
  const baseId = useId();
  const lastIndex = spec.columns.length - 1;

  return (
    <DiagramFigure title={spec.title} titleId={`${baseId}-title`} caption={spec.caption}>
      <div
        className={classNames(
          "grid gap-3",
          spec.columns.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {spec.columns.map((column, index) => (
          <section
            key={`${column.label}-${index}`}
            aria-label={column.label}
            className={classNames(
              "rounded-lg border p-4 transition-colors duration-200 hover:border-foreground/30",
              index === lastIndex ? "border-[var(--organic-orange)]/60" : "border-border/70"
            )}
          >
            <p className="font-display text-sm font-semibold text-foreground">{column.label}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {column.items.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-snug text-muted">
                  <span
                    aria-hidden="true"
                    className={classNames(
                      "mt-[0.45rem] size-1.5 shrink-0 rounded-full",
                      index === lastIndex ? "bg-[var(--organic-orange)]" : "bg-muted/60"
                    )}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </DiagramFigure>
  );
};
