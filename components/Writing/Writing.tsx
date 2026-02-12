"use client";

import Link from "next/link";

import { useScrollReveal } from "utils/hooks/useScrollReveal";

export interface WritingPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

export function Writing({ posts }: { posts: WritingPost[] }) {
  const {
    selectors: { sectionRef },
  } = useScrollReveal({ y: 32, stagger: 0.08 });

  if (posts.length === 0) return null;

  return (
    <section
      id="writing"
      ref={sectionRef}
      aria-labelledby="writing-heading"
      className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32 border-t border-border"
    >
      <div className="max-w-4xl mx-auto">
        <h2
          id="writing-heading"
          className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-4"
          data-reveal
        >
          Writing
        </h2>
        <p className="text-muted text-lg mb-12 max-w-xl" data-reveal>
          Notes on design systems, DX, and Frontend.
        </p>
        <ul className="space-y-6" data-reveal>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-xl border border-border bg-card/50 p-6 transition-colors hover:border-foreground/20 hover:bg-card"
              >
                <time dateTime={post.date} className="text-muted text-sm font-medium tabular-nums">
                  {formatDate(post.date)}
                </time>
                <h3 className="font-display font-semibold text-lg sm:text-xl text-foreground mt-2 group-hover:text-muted">
                  {post.title}
                </h3>
                <p className="text-muted text-sm mt-1 line-clamp-2">{post.excerpt}</p>
                <span className="inline-block mt-3 text-sm font-medium text-foreground group-hover:underline">
                  Read more →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10" data-reveal>
          <Link
            href="/blog"
            className="text-sm font-medium text-foreground hover:text-muted transition-colors"
          >
            All posts →
          </Link>
        </p>
      </div>
    </section>
  );
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}
