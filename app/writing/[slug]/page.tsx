import { notFound } from "next/navigation";

import { ArticleJsonLd } from "components/ArticleJsonLd/ArticleJsonLd";
import { BreadcrumbJsonLd } from "components/BreadcrumbJsonLd/BreadcrumbJsonLd";
import { WritingLaunchPageContent } from "features/writing/WritingLaunchPageContent";
import { WritingPostPageContent } from "features/writing/WritingPostPageContent";
import { writingPostBreadcrumbs } from "data/breadcrumbs";
import { CANONICAL_URL } from "data/site";
import { WRITING_LAUNCH_ARTICLES } from "data/writing";
import { currentTime } from "utils/clock";
import { getGeneratedPostSlugs, getPublishedPosts, getRoutablePost } from "utils/posts";
import { isPreview } from "utils/publication";
import { buildArticleMetadata } from "utils/metadata";
import { toBreadcrumbJsonLdItems } from "utils/breadcrumbs";
import type { Metadata } from "next";

/** Only the generated slugs exist; any other slug is a 404 that is neither rendered nor cached. */
export const dynamicParams = false;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getGeneratedPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const now = currentTime();
  const post = getRoutablePost(slug, now);
  if (!post) return { title: "Not found" };
  return buildArticleMetadata(post, { preview: isPreview(post, now) });
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const now = currentTime();
  const post = getRoutablePost(slug, now);
  if (!post) notFound();
  // A preview is unlisted: no structured data, and it is not among the posts it lists.
  const preview = isPreview(post, now);

  const { contentHtml, headings, diagrams, ...postForJsonLd } = post;

  const postUrl = `${CANONICAL_URL}/writing/${post.slug}`;
  const article = {
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    tags: post.tags ?? [],
    contentHtml,
    headings,
    diagrams,
  };

  return (
    <>
      {preview ? null : (
        <>
          <ArticleJsonLd post={postForJsonLd} />
          <BreadcrumbJsonLd
            items={toBreadcrumbJsonLdItems(writingPostBreadcrumbs(post.title), postUrl)}
          />
        </>
      )}
      {WRITING_LAUNCH_ARTICLES.includes(post.slug) ? (
        <WritingLaunchPageContent post={article} />
      ) : (
        <WritingPostPageContent
          post={article}
          posts={getPublishedPosts(now).map(({ slug: postSlug, title, date }) => ({
            slug: postSlug,
            title,
            date,
          }))}
        />
      )}
    </>
  );
}
