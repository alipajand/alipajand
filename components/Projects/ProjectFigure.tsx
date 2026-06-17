"use client";

import Image from "next/image";
import { useId } from "react";

import { ProjectIllustrativeScreen } from "components/Projects/ProjectIllustrativeScreen";
import type { ProjectFigure as ProjectFigureData } from "data/projects";

type ProjectFigureProps = {
  figure: ProjectFigureData;
  compact?: boolean;
};

export const ProjectFigure = ({ figure, compact = false }: ProjectFigureProps) => {
  const figureId = useId();
  const titleId = `figure-title-${figureId}`;
  const descId = `figure-desc-${figureId}`;
  return (
    <figure className={compact ? "space-y-2" : "space-y-3"}>
      <div
        className={`overflow-hidden rounded-2xl border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] ${compact ? "" : "lg:-mx-4 xl:-mx-8"}`}
      >
        {figure.type === "image" && figure.src ? (
          <Image
            src={figure.src}
            alt={figure.alt}
            width={figure.width}
            height={figure.height}
            className="h-auto w-full"
            sizes={
              compact ? "(max-width: 1024px) 100vw, 520px" : "(max-width: 1024px) 100vw, 960px"
            }
          />
        ) : (
          <div
            style={{ aspectRatio: `${figure.width} / ${figure.height}` }}
            className="w-full bg-background"
          >
            <ProjectIllustrativeScreen
              titleId={titleId}
              descId={descId}
              variant={figure.illustrationVariant ?? "emplifi"}
            />
          </div>
        )}
      </div>
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
