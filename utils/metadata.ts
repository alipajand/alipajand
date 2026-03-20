import type { Metadata } from "next";

import { BLOG_INDEX_DESCRIPTION } from "data/writing";
import {
  CANONICAL_URL,
  PORTFOLIO_PAGE_LEDE,
  SITE_NAME,
  TWITTER_HANDLE,
} from "data/site";
import type { Post } from "utils/posts";

const defaultOgImage = {
  url: "/opengraph-image" as const,
  width: 1200,
  height: 630,
};

function twitterExtras(): Partial<NonNullable<Metadata["twitter"]>> {
  if (!TWITTER_HANDLE) return {};
  const at = `@${TWITTER_HANDLE}`;
  return { creator: at, site: at };
}

/** Blog index (`/blog`) metadata. */
export function buildBlogIndexMetadata(): Metadata {
  const url = `${CANONICAL_URL}/blog`;
  return {
    title: "Writing",
    description: BLOG_INDEX_DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: `Writing · ${SITE_NAME}`,
      description: BLOG_INDEX_DESCRIPTION,
      locale: "en_US",
      images: [{ ...defaultOgImage, alt: `Writing · ${SITE_NAME}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Writing · ${SITE_NAME}`,
      description: BLOG_INDEX_DESCRIPTION,
      images: [defaultOgImage.url],
      ...twitterExtras(),
    },
  };
}

/** Single post (`/blog/[slug]`) metadata. */
export function buildArticleMetadata(post: Post): Metadata {
  const { contentHtml: _content, ...p } = post;
  void _content;
  const url = `${CANONICAL_URL}/blog/${p.slug}`;
  const images = [
    {
      url: `/blog/${p.slug}/opengraph-image` as const,
      width: 1200,
      height: 630,
      alt: p.title,
    },
  ];
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: url },
    authors: [{ name: SITE_NAME, url: CANONICAL_URL }],
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: p.title,
      description: p.excerpt,
      locale: "en_US",
      publishedTime: p.date,
      modifiedTime: p.date,
      authors: [SITE_NAME],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description: p.excerpt,
      images: [`/blog/${p.slug}/opengraph-image`],
      ...twitterExtras(),
    },
  };
}

/** Full portfolio (`/portfolio`) metadata. */
export function buildPortfolioMetadata(): Metadata {
  const url = `${CANONICAL_URL}/portfolio`;
  const title = "Portfolio";
  const description = PORTFOLIO_PAGE_LEDE;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: `${title} · ${SITE_NAME}`,
      description,
      locale: "en_US",
      images: [{ ...defaultOgImage, alt: `${title} · ${SITE_NAME}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${SITE_NAME}`,
      description,
      images: [defaultOgImage.url],
      ...twitterExtras(),
    },
  };
}
