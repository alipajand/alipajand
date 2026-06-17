import { CANONICAL_URL, PERSON_SCHEMA_ID, SITE_NAME } from "data/site";
import { WRITING_INDEX_COLLECTION_NAME } from "data/writing";
import type { Post } from "utils/posts";

interface ArticleJsonLdProps {
  post: Omit<Post, "contentHtml">;
}

export const ArticleJsonLd = ({ post }: ArticleJsonLdProps) => {
  const url = `${CANONICAL_URL}/writing/${post.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
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
    image: [`${CANONICAL_URL}/writing/${post.slug}/opengraph-image`],
    isPartOf: {
      "@type": "CollectionPage",
      "@id": `${CANONICAL_URL}/writing#archive`,
      name: `${WRITING_INDEX_COLLECTION_NAME} | ${SITE_NAME}`,
      url: `${CANONICAL_URL}/writing`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
