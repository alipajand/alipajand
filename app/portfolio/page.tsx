import type { Metadata } from "next";

import { BreadcrumbJsonLd } from "components/BreadcrumbJsonLd/BreadcrumbJsonLd";
import { PortfolioPageContent } from "features/portfolio/PortfolioPageContent";
import { portfolioIndexBreadcrumbs } from "data/breadcrumbs";
import { CANONICAL_URL } from "data/site";
import { buildPortfolioMetadata } from "utils/metadata";
import { toBreadcrumbJsonLdItems } from "utils/breadcrumbs";

export const metadata: Metadata = buildPortfolioMetadata();

export default function PortfolioPage() {
  const pageUrl = `${CANONICAL_URL}/portfolio`;

  return (
    <>
      <BreadcrumbJsonLd items={toBreadcrumbJsonLdItems(portfolioIndexBreadcrumbs(), pageUrl)} />
      <PortfolioPageContent />
    </>
  );
}
