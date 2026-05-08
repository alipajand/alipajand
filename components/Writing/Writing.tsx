"use client";

import Link from "next/link";

import type { WritingPost } from "components/Writing/WritingPost";
import { WritingFeaturedPostCard } from "components/Writing/WritingFeaturedPostCard";
import { WritingRecentPostListItem } from "components/Writing/WritingRecentPostListItem";
import { useScrollReveal } from "utils/hooks/useScrollReveal";
import {
  WRITING_ALL_POSTS_CTA,
  WRITING_HOME_ARCHIVE_TEASER,
  WRITING_SECTION_HEADING,
  WRITING_SECTION_LEDE,
  WRITING_WHY_IT_MATTERS,
} from "data/writing";
import {
  SECTION_INNER,
  SECTION_LEDE_LG,
  SECTION_SHELL,
  SECTION_TITLE,
} from "utils/visual";

interface WritingProps {
  featured: WritingPost | null;
  posts: WritingPost[];
}

export function Writing({ featured, posts }: WritingProps) {
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
        <header className="mb-10 sm:mb-12" data-reveal>
          <h2 id="writing-heading" className={`${SECTION_TITLE} mb-4 sm:mb-5`}>
            {WRITING_SECTION_HEADING}
          </h2>
          <p className={SECTION_LEDE_LG}>{WRITING_SECTION_LEDE}</p>
          <p className="mt-4 text-[15px] sm:text-base text-foreground/85 leading-relaxed border-l-2 border-border pl-4 sm:pl-5">
            {WRITING_WHY_IT_MATTERS}
          </p>
        </header>

        <div className="space-y-6 sm:space-y-8">
          {featured ? (
            <div data-reveal>
              <WritingFeaturedPostCard post={featured} />
            </div>
          ) : null}
          {posts.length > 0 ? (
            <ul className="space-y-4 sm:space-y-5 list-none p-0 m-0" data-reveal>
              {posts.map((post) => (
                <WritingRecentPostListItem key={post.slug} post={post} />
              ))}
            </ul>
          ) : null}
        </div>

        <div
          className="mt-12 sm:mt-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          data-reveal
        >
          <p className="text-sm text-muted m-0">{WRITING_HOME_ARCHIVE_TEASER}</p>
          <Link
            href="/writing"
            className="inline-flex w-full sm:w-auto min-h-11 justify-center items-center rounded-lg border border-foreground/20 bg-foreground/[0.06] px-5 py-3 text-sm font-semibold text-foreground hover:bg-foreground/10 hover:border-foreground/35 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {WRITING_ALL_POSTS_CTA}
          </Link>
        </div>
      </div>
    </section>
  );
}
