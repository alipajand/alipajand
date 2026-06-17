"use client";

import Image from "next/image";

import type { ProjectFigure as ProjectFigureData } from "data/projects";

type ProjectFigureProps = {
  figure: ProjectFigureData;
  compact?: boolean;
};

export const ProjectFigure = ({ figure, compact = false }: ProjectFigureProps) => {
  return (
    <figure className={compact ? "space-y-2" : "space-y-3"}>
      {figure.type === "image" && figure.src ? (
        <Image
          src={figure.src}
          alt={figure.alt}
          width={figure.width}
          height={figure.height}
          className="h-auto w-full overflow-hidden rounded-2xl border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]"
        />
      ) : null}
      <figcaption className="max-w-3xl text-sm leading-relaxed text-muted">
        <span className="font-semibold text-foreground">{figure.captionLead}</span>{" "}
        {figure.captionBody}
        {figure.disclosureLabel ? (
          <span className="mt-1 block text-muted/95">{figure.disclosureLabel}</span>
        ) : null}
      </figcaption>
    </figure>
  );
};
