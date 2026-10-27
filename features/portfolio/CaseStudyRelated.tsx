import Link from "next/link";

import { CaseSection } from "components/hairline/CaseSection/CaseSection";
import { Chev } from "components/hairline/Icons/Icons";
import styles from "features/portfolio/CaseStudyRelated.module.css";
import { EXTERNAL_LINK_NEW_TAB_HINT } from "data/pageChrome";
import type { ProjectLink } from "data/projects";
import { projectRelatedKind, projectRelatedLinksAriaLabel } from "data/projectsUi";
import { type CaseSectionModel, hostOf } from "utils/caseStudySections";

interface CaseStudyRelatedProps {
  projectName: string;
  section: CaseSectionModel & { body: Extract<CaseSectionModel["body"], { kind: "related" }> };
  index: number;
}

/** An internal page shows its kind over its title; an external one shows its label over its host. */
const RelatedLink = ({ link }: { link: ProjectLink }) => {
  if (link.href.startsWith("/")) {
    return (
      <Link href={link.href} className={styles.link}>
        <span>
          <small>{projectRelatedKind(link.href)}</small>
          {link.label}
        </span>
        <Chev />
      </Link>
    );
  }
  const host = hostOf(link.href);
  return (
    <a
      href={link.href}
      className={styles.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${link.label} (${host})${EXTERNAL_LINK_NEW_TAB_HINT}`}
    >
      <span>
        <small>{link.label}</small>
        {host}
      </span>
      <Chev />
    </a>
  );
};

/** Related work: writing and pages about the project, then its live links. */
export const CaseStudyRelated = ({ projectName, section, index }: CaseStudyRelatedProps) => (
  <CaseSection id={section.id} index={index} title={section.title}>
    <div>
      <ul className={styles.related} aria-label={projectRelatedLinksAriaLabel(projectName)}>
        {section.body.links.map((link) => (
          <li key={link.href}>
            <RelatedLink link={link} />
          </li>
        ))}
      </ul>
    </div>
  </CaseSection>
);
