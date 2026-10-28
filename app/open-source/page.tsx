import type { Metadata } from "next";

import { BreadcrumbJsonLd } from "components/BreadcrumbJsonLd/BreadcrumbJsonLd";
import { CollectionPageJsonLd } from "components/CollectionPageJsonLd/CollectionPageJsonLd";
import { OpenSourcePageContent } from "features/open-source/OpenSourcePageContent";
import { openSourceBreadcrumbs } from "data/breadcrumbs";
import {
  OPEN_SOURCE_META_DESCRIPTION,
  OPEN_SOURCE_META_TITLE,
  OPEN_SOURCE_PROJECTS,
} from "data/openSourcePage";
import { CANONICAL_URL } from "data/site";
import { buildOpenSourceMetadata } from "utils/metadata";
import { toBreadcrumbJsonLdItems } from "utils/breadcrumbs";
import { getContributionSnapshot } from "utils/githubContributions";

export const metadata: Metadata = buildOpenSourceMetadata();

// Regenerate every 6 hours so the contribution calendar ends at the latest day GitHub reports.
// Keep in step with CONTRIBUTIONS_REVALIDATE_SECONDS; route config has to be a literal.
export const revalidate = 21600;

export default async function OpenSourcePage() {
  const activity = await getContributionSnapshot();
  const pageUrl = `${CANONICAL_URL}/open-source`;

  return (
    <>
      <CollectionPageJsonLd
        url={pageUrl}
        name={OPEN_SOURCE_META_TITLE}
        description={OPEN_SOURCE_META_DESCRIPTION}
        items={OPEN_SOURCE_PROJECTS.map((project) => ({
          url: project.repositoryUrl,
          name: project.title,
          description: project.summary,
          type: "SoftwareSourceCode",
          properties: {
            codeRepository: project.repositoryUrl,
            programmingLanguage: "TypeScript",
            runtimePlatform: "Node.js",
            softwareVersion: project.version,
          },
        }))}
      />
      <BreadcrumbJsonLd items={toBreadcrumbJsonLdItems(openSourceBreadcrumbs(), pageUrl)} />
      <OpenSourcePageContent activity={activity} />
    </>
  );
}
