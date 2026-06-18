"use client";

import type { ProjectTechnicalHighlight } from "data/projects";
import { CARD_SURFACE, LABEL_OVERLINE } from "utils/visual";

export const ProjectHighlightCard = ({ highlight }: { highlight: ProjectTechnicalHighlight }) => {
  return (
    <article className={`${CARD_SURFACE} p-5 sm:p-6`}>
      <div className="space-y-2">
        <p className={LABEL_OVERLINE}>{highlight.title}</p>
        <p className="text-[15px] leading-relaxed text-muted">{highlight.description}</p>
      </div>
    </article>
  );
};
