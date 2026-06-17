import { CANONICAL_URL, PERSON_SCHEMA_ID, SITE_NAME } from "data/site";
import { PORTFOLIO_PAGE_HEADER_TITLE } from "data/projects";
import type { Project } from "data/projects";

interface ProjectCaseStudyJsonLdProps {
  project: Project;
}

export const ProjectCaseStudyJsonLd = ({ project }: ProjectCaseStudyJsonLdProps) => {
  const url = `${CANONICAL_URL}/portfolio/${project.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.caseStudyTitle,
    name: `${project.name} Case Study`,
    description: project.caseStudyMetaDescription,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Person",
      "@id": PERSON_SCHEMA_ID,
      name: SITE_NAME,
      url: CANONICAL_URL,
    },
    publisher: {
      "@type": "Person",
      "@id": PERSON_SCHEMA_ID,
      name: SITE_NAME,
      url: CANONICAL_URL,
    },
    isPartOf: {
      "@type": "CollectionPage",
      "@id": `${CANONICAL_URL}/portfolio#case-studies`,
      name: PORTFOLIO_PAGE_HEADER_TITLE,
      url: `${CANONICAL_URL}/portfolio`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
