import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllPosts, getPostBySlug } from "lib/posts";

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
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <article className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-20 py-24">
        <p className="text-muted text-sm font-medium tabular-nums">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground mt-2 mb-6">
          {post.title}
        </h1>
        <div
          className="prose prose-invert prose-neutral max-w-none text-muted text-[15px] sm:text-base leading-relaxed [&_a]:text-foreground [&_a]:underline [&_a:hover]:text-muted [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_hr]:border-border [&_strong]:text-foreground"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
        <p className="mt-16 pt-8 border-t border-border gap-5 flex items-center">
          <Link
            href="/blog"
            className="text-muted hover:text-foreground transition-colors text-sm font-medium"
          >
            ← Back to All posts
          </Link>
          {" · "}
          <Link
            href="/"
            className="text-muted hover:text-foreground transition-colors text-sm font-medium"
          >
            Back to Home
          </Link>
        </p>
      </article>
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}
