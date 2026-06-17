import type { Metadata } from "next";

import { BreadcrumbJsonLd } from "components/BreadcrumbJsonLd/BreadcrumbJsonLd";
import { EngineeringPrinciplesPageContent } from "features/engineering-principles/EngineeringPrinciplesPageContent";
import { engineeringPrinciplesBreadcrumbs } from "data/breadcrumbs";
import { CANONICAL_URL } from "data/site";
import { buildEngineeringPrinciplesMetadata } from "utils/metadata";
import { toBreadcrumbJsonLdItems } from "utils/breadcrumbs";

export const metadata: Metadata = buildEngineeringPrinciplesMetadata();

export default function EngineeringPrinciplesPage() {
  const pageUrl = `${CANONICAL_URL}/engineering-principles`;

  return (
    <>
      <BreadcrumbJsonLd
        items={toBreadcrumbJsonLdItems(engineeringPrinciplesBreadcrumbs(), pageUrl)}
      />
      <EngineeringPrinciplesPageContent />
    </>
  );
}
