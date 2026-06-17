import type { Metadata } from "next";

import { BreadcrumbJsonLd } from "components/BreadcrumbJsonLd/BreadcrumbJsonLd";
import { WritingIndexPageContent } from "features/writing/WritingIndexPageContent";
import { writingIndexBreadcrumbs } from "data/breadcrumbs";
import { CANONICAL_URL } from "data/site";
import { getAllPosts } from "utils/posts";
import { buildWritingIndexMetadata } from "utils/metadata";
import { toBreadcrumbJsonLdItems } from "utils/breadcrumbs";

export const metadata: Metadata = buildWritingIndexMetadata();

export default async function WritingPage() {
  const posts = getAllPosts();
  const pageUrl = `${CANONICAL_URL}/writing`;

  return (
    <>
      <BreadcrumbJsonLd items={toBreadcrumbJsonLdItems(writingIndexBreadcrumbs(), pageUrl)} />
      <WritingIndexPageContent posts={posts} />
    </>
  );
}
