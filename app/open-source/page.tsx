import type { Metadata } from "next";

import { BreadcrumbJsonLd } from "components/BreadcrumbJsonLd/BreadcrumbJsonLd";
import { OpenSourcePageContent } from "features/open-source/OpenSourcePageContent";
import { openSourceBreadcrumbs } from "data/breadcrumbs";
import { CANONICAL_URL } from "data/site";
import { buildOpenSourceMetadata } from "utils/metadata";
import { toBreadcrumbJsonLdItems } from "utils/breadcrumbs";

export const metadata: Metadata = buildOpenSourceMetadata();

export default function OpenSourcePage() {
  const pageUrl = `${CANONICAL_URL}/open-source`;

  return (
    <>
      <BreadcrumbJsonLd items={toBreadcrumbJsonLdItems(openSourceBreadcrumbs(), pageUrl)} />
      <OpenSourcePageContent />
    </>
  );
}
