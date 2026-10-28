import type { CSSProperties } from "react";

import { DisplayWord } from "components/hairline/DisplayWord/DisplayWord";
import styles from "features/portfolio/CaseStudyDisplayName.module.css";
import { caseStudyDisplayFor } from "data/projectsDisplay";
import type { Project } from "data/projects";
import { legacyTitleId } from "utils/caseStudySections";

export const CaseStudyDisplayName = ({ project }: { project: Project }) => {
  const display = caseStudyDisplayFor(project.slug, project.name);
  return (
    <div
      id={legacyTitleId(project.id)}
      className={styles.name}
      style={{ "--fit": display.fit } as CSSProperties}
    >
      <h1 className={styles.srOnly}>{project.name}</h1>
      <div aria-hidden="true">
        <DisplayWord words={display.words} variant="hero" motion="scroll" reach={0.42} />
      </div>
    </div>
  );
};
