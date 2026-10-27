import Link from "next/link";

import { Breadcrumbs } from "components/Breadcrumbs/Breadcrumbs";
import { ProjectCardBadge } from "components/Projects/ProjectCardBadge";
import { openSourceBreadcrumbs } from "data/breadcrumbs";
import {
  OPEN_SOURCE_ACTIVITY_HEADING,
  OPEN_SOURCE_ACTIVITY_IMAGE_ALT,
  OPEN_SOURCE_ACTIVITY_IMAGE_SRC,
  OPEN_SOURCE_ACTIVITY_LEDE,
  OPEN_SOURCE_ACTIVITY_PROFILE_HREF,
  OPEN_SOURCE_ACTIVITY_PROFILE_LABEL,
  OPEN_SOURCE_ARTICLES_LABEL,
  OPEN_SOURCE_CONTRIBUTION_LABEL,
  OPEN_SOURCE_CTA_BODY,
  OPEN_SOURCE_CTA_HEADING,
  OPEN_SOURCE_CTA_PRIMARY_HREF,
  OPEN_SOURCE_CTA_PRIMARY_LABEL,
  OPEN_SOURCE_CTA_SECONDARY_HREF,
  OPEN_SOURCE_CTA_SECONDARY_LABEL,
  OPEN_SOURCE_PROJECTS,
  OPEN_SOURCE_PROJECTS_HEADING,
  OPEN_SOURCE_PROJECTS_LEDE,
  OPEN_SOURCE_FORMAT_LABEL,
  OPEN_SOURCE_HEADER_HEADING,
  OPEN_SOURCE_HEADER_INTRO,
  OPEN_SOURCE_HEADER_LEDE,
  OPEN_SOURCE_HEADER_OVERLINE,
  OPEN_SOURCE_INSTALL_LABEL,
  OPEN_SOURCE_INSTALL_NOTE,
  OPEN_SOURCE_RELEASE_LABEL,
  OPEN_SOURCE_REPOSITORY_LINK_LABEL,
  OPEN_SOURCE_SHARED_PRINCIPLES,
  OPEN_SOURCE_SHARED_PRINCIPLES_HEADING,
  OPEN_SOURCE_TECHNOLOGY_BADGES,
  OPEN_SOURCE_TECHNOLOGY_HEADING,
  type OpenSourcePrinciple,
  type OpenSourceProject,
  openSourceReleaseLabel,
  openSourceRepositoryAriaLabel,
} from "data/openSourcePage";

const OpenSourceProjectCard = ({ project }: { project: OpenSourceProject }) => {
  return (
    <article>
      <div>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
      </div>

      <div>
        <div>
          <p>{OPEN_SOURCE_RELEASE_LABEL}</p>
          <p>{openSourceReleaseLabel(project)}</p>
        </div>
        <div>
          <p>{OPEN_SOURCE_FORMAT_LABEL}</p>
          <p>{project.format}</p>
        </div>
      </div>

      <div>
        <p>{project.testedCapabilitiesLabel}</p>
        <ul aria-label={`${project.title} capabilities`}>
          {project.testedCapabilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <p>{OPEN_SOURCE_INSTALL_LABEL}</p>
        <pre>
          <code>{project.install}</code>
        </pre>
      </div>

      <div>
        <p>{OPEN_SOURCE_CONTRIBUTION_LABEL}</p>
        <p>{project.contribution}</p>
      </div>

      {project.articles?.length ? (
        <div>
          <p>{OPEN_SOURCE_ARTICLES_LABEL}</p>
          <ul aria-label={`Writing about ${project.title}`}>
            {project.articles.map((article) => (
              <li key={article.href}>
                <Link href={article.href}>{article.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <Link
          href={project.repositoryUrl}
          aria-label={openSourceRepositoryAriaLabel(project.title)}
        >
          <span>{OPEN_SOURCE_REPOSITORY_LINK_LABEL}</span>
          <span aria-hidden>↗</span>
        </Link>
      </div>
    </article>
  );
};

const OpenSourcePrincipleCard = ({ principle }: { principle: OpenSourcePrinciple }) => {
  return (
    <article>
      <h3>{principle.title}</h3>
      <p>{principle.body}</p>
    </article>
  );
};

export const OpenSourcePageContent = () => {
  return (
    <main id="main-content" tabIndex={-1}>
      <header>
        <div>
          <Breadcrumbs items={openSourceBreadcrumbs()} />
          <p>{OPEN_SOURCE_HEADER_OVERLINE}</p>
          <h1>{OPEN_SOURCE_HEADER_HEADING}</h1>
          <p>{OPEN_SOURCE_HEADER_LEDE}</p>
          <p>{OPEN_SOURCE_HEADER_INTRO}</p>
        </div>
      </header>

      <div>
        <section aria-labelledby="open-source-projects-heading">
          <div>
            <header>
              <h2 id="open-source-projects-heading">{OPEN_SOURCE_PROJECTS_HEADING}</h2>
              <p>{OPEN_SOURCE_PROJECTS_LEDE}</p>
              <p>{OPEN_SOURCE_INSTALL_NOTE}</p>
            </header>

            <ul>
              {OPEN_SOURCE_PROJECTS.map((project) => (
                <li key={project.title} data-open-source-project>
                  <OpenSourceProjectCard project={project} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="open-source-principles-heading">
          <div>
            <header>
              <h2 id="open-source-principles-heading">{OPEN_SOURCE_SHARED_PRINCIPLES_HEADING}</h2>
            </header>

            <ul>
              {OPEN_SOURCE_SHARED_PRINCIPLES.map((principle) => (
                <li key={principle.title} data-open-source-principle>
                  <OpenSourcePrincipleCard principle={principle} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="open-source-technology-heading">
          <div>
            <header>
              <h2 id="open-source-technology-heading">{OPEN_SOURCE_TECHNOLOGY_HEADING}</h2>
            </header>

            <ul aria-label={OPEN_SOURCE_TECHNOLOGY_HEADING}>
              {OPEN_SOURCE_TECHNOLOGY_BADGES.map((badge) => (
                <ProjectCardBadge key={badge}>{badge}</ProjectCardBadge>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="open-source-activity-heading">
          <div>
            <header>
              <h2 id="open-source-activity-heading">{OPEN_SOURCE_ACTIVITY_HEADING}</h2>
              <p>{OPEN_SOURCE_ACTIVITY_LEDE}</p>
            </header>

            <div>
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element -- live external card, not worth proxying */}
                <img
                  src={OPEN_SOURCE_ACTIVITY_IMAGE_SRC}
                  alt={OPEN_SOURCE_ACTIVITY_IMAGE_ALT}
                  width={1200}
                  height={630}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <Link href={OPEN_SOURCE_ACTIVITY_PROFILE_HREF}>
                <span>{OPEN_SOURCE_ACTIVITY_PROFILE_LABEL}</span>
                <span aria-hidden>↗</span>
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="open-source-cta-heading">
          <div>
            <div>
              <h2 id="open-source-cta-heading">{OPEN_SOURCE_CTA_HEADING}</h2>
              <p>{OPEN_SOURCE_CTA_BODY}</p>
              <div>
                <Link href={OPEN_SOURCE_CTA_PRIMARY_HREF}>{OPEN_SOURCE_CTA_PRIMARY_LABEL}</Link>
                <Link href={OPEN_SOURCE_CTA_SECONDARY_HREF}>{OPEN_SOURCE_CTA_SECONDARY_LABEL}</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
