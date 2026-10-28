import Link from "next/link";

import { Chev } from "components/hairline/Icons/Icons";
import { OpenSourceCopyButton } from "features/open-source/OpenSourceCopyButton";
import styles from "features/open-source/OpenSourceProjects.module.css";
import {
  OPEN_SOURCE_ARTICLES_LABEL,
  OPEN_SOURCE_CONTRIBUTION_LABEL,
  OPEN_SOURCE_FORMAT_LABEL,
  OPEN_SOURCE_INSTALL_LABEL,
  OPEN_SOURCE_RELEASE_LABEL,
  OPEN_SOURCE_REPOSITORY_LINK_LABEL,
  type OpenSourceProject,
  openSourceInstallAriaLabel,
  openSourceInstallIsSteps,
  openSourceInstallIsYaml,
  openSourceProjectSlug,
  openSourceRepositoryAriaLabel,
} from "data/openSourcePage";

const pad = (index: number) => String(index + 1).padStart(2, "0");

interface OpenSourceProjectEntryProps {
  project: OpenSourceProject;
  index: number;
}

export const OpenSourceProjectEntry = ({ project, index }: OpenSourceProjectEntryProps) => {
  const slug = openSourceProjectSlug(project.title);
  const titleId = `${slug}-t`;
  const installId = `${slug}-install`;
  const steps = openSourceInstallIsSteps(project);
  const plain = steps || openSourceInstallIsYaml(project);

  return (
    <article id={slug} className={styles.project} aria-labelledby={titleId} data-project="">
      <div className={styles.side}>
        <div className={styles.stick}>
          <span className={styles.numeral} aria-hidden="true">
            {pad(index)}
          </span>
          <h3 id={titleId} className={styles.title}>
            {project.title}
          </h3>
          <dl className={styles.meta}>
            <div>
              <dt className={styles.metaLabel}>{OPEN_SOURCE_RELEASE_LABEL}</dt>
              <dd>
                {project.version ? (
                  <>
                    <b>v{project.version}</b> ·{" "}
                  </>
                ) : null}
                {project.releasedOn}
              </dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>{OPEN_SOURCE_FORMAT_LABEL}</dt>
              <dd>{project.format}</dd>
            </div>
          </dl>
          <Link
            className={styles.repo}
            href={project.repositoryUrl}
            aria-label={openSourceRepositoryAriaLabel(project.title)}
          >
            {OPEN_SOURCE_REPOSITORY_LINK_LABEL}
            <Chev />
          </Link>
        </div>
      </div>

      <div className={styles.main}>
        <p className={styles.summary}>{project.summary}</p>

        <div className={styles.block}>
          <div className={styles.blockLabel}>
            <span>{OPEN_SOURCE_INSTALL_LABEL}</span>
            {steps ? null : (
              <OpenSourceCopyButton
                title={project.title}
                text={project.install}
                targetId={installId}
              />
            )}
          </div>
          <pre
            id={installId}
            className={styles.code}
            role="region"
            tabIndex={0}
            aria-label={openSourceInstallAriaLabel(project.title)}
            data-steps={plain ? "" : undefined}
          >
            <code>{project.install}</code>
          </pre>
        </div>

        <div className={styles.block}>
          <p className={styles.blockLabel} id={`${slug}-why`}>
            {project.testedCapabilitiesLabel}
          </p>
          <ul className={styles.why} aria-labelledby={`${slug}-why`}>
            {project.testedCapabilities.map((item, itemIndex) => (
              <li key={item}>
                <span aria-hidden="true">{pad(itemIndex)}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.block}>
          <p className={styles.blockLabel}>{OPEN_SOURCE_CONTRIBUTION_LABEL}</p>
          <p className={styles.demo}>{project.contribution}</p>
        </div>

        {project.articles?.length ? (
          <div className={styles.block}>
            <p className={styles.blockLabel} id={`${slug}-reads`}>
              {OPEN_SOURCE_ARTICLES_LABEL}
            </p>
            <ul className={styles.reads} aria-labelledby={`${slug}-reads`}>
              {project.articles.map((article) => (
                <li key={article.href}>
                  <Link href={article.href}>
                    <span>{article.title}</span>
                    <Chev />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
};
