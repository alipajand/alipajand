import Link from "next/link";

import { SectionHead } from "components/hairline/SectionHead/SectionHead";
import { Tags } from "components/hairline/Tags/Tags";
import styles from "features/portfolio/PortfolioWorks.module.css";
import { PORTFOLIO_GROUPS, portfolioWorksNote } from "data/portfolioIndex";
import type { Project } from "data/projects";
import { getDedicatedCaseStudyProjects } from "utils/projects";

const MAX_TAGS = 5;
const pad = (index: number) => String(index + 1).padStart(2, "0");

const roleLines = (project: Project) => [
  ...project.role.split(" / "),
  ...(project.timeframe ? [project.timeframe.replace("–", " — ")] : []),
];

const firstYear = (projects: Project[]) =>
  Math.min(...projects.flatMap((p) => p.timeframe?.match(/\d{4}/g) ?? []).map(Number));

const WorkRow = ({ project, index }: { project: Project; index: number }) => (
  <li id={`project-${project.id}`} className={styles.work}>
    <span className={styles.index} aria-hidden="true">
      [{pad(index)}]
    </span>
    <h3 className={styles.name}>
      <Link href={`/portfolio/${project.slug}`} className={styles.link}>
        {project.name}
        <span className={styles.title}>{project.caseStudyTitle}</span>
      </Link>
    </h3>
    <div className={styles.body}>
      <p className={styles.summary}>{project.cardProblem}</p>
      <Tags tags={project.capabilityTags.slice(0, MAX_TAGS)} label={`${project.name} tags`} />
    </div>
    <p className={styles.role}>
      {roleLines(project).map((line) => (
        <span key={line}>{line}</span>
      ))}
    </p>
    <span className={styles.go} aria-hidden="true">
      <svg viewBox="0 0 54 22" focusable="false">
        <path d="M2 2 L11 11 L2 20 M16 2 L25 11 L16 20 M30 2 L39 11 L30 20" />
      </svg>
    </span>
  </li>
);

export const PortfolioWorks = () => {
  const projects = getDedicatedCaseStudyProjects();
  const groups = PORTFOLIO_GROUPS.map((group, index) => {
    const start = PORTFOLIO_GROUPS.slice(0, index).reduce(
      (sum, previous) => sum + previous.size,
      0
    );
    return { ...group, start, projects: projects.slice(start, start + group.size) };
  }).filter((group) => group.projects.length > 0);

  return (
    <section id="case-studies" aria-labelledby="case-studies-heading">
      <SectionHead
        title="Case studies"
        titleId="case-studies-heading"
        note={portfolioWorksNote(projects.length, firstYear(projects))}
      />
      {groups.map((group) => (
        <div key={group.label}>
          <p className={styles.group}>
            <span>{group.label}</span>
            <span className={styles.rule} aria-hidden="true">
              ××××××××××××
            </span>
            <span>[{group.projects.length}]</span>
          </p>
          <ol className={styles.list} start={group.start + 1}>
            {group.projects.map((project, index) => (
              <WorkRow key={project.id} project={project} index={group.start + index} />
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
};
