"use client";

import type { KeyboardEvent } from "react";
import { useId, useRef, useState } from "react";

import { DiagramFigure } from "components/diagrams/DiagramFigure";
import {
  WRITING_DIAGRAM_FLOW_HINT,
  WRITING_DIAGRAM_NEXT_LABEL,
  WRITING_DIAGRAM_PREV_LABEL,
  writingDiagramStepCounter,
} from "data/writing";
import type { FlowDiagramSpec } from "utils/diagramBlocks";

export const FlowDiagram = ({ spec }: { spec: FlowDiagramSpec }) => {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const total = spec.steps.length;
  const current = spec.steps[active];

  const select = (index: number, focus = false) => {
    const next = Math.min(total - 1, Math.max(0, index));
    setActive(next);
    if (focus) stepRefs.current[next]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLOListElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowDown: active + 1,
      ArrowLeft: active - 1,
      ArrowUp: active - 1,
      Home: 0,
      End: total - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key], true);
  };

  return (
    <DiagramFigure
      title={spec.title}
      titleId={`${baseId}-title`}
      caption={spec.caption}
      hint={WRITING_DIAGRAM_FLOW_HINT}
    >
      <ol aria-labelledby={`${baseId}-title`} onKeyDown={handleKeyDown}>
        {spec.steps.map((step, index) => {
          const isActive = index === active;
          return (
            <li key={`${step.label}-${index}`}>
              <button
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                type="button"
                aria-pressed={isActive}
                aria-controls={`${baseId}-panel`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(index)}
              >
                <span aria-hidden="true">{index + 1}</span>
                <span>{step.label}</span>
              </button>
              {index < total - 1 ? <span aria-hidden="true">↓</span> : null}
            </li>
          );
        })}
      </ol>

      {spec.loop ? (
        <p>
          <span aria-hidden="true">↺</span>
          {spec.loop}
        </p>
      ) : null}

      <div id={`${baseId}-panel`} aria-live="polite">
        <p>{writingDiagramStepCounter(active + 1, total)}</p>
        <p>{current.label}</p>
        {current.detail ? <p>{current.detail}</p> : null}
        <div>
          <button type="button" onClick={() => select(active - 1)} disabled={active === 0}>
            ← {WRITING_DIAGRAM_PREV_LABEL}
          </button>
          <button type="button" onClick={() => select(active + 1)} disabled={active === total - 1}>
            {WRITING_DIAGRAM_NEXT_LABEL} →
          </button>
        </div>
      </div>
    </DiagramFigure>
  );
};
