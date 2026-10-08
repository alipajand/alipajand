import type { ReactNode } from "react";

import { WRITING_DIAGRAM_OVERLINE } from "data/writing";
import { LABEL_OVERLINE } from "utils/visual";

interface DiagramFigureProps {
  title: string;
  titleId: string;
  caption?: string;
  hint?: string;
  children: ReactNode;
}

export const DiagramFigure = ({ title, titleId, caption, hint, children }: DiagramFigureProps) => {
  return (
    <figure
      aria-labelledby={titleId}
      className="not-prose my-10 rounded-xl border border-border/70 bg-card p-4 sm:p-6"
    >
      <div className="mb-5 flex flex-col gap-1">
        <p className={LABEL_OVERLINE}>{WRITING_DIAGRAM_OVERLINE}</p>
        <p id={titleId} className="font-display text-base font-semibold text-foreground">
          {title}
        </p>
        {hint ? <p className="text-xs text-muted">{hint}</p> : null}
      </div>
      {children}
      {caption ? (
        <figcaption className="mt-5 border-t border-border/70 pt-4 text-sm leading-snug text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
};
