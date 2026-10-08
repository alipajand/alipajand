import { notFound } from "next/navigation";

import { ArticleJsonLd } from "components/ArticleJsonLd/ArticleJsonLd";
import { BreadcrumbJsonLd } from "components/BreadcrumbJsonLd/BreadcrumbJsonLd";
import { WritingPostPageContent } from "features/writing/WritingPostPageContent";
import { writingPostBreadcrumbs } from "data/breadcrumbs";
import { CANONICAL_URL } from "data/site";
import { getAllPosts, getPostBySlug } from "utils/posts";
import { buildArticleMetadata } from "utils/metadata";
import { toBreadcrumbJsonLdItems } from "utils/breadcrumbs";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return buildArticleMetadata(post);
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { contentHtml, headings, diagrams, ...postForJsonLd } = post;

  const postUrl = `${CANONICAL_URL}/writing/${post.slug}`;

  return (
    <>
      <ArticleJsonLd post={postForJsonLd} />
      <BreadcrumbJsonLd
        items={toBreadcrumbJsonLdItems(writingPostBreadcrumbs(post.title), postUrl)}
      />
      <WritingPostPageContent
        title={post.title}
        date={post.date}
        contentHtml={contentHtml}
        headings={headings}
        diagrams={diagrams}
      />
    </>
  );
}
