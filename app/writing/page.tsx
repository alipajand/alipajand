import type { Metadata } from "next";

import { BreadcrumbJsonLd } from "components/BreadcrumbJsonLd/BreadcrumbJsonLd";
import { CollectionPageJsonLd } from "components/CollectionPageJsonLd/CollectionPageJsonLd";
import { WritingIndexPageContent } from "features/writing/WritingIndexPageContent";
import { writingIndexBreadcrumbs } from "data/breadcrumbs";
import { CANONICAL_URL } from "data/site";
import { WRITING_INDEX_COLLECTION_NAME, WRITING_INDEX_DESCRIPTION } from "data/writing";
import { getAllPosts } from "utils/posts";
import { buildWritingIndexMetadata } from "utils/metadata";
import { toBreadcrumbJsonLdItems } from "utils/breadcrumbs";

export const metadata: Metadata = buildWritingIndexMetadata();

export default async function WritingPage() {
  const posts = getAllPosts();
  const pageUrl = `${CANONICAL_URL}/writing`;

  return (
    <>
      <CollectionPageJsonLd
        url={pageUrl}
        id={`${pageUrl}#archive`}
        name={WRITING_INDEX_COLLECTION_NAME}
        description={WRITING_INDEX_DESCRIPTION}
        items={posts.map((post) => ({
          url: `${pageUrl}/${post.slug}`,
          name: post.title,
          description: post.seoDescription ?? post.excerpt,
          type: "Article",
          properties: {
            headline: post.title,
            ...(post.date ? { datePublished: post.date } : {}),
            ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
          },
        }))}
      />
      <BreadcrumbJsonLd items={toBreadcrumbJsonLdItems(writingIndexBreadcrumbs(), pageUrl)} />
      <WritingIndexPageContent posts={posts} />
    </>
  );
}
