import type { Metadata } from "next";
import Link from "next/link";

import { getAllPosts } from "utils/posts";
import { formatDate } from "utils/date";
import { buildBlogIndexMetadata } from "utils/metadata";
import { WRITING_FEATURED_LABEL, WRITING_SECTION_LEDE, WRITING_WHY_IT_MATTERS } from "data/writing";

export const metadata: Metadata = buildBlogIndexMetadata();

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main
        id="main-content"
        tabIndex={-1}
        className="outline-none px-6 sm:px-10 lg:px-20 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-5xl">
          <header className=" mb-12 sm:mb-16">
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-3">
              Writing
            </h1>
            <p className="text-muted text-base sm:text-lg leading-relaxed">
              {WRITING_SECTION_LEDE}
            </p>
            <p className="mt-4 text-[15px] sm:text-base text-foreground/85 leading-relaxed border-l-2 border-border pl-4 sm:pl-5">
              {WRITING_WHY_IT_MATTERS}
            </p>
          </header>

          {posts.length === 0 ? (
            <p className="text-muted">No posts yet. Check back soon.</p>
          ) : (
            <ul className="space-y-6 sm:space-y-8 list-none p-0 m-0">
              {posts.map((post) => (
                <li key={post.slug}>
                  <article>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group block rounded-xl border border-border bg-card/40 p-5 sm:p-6 transition-colors hover:border-foreground/20 hover:bg-card/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {post.featured ? (
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-2">
                          {WRITING_FEATURED_LABEL}
                        </p>
                      ) : null}
                      <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground leading-snug tracking-tight group-hover:text-foreground/90">
                        {post.title}
                      </h2>
                      <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-muted">
                        <time dateTime={post.date} className="font-medium tabular-nums">
                          {formatDate(post.date)}
                        </time>
                        {post.tags && post.tags.length > 0 ? (
                          <>
                            <span className="text-border select-none" aria-hidden>
                              ·
                            </span>
                            <span className="text-[13px] sm:text-sm text-muted/90">
                              {post.tags.join(" · ")}
                            </span>
                          </>
                        ) : null}
                      </div>
                      <p className="text-muted text-[15px] sm:text-base mt-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <span className="inline-flex mt-4 text-sm font-medium text-foreground/90 underline-offset-4 group-hover:underline group-focus-visible:underline">
                        Read article →
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
              className="text-muted hover:text-foreground transition-colors text-sm font-medium inline-flex min-h-11 items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              ← Back to home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
