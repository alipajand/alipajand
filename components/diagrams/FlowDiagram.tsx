"use client";

import classNames from "classnames";
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
import { FOCUS_RING, LABEL_OVERLINE } from "utils/visual";

const NAV_BUTTON = `inline-flex min-h-9 items-center rounded-md border border-border px-3 text-xs font-medium text-foreground transition-colors hover:border-foreground/35 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border ${FOCUS_RING}`;

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
      <ol
        aria-labelledby={`${baseId}-title`}
        onKeyDown={handleKeyDown}
        className="flex flex-col gap-1 sm:flex-row sm:items-stretch sm:gap-0"
      >
        {spec.steps.map((step, index) => {
          const isActive = index === active;
          const isDone = index < active;
          return (
            <li
              key={`${step.label}-${index}`}
              className="flex flex-col items-stretch sm:min-w-0 sm:flex-1 sm:flex-row sm:items-center"
            >
              <button
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                type="button"
                aria-pressed={isActive}
                aria-controls={`${baseId}-panel`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(index)}
                className={classNames(
                  "group flex w-full min-h-11 items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors duration-200 sm:h-full sm:flex-col sm:items-start sm:gap-2",
                  FOCUS_RING,
                  isActive
                    ? "border-[var(--organic-orange)] bg-foreground/[0.06] text-foreground"
                    : "border-border/70 text-muted hover:border-foreground/30 hover:text-foreground"
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums transition-colors",
                    isActive
                      ? "border-[var(--organic-orange)] bg-[var(--organic-orange)] text-white"
                      : isDone
                        ? "border-foreground/40 text-foreground"
                        : "border-border text-muted"
                  )}
                >
                  {index + 1}
                </span>
                <span className="text-sm font-medium leading-snug">{step.label}</span>
              </button>
              {index < total - 1 ? (
                <span
                  aria-hidden="true"
                  className={classNames(
                    "self-center px-1 text-sm leading-none transition-colors sm:px-1.5",
                    isDone ? "text-foreground" : "text-muted/60"
                  )}
                >
                  <span className="sm:hidden">↓</span>
                  <span className="hidden sm:inline">→</span>
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>

      {spec.loop ? (
        <p className="mt-3 flex items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted">
          <span aria-hidden="true" className="text-foreground">
            ↺
          </span>
          {spec.loop}
        </p>
      ) : null}

      <div
        id={`${baseId}-panel`}
        aria-live="polite"
        className="mt-4 rounded-lg bg-foreground/[0.04] px-4 py-4 sm:px-5"
      >
        <p className={LABEL_OVERLINE}>{writingDiagramStepCounter(active + 1, total)}</p>
        <p className="mt-1 font-display text-[15px] font-semibold text-foreground">
          {current.label}
        </p>
        {current.detail ? (
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{current.detail}</p>
        ) : null}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className={NAV_BUTTON}
            onClick={() => select(active - 1)}
            disabled={active === 0}
          >
            ← {WRITING_DIAGRAM_PREV_LABEL}
          </button>
          <button
            type="button"
            className={NAV_BUTTON}
            onClick={() => select(active + 1)}
            disabled={active === total - 1}
          >
            {WRITING_DIAGRAM_NEXT_LABEL} →
          </button>
        </div>
      </div>
    </DiagramFigure>
  );
};
