import Link from "next/link";

import { CaseSection } from "components/hairline/CaseSection/CaseSection";
import { Chev } from "components/hairline/Icons/Icons";
import styles from "features/portfolio/CaseStudyRelated.module.css";
import type { ProjectLink } from "data/projects";
import { projectRelatedKind, projectRelatedLinksAriaLabel } from "data/projectsUi";
import { type CaseSectionModel, hostOf } from "utils/caseStudySections";

interface CaseStudyRelatedProps {
  projectName: string;
  section: CaseSectionModel & { body: Extract<CaseSectionModel["body"], { kind: "related" }> };
  index: number;
}

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
      rel="noreferrer"
      aria-label={`${link.label} ${host}`}
    >
      <span>
        <small>{link.label}</small> {host}
      </span>
      <Chev />
    </a>
  );
};

export const CaseStudyRelated = ({ projectName, section, index }: CaseStudyRelatedProps) => (
  <CaseSection id={section.id} legacyId={section.legacyId} index={index} title={section.title}>
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
