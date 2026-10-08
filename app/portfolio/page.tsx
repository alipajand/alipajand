import type { Metadata } from "next";

import { BreadcrumbJsonLd } from "components/BreadcrumbJsonLd/BreadcrumbJsonLd";
import { CollectionPageJsonLd } from "components/CollectionPageJsonLd/CollectionPageJsonLd";
import { PortfolioPageContent } from "features/portfolio/PortfolioPageContent";
import { portfolioIndexBreadcrumbs } from "data/breadcrumbs";
import { PORTFOLIO_META_DESCRIPTION, PORTFOLIO_META_TITLE } from "data/projects";
import { CANONICAL_URL } from "data/site";
import { buildPortfolioMetadata } from "utils/metadata";
import { toBreadcrumbJsonLdItems } from "utils/breadcrumbs";
import { getDedicatedCaseStudyProjects } from "utils/projects";

export const metadata: Metadata = buildPortfolioMetadata();

export default function PortfolioPage() {
  const pageUrl = `${CANONICAL_URL}/portfolio`;

  return (
    <>
      <CollectionPageJsonLd
        url={pageUrl}
        id={`${pageUrl}#case-studies`}
        name={PORTFOLIO_META_TITLE}
        description={PORTFOLIO_META_DESCRIPTION}
        items={getDedicatedCaseStudyProjects().map((project) => ({
          url: `${pageUrl}/${project.slug}`,
          name: project.caseStudyTitle,
          description: project.caseStudyMetaDescription,
          type: "Article",
          properties: { keywords: project.capabilityTags.join(", ") },
        }))}
      />
      <BreadcrumbJsonLd items={toBreadcrumbJsonLdItems(portfolioIndexBreadcrumbs(), pageUrl)} />
      <PortfolioPageContent />
    </>
  );
}
