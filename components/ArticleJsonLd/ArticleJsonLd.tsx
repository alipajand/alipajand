import { CANONICAL_URL, PERSON_SCHEMA_ID, SITE_NAME } from "data/site";
import type { Post } from "utils/posts";

interface ArticleJsonLdProps {
  post: Omit<Post, "contentHtml">;
}

/** BlogPosting JSON-LD for article pages (`/blog/[slug]`). */
export function ArticleJsonLd({ post }: ArticleJsonLdProps) {
  const url = `${CANONICAL_URL}/blog/${post.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
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
    image: [`${CANONICAL_URL}/opengraph-image`],
    isPartOf: {
      "@type": "Blog",
      "@id": `${CANONICAL_URL}/blog#blog`,
      name: `Writing · ${SITE_NAME}`,
      url: `${CANONICAL_URL}/blog`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
