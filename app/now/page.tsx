import type { Metadata } from "next";

import { BreadcrumbJsonLd } from "components/BreadcrumbJsonLd/BreadcrumbJsonLd";
import { NowPageContent } from "features/now/NowPageContent";
import { nowBreadcrumbs } from "data/breadcrumbs";
import { CANONICAL_URL } from "data/site";
import { buildNowMetadata } from "utils/metadata";
import { toBreadcrumbJsonLdItems } from "utils/breadcrumbs";

export const metadata: Metadata = buildNowMetadata();

export default function NowPage() {
  const pageUrl = `${CANONICAL_URL}/now`;

  return (
    <>
      <BreadcrumbJsonLd items={toBreadcrumbJsonLdItems(nowBreadcrumbs(), pageUrl)} />
      <NowPageContent />
    </>
  );
}
