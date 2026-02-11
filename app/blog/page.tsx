import Link from "next/link";

import { getAllPosts } from "lib/posts";
import { SITE_NAME } from "data/site";

export const metadata = {
  title: "Writing",
  description: `Articles and notes by ${SITE_NAME} on design systems, DX, and frontend.`,
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32 mx-auto max-w-4xl">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-2">
          Writing
        </h1>
        <p className="text-muted text-lg mb-16">Notes on design systems, DX, and frontend.</p>

        {posts.length === 0 ? (
          <p className="text-muted">No posts yet. Check back soon.</p>
        ) : (
          <ul className="space-y-10">
            {posts.map((post) => (
              <li key={post.slug}>
                <article>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block rounded-lg border border-border bg-card/50 p-6 transition-colors hover:border-foreground/20 hover:bg-card"
                  >
                    <time
                      dateTime={post.date}
                      className="text-muted text-sm font-medium tabular-nums"
                    >
                      {formatDate(post.date)}
                    </time>
                    <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground mt-2 group-hover:text-muted">
                      {post.title}
                    </h2>
                    <p className="text-muted text-[15px] sm:text-base mt-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <span className="inline-block mt-3 text-sm font-medium text-foreground group-hover:underline">
                      Read more →
                    </span>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-16">
          <Link
            href="/"
            className="text-muted hover:text-foreground transition-colors text-sm font-medium"
          >
            ← Back to home
          </Link>
        </p>
      </div>
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
