import Image from "next/image";

import type { ProjectFigure as ProjectFigureData } from "data/projects";
import { PROJECT_FIGURE_PLACEHOLDER_LABEL } from "data/projectsUi";

type ProjectFigureProps = {
  figure: ProjectFigureData;
};

export const ProjectFigure = ({ figure }: ProjectFigureProps) => {
  return (
    <figure>
      {figure.type === "image" && figure.src ? (
        <Image
          src={figure.src}
          alt={figure.alt}
          width={figure.width}
          height={figure.height}
          loading="eager"
        />
      ) : figure.type === "image" ? (
        <div aria-hidden="true">{PROJECT_FIGURE_PLACEHOLDER_LABEL}</div>
      ) : null}

      <figcaption>
        <span>{figure.captionLead}</span> {figure.captionBody}
        {figure.disclosureLabel ? <span>{figure.disclosureLabel}</span> : null}
      </figcaption>
    </figure>
  );
};
