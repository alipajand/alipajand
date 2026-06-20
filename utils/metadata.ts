import type { Metadata } from "next";

import { ENGINEERING_PRINCIPLES_META_DESCRIPTION } from "data/engineeringPrinciples";
import { NOW_META_DESCRIPTION, NOW_PAGE_TITLE } from "data/now";
import { OPEN_SOURCE_META_DESCRIPTION, OPEN_SOURCE_META_TITLE } from "data/openSourcePage";
import type { Project } from "data/projects";
import { PORTFOLIO_META_DESCRIPTION, PORTFOLIO_META_TITLE } from "data/projects";
import { WRITING_INDEX_DESCRIPTION, WRITING_INDEX_TITLE } from "data/writing";
import { CANONICAL_URL, SITE_NAME, TWITTER_HANDLE } from "data/site";
import type { Post } from "utils/posts";

const defaultOgImage = {
  url: "/opengraph-image" as const,
  width: 1200,
  height: 630,
};

const exactTitle = (title: string): NonNullable<Metadata["title"]> => {
  return { absolute: title };
};

const twitterExtras = (): Partial<NonNullable<Metadata["twitter"]>> => {
  if (!TWITTER_HANDLE) return {};
  const at = `@${TWITTER_HANDLE}`;
  return { creator: at, site: at };
};

export const buildWritingIndexMetadata = (): Metadata => {
  const url = `${CANONICAL_URL}/writing`;
  const title = WRITING_INDEX_TITLE;
  return {
    title: exactTitle(title),
    description: WRITING_INDEX_DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title,
      description: WRITING_INDEX_DESCRIPTION,
      locale: "en_US",
      images: [{ ...defaultOgImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: WRITING_INDEX_DESCRIPTION,
      images: [defaultOgImage.url],
      ...twitterExtras(),
    },
  };
};

export const buildArticleMetadata = (post: Post): Metadata => {
  const { contentHtml: _content, ...p } = post;
  void _content;
  const url = `${CANONICAL_URL}/writing/${p.slug}`;
  const metaTitle = p.seoTitle ?? `${p.title} | ${SITE_NAME}`;
  const socialTitle = p.seoTitle ?? p.title;
  const metaDescription = p.seoDescription ?? p.excerpt;
  const images = [
    {
      url: `/writing/${p.slug}/opengraph-image` as const,
      width: 1200,
      height: 630,
      alt: p.title,
    },
  ];

  return {
    title: exactTitle(metaTitle),
    description: metaDescription,
    alternates: { canonical: url },
    authors: [{ name: SITE_NAME, url: CANONICAL_URL }],
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: socialTitle,
      description: metaDescription,
      locale: "en_US",
      publishedTime: p.date,
      modifiedTime: p.date,
      authors: [SITE_NAME],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: metaDescription,
      images: [`/writing/${p.slug}/opengraph-image`],
      ...twitterExtras(),
    },
  };
};

export const buildPortfolioMetadata = (): Metadata => {
  const url = `${CANONICAL_URL}/portfolio`;
  const title = PORTFOLIO_META_TITLE;
  const description = PORTFOLIO_META_DESCRIPTION;
  return {
    title: exactTitle(title),
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title,
      description,
      locale: "en_US",
      images: [{ ...defaultOgImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage.url],
      ...twitterExtras(),
    },
  };
};

export const buildPortfolioCaseStudyMetadata = (project: Project): Metadata => {
  const url = `${CANONICAL_URL}/portfolio/${project.slug}`;
  const title = project.caseStudyMetaTitle;
  const description = project.caseStudyMetaDescription;
  return {
    title: exactTitle(title),
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title,
      description,
      locale: "en_US",
      images: [{ ...defaultOgImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage.url],
      ...twitterExtras(),
    },
  };
};

export const buildEngineeringPrinciplesMetadata = (): Metadata => {
  const url = `${CANONICAL_URL}/engineering-principles`;
  const title = "Engineering Principles — Ali Pajand · Senior Frontend Engineer";
  const description = ENGINEERING_PRINCIPLES_META_DESCRIPTION;
  return {
    title: exactTitle(title),
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title,
      description,
      locale: "en_US",
      images: [{ ...defaultOgImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage.url],
      ...twitterExtras(),
    },
  };
};

export const buildNowMetadata = (): Metadata => {
  const url = `${CANONICAL_URL}/now`;
  const title = NOW_PAGE_TITLE;
  const description = NOW_META_DESCRIPTION;
  return {
    title: exactTitle(`${title} | ${SITE_NAME}`),
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
};

export const buildOpenSourceMetadata = (): Metadata => {
  const url = `${CANONICAL_URL}/open-source`;
  const title = OPEN_SOURCE_META_TITLE;
  const description = OPEN_SOURCE_META_DESCRIPTION;
  return {
    title: exactTitle(title),
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title,
      description,
      locale: "en_US",
      images: [{ ...defaultOgImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage.url],
      ...twitterExtras(),
    },
  };
};
