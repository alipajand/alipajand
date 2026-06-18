"use client";

import Image from "next/image";

import type { ProjectFigure as ProjectFigureData } from "data/projects";
import { PROJECT_FIGURE_PLACEHOLDER_LABEL } from "data/projectsUi";

type ProjectFigureProps = {
  figure: ProjectFigureData;
};

export const ProjectFigure = ({ figure }: ProjectFigureProps) => {
  return (
    <figure className="space-y-2">
      {figure.type === "image" && figure.src ? (
        <Image
          src={figure.src}
          alt={figure.alt}
          width={figure.width}
          height={figure.height}
          className="h-auto w-full"
        />
      ) : figure.type === "image" ? (
        <div
          aria-hidden="true"
          className="flex aspect-3456/2234 w-full items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/30 text-sm text-muted"
        >
          {PROJECT_FIGURE_PLACEHOLDER_LABEL}
        </div>
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
