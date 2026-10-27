import type { CSSProperties } from "react";

import { DisplayWord } from "components/hairline/DisplayWord/DisplayWord";
import styles from "features/portfolio/CaseStudyDisplayName.module.css";
import { caseStudyDisplayFor } from "data/projectsDisplay";
import type { Project } from "data/projects";

/**
 * The project name as the page's display line, sized from data to fill the row. Assistive
 * technology reads the real name from the heading; the split words around the spark are decoration.
 */
export const CaseStudyDisplayName = ({ project }: { project: Project }) => {
  const display = caseStudyDisplayFor(project.slug, project.name);
  return (
    <div className={styles.name} style={{ "--fit": display.fit } as CSSProperties}>
      <h1 className={styles.srOnly}>{project.name}</h1>
      <div aria-hidden="true">
        <DisplayWord words={display.words} variant="hero" motion="scroll" reach={0.42} />
      </div>
    </div>
  );
};
