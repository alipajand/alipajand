import { notFound } from "next/navigation";

import { ArticleJsonLd } from "components/ArticleJsonLd/ArticleJsonLd";
import { BreadcrumbJsonLd } from "components/BreadcrumbJsonLd/BreadcrumbJsonLd";
import { WritingPostPageContent } from "features/writing/WritingPostPageContent";
import { writingPostBreadcrumbs } from "data/breadcrumbs";
import { CANONICAL_URL } from "data/site";
import { getAllPosts, getPostBySlug } from "utils/posts";
import { splitHtmlAtFirstH2 } from "utils/splitHtmlAtFirstH2";
import { buildArticleMetadata } from "utils/metadata";
import { toBreadcrumbJsonLdItems } from "utils/breadcrumbs";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const MCP_WORKFLOW_DIAGRAM_SLUG = "why-i-automate-code-review-with-mcp";

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

  const showMcpDiagram = post.slug === MCP_WORKFLOW_DIAGRAM_SLUG;

  const { contentHtml, ...postForJsonLd } = post;
  const { before: proseBeforeH2, fromH2: proseFromH2 } = splitHtmlAtFirstH2(contentHtml);

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
        showMcpDiagram={showMcpDiagram}
        contentHtml={contentHtml}
        proseBeforeH2={proseBeforeH2}
        proseFromH2={proseFromH2}
      />
    </>
  );
}
