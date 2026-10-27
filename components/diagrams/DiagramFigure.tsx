import type { ReactNode } from "react";

import { WRITING_DIAGRAM_OVERLINE } from "data/writing";

interface DiagramFigureProps {
  title: string;
  titleId: string;
  caption?: string;
  hint?: string;
  children: ReactNode;
}

export const DiagramFigure = ({ title, titleId, caption, hint, children }: DiagramFigureProps) => {
  return (
    <figure aria-labelledby={titleId}>
      <div>
        <p>{WRITING_DIAGRAM_OVERLINE}</p>
        <p id={titleId}>{title}</p>
        {hint ? <p>{hint}</p> : null}
      </div>
      {children}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
};
