import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleJsonLd } from "components/ArticleJsonLd/ArticleJsonLd";
import { getAllPosts, getPostBySlug } from "utils/posts";
import { formatDate } from "utils/date";
import { buildArticleMetadata } from "utils/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return buildArticleMetadata(post);
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { contentHtml: _html, ...postForJsonLd } = post;
  void _html;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main id="main-content" tabIndex={-1} className="outline-none px-6 sm:px-10 lg:px-20 py-24">
        <ArticleJsonLd post={postForJsonLd} />
        <article className="max-w-6xl mx-auto">
          <p className="text-muted text-sm font-medium tabular-nums">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground mt-2 mb-6">
            {post.title}
          </h1>
          <div
            className="prose prose-invert prose-neutral max-w-none text-muted text-[15px] sm:text-base leading-relaxed [&_a]:text-foreground [&_a]:underline [&_a:hover]:text-muted [&_a:focus-visible]:outline-none [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-foreground [&_a:focus-visible]:ring-offset-2 [&_a:focus-visible]:ring-offset-background [&_a:focus-visible]:rounded-sm [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_hr]:border-border [&_strong]:text-foreground"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
          <p className="mt-16 pt-8 border-t border-border gap-5 flex flex-wrap items-center">
            <Link
              href="/blog"
              className="text-muted hover:text-foreground transition-colors text-sm font-medium inline-flex min-h-11 items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              ← Back to All posts
            </Link>
            <span className="text-muted select-none" aria-hidden>
              ·
            </span>
            <Link
              href="/"
              className="text-muted hover:text-foreground transition-colors text-sm font-medium inline-flex min-h-11 items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Back to Home
            </Link>
          </p>
        </article>
      </main>
    </div>
  );
}
