import { FactsPanel } from "components/hairline/FactsPanel/FactsPanel";
import { Chev } from "components/hairline/Icons/Icons";
import { ScreenshotFrame } from "components/hairline/ScreenshotFrame/ScreenshotFrame";
import { Tags } from "components/hairline/Tags/Tags";
import styles from "features/portfolio/CaseStudyIntro.module.css";
import type { Project } from "data/projects";
import {
  PROJECT_FACT_ROLE_LABEL,
  PROJECT_FACT_STACK_LABEL,
  PROJECT_FACT_TIMEFRAME_LABEL,
  PROJECT_FIGURE_CLOSE_LABEL,
  PROJECT_FIGURE_ENLARGE_LABEL,
  projectLiveLinksAriaLabel,
} from "data/projectsUi";
import { figureHost, hostOf } from "utils/caseStudySections";

const CaseStudyMeta = ({ project }: { project: Project }) => {
  const facts = [
    { term: PROJECT_FACT_ROLE_LABEL, detail: project.role },
    ...(project.timeframe
      ? [{ term: PROJECT_FACT_TIMEFRAME_LABEL, detail: project.timeframe }]
      : []),
    {
      term: PROJECT_FACT_STACK_LABEL,
      detail: <Tags tags={project.capabilityTags} label={`${project.name} stack`} />,
    },
  ];
  return (
    <div className={styles.meta}>
      <FactsPanel facts={facts} stacked={facts.length % 2 === 0} />
      {project.liveLinks.length > 0 ? (
        <ul className={styles.lives} aria-label={projectLiveLinksAriaLabel(project.name)}>
          {project.liveLinks.map((link) => (
            <li key={link.href}>
              <a
                className={styles.live}
                href={link.href}
                rel="noreferrer"
                aria-label={`${link.label} ${hostOf(link.href)}`}
              >
                {link.label} <small>{hostOf(link.href)}</small>
                <Chev />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export const CaseStudyIntro = ({ project }: { project: Project }) => {
  const hero = project.caseStudy.interfaceEvidence?.[0];
  return (
    <section
      id="intro"
      className={hero ? styles.intro : `${styles.intro} ${styles.plain}`}
      aria-labelledby="case-study-title"
    >
      <div className={styles.copy}>
        <p className={styles.over}>{project.employerContext}</p>
        <h2 id="case-study-title" className={styles.title}>
          {project.caseStudyTitle}
        </h2>
        <p className={styles.overview}>{project.caseStudy.overview}</p>
        {hero ? <CaseStudyMeta project={project} /> : null}
      </div>
      <div className={styles.side}>
        {hero?.src ? (
          <ScreenshotFrame
            src={hero.src}
            alt={hero.alt}
            width={hero.width}
            height={hero.height}
            trimTop={hero.trimTop}
            captionLead={hero.captionLead}
            captionBody={hero.captionBody}
            provenance={hero.provenance}
            host={figureHost(project, hero)}
            tilt
            priority
            sizes="(max-width: 760px) 100vw, 58vw"
            enlargeLabel={PROJECT_FIGURE_ENLARGE_LABEL}
            closeLabel={PROJECT_FIGURE_CLOSE_LABEL}
          />
        ) : (
          <CaseStudyMeta project={project} />
        )}
      </div>
    </section>
  );
};
