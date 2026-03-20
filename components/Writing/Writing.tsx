"use client";

import Link from "next/link";

import { useScrollReveal } from "utils/hooks/useScrollReveal";
import { formatDate } from "utils/date";
import {
  WRITING_ALL_POSTS_CTA,
  WRITING_FEATURED_LABEL,
  WRITING_SECTION_LEDE,
  WRITING_WHY_IT_MATTERS,
} from "data/writing";
import {
  CARD_ACCENT_RAIL,
  CARD_SURFACE_HOVER,
  FOCUS_RING,
  LABEL_OVERLINE,
  SECTION_INNER,
  SECTION_LEDE_LG,
  SECTION_SHELL,
  SECTION_TITLE,
} from "utils/visual";

export interface WritingPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  featured?: boolean;
  tags?: string[];
}

function PostMeta({ date, tags }: { date: string; tags?: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-muted">
      <time dateTime={date} className="font-medium tabular-nums">
        {formatDate(date)}
      </time>
      {tags && tags.length > 0 ? (
        <>
          <span className="text-border select-none" aria-hidden>
            ·
          </span>
          <span className="text-[13px] sm:text-sm text-muted/90">{tags.join(" · ")}</span>
        </>
      ) : null}
    </div>
  );
}

function FeaturedPostCard({ post }: { post: WritingPost }) {
  return (
    <article>
      <Link
        href={`/blog/${post.slug}`}
        className={`group block rounded-2xl ${CARD_ACCENT_RAIL} p-6 sm:p-8 pl-5 sm:pl-7 ${FOCUS_RING}`}
      >
        <p className={`${LABEL_OVERLINE} mb-3`}>{WRITING_FEATURED_LABEL}</p>
        <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground leading-snug tracking-tight group-hover:text-foreground/90">
          {post.title}
        </h3>
        <PostMeta date={post.date} tags={post.tags} />
        <p className="text-muted text-[15px] sm:text-base mt-4 leading-relaxed max-w-2xl">{post.excerpt}</p>
        <span className="inline-flex mt-5 text-sm font-medium text-foreground underline-offset-4 group-hover:underline group-focus-visible:underline">
          Read article →
        </span>
      </Link>
    </article>
  );
}

function RecentPostCard({ post }: { post: WritingPost }) {
  return (
    <article>
      <Link
        href={`/blog/${post.slug}`}
        className={`group block ${CARD_SURFACE_HOVER} p-5 sm:p-6 ${FOCUS_RING}`}
      >
        <h3 className="font-display font-semibold text-xl sm:text-2xl text-foreground leading-snug tracking-tight group-hover:text-foreground/90">
          {post.title}
        </h3>
        <PostMeta date={post.date} tags={post.tags} />
        <p className="text-muted text-[15px] mt-3 leading-relaxed line-clamp-2">{post.excerpt}</p>
        <span className="inline-flex mt-4 text-sm font-medium text-foreground/90 underline-offset-4 group-hover:underline group-focus-visible:underline">
          Read article →
        </span>
      </Link>
    </article>
  );
}

export function Writing({ featured, posts }: { featured: WritingPost | null; posts: WritingPost[] }) {
  const {
    selectors: { sectionRef },
  } = useScrollReveal({ y: 32, stagger: 0.08 });

  if (!featured && posts.length === 0) return null;

  return (
    <section
      id="writing"
      ref={sectionRef}
      aria-labelledby="writing-heading"
      className={SECTION_SHELL}
    >
      <div className={SECTION_INNER}>
        <header className="max-w-2xl mb-10 sm:mb-12" data-reveal>
          <h2 id="writing-heading" className={`${SECTION_TITLE} mb-4 sm:mb-5`}>
            Writing
          </h2>
          <p className={SECTION_LEDE_LG}>{WRITING_SECTION_LEDE}</p>
          <p className="mt-4 text-[15px] sm:text-base text-foreground/85 leading-relaxed border-l-2 border-border pl-4 sm:pl-5">
            {WRITING_WHY_IT_MATTERS}
          </p>
        </header>

        <div className="space-y-6 sm:space-y-8">
          {featured ? (
            <div data-reveal>
              <FeaturedPostCard post={featured} />
            </div>
          ) : null}
          {posts.length > 0 ? (
            <ul className="space-y-4 sm:space-y-5 list-none p-0 m-0" data-reveal>
              {posts.map((post) => (
                <li key={post.slug}>
                  <RecentPostCard post={post} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="mt-12 sm:mt-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" data-reveal>
          <p className="text-sm text-muted m-0">More essays and notes on the archive.</p>
          <Link
            href="/blog"
            className="inline-flex w-full sm:w-auto min-h-11 justify-center items-center rounded-lg border border-foreground/20 bg-foreground/[0.06] px-5 py-3 text-sm font-semibold text-foreground hover:bg-foreground/10 hover:border-foreground/35 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {WRITING_ALL_POSTS_CTA}
          </Link>
        </div>
      </div>
    </section>
  );
}
