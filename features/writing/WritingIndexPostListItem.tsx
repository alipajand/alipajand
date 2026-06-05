import Link from "next/link";

import type { WritingIndexPost } from "features/writing/WritingIndexPost";
import { formatDate } from "utils/date";
import { WRITING_FEATURED_LABEL, WRITING_READ_ARTICLE_CTA } from "data/writing";

interface WritingIndexPostListItemProps {
  post: WritingIndexPost;
}

export function WritingIndexPostListItem({ post }: WritingIndexPostListItemProps) {
  return (
    <li data-writ-item>
      <article>
        <Link
          href={`/writing/${post.slug}`}
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
          <p className="text-muted text-[15px] sm:text-base mt-3 leading-relaxed">{post.excerpt}</p>
          <span className="inline-flex mt-4 text-sm font-medium text-foreground/90 underline-offset-4 group-hover:underline group-focus-visible:underline">
            {WRITING_READ_ARTICLE_CTA}
          </span>
        </Link>
      </article>
    </li>
  );
}
