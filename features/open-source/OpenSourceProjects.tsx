import { SectionHead } from "components/hairline/SectionHead/SectionHead";
import { OpenSourceProjectEntry } from "features/open-source/OpenSourceProjectEntry";
import styles from "features/open-source/OpenSourceProjects.module.css";
import { OpenSourceProjectsTracker } from "features/open-source/OpenSourceProjectsTracker";
import {
  OPEN_SOURCE_INSTALL_NOTE,
  OPEN_SOURCE_INSTALL_NOTE_LABEL,
  OPEN_SOURCE_PROJECTS,
  OPEN_SOURCE_PROJECTS_HEADING,
  OPEN_SOURCE_PROJECTS_ID,
  OPEN_SOURCE_PROJECTS_INDEX_ARIA_LABEL,
  OPEN_SOURCE_PROJECTS_LEDE,
  openSourceIndexVersionLabel,
  openSourceProjectSlug,
} from "data/openSourcePage";

const pad = (index: number) => String(index + 1).padStart(2, "0");

export const OpenSourceProjects = () => (
  <section id={OPEN_SOURCE_PROJECTS_ID} aria-labelledby="projects-title">
    <SectionHead
      title={OPEN_SOURCE_PROJECTS_HEADING}
      titleId="projects-title"
      lede={OPEN_SOURCE_PROJECTS_LEDE}
    />
    <OpenSourceProjectsTracker>
      <nav aria-label={OPEN_SOURCE_PROJECTS_INDEX_ARIA_LABEL}>
        <ol className={styles.index}>
          {OPEN_SOURCE_PROJECTS.map((project, index) => (
            <li key={project.title}>
              <a href={`#${openSourceProjectSlug(project.title)}`} data-index-link="">
                <span className={styles.indexNumber}>{pad(index)}</span>
                <span className={styles.indexTitle}>{project.title}</span>
                <span className={styles.indexFormat}>{project.format}</span>
                <span className={styles.indexVersion}>{openSourceIndexVersionLabel(project)}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className={styles.note}>
        <span className={styles.noteLabel}>{OPEN_SOURCE_INSTALL_NOTE_LABEL}</span>
        <p>{OPEN_SOURCE_INSTALL_NOTE}</p>
      </div>
      {OPEN_SOURCE_PROJECTS.map((project, index) => (
        <OpenSourceProjectEntry key={project.title} project={project} index={index} />
      ))}
    </OpenSourceProjectsTracker>
  </section>
);
