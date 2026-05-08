import Link from "next/link";

import type { WritingPost } from "components/Writing/WritingPost";
import { WritingPostMeta } from "components/Writing/WritingPostMeta";
import { WRITING_FEATURED_LABEL, WRITING_READ_ARTICLE_CTA } from "data/writing";
import { CARD_ACCENT_RAIL, FOCUS_RING, LABEL_OVERLINE } from "utils/visual";

interface WritingFeaturedPostCardProps {
  post: WritingPost;
}

export function WritingFeaturedPostCard({ post }: WritingFeaturedPostCardProps) {
  return (
    <article>
      <Link
        href={`/writing/${encodeURIComponent(post.slug)}`}
        className={`group block rounded-2xl ${CARD_ACCENT_RAIL} p-6 sm:p-8 pl-5 sm:pl-7 ${FOCUS_RING}`}
      >
        <p className={`${LABEL_OVERLINE} mb-3`}>{WRITING_FEATURED_LABEL}</p>
        <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground leading-snug tracking-tight group-hover:text-foreground/90">
          {post.title}
        </h3>
        <WritingPostMeta date={post.date} tags={post.tags} />
        <p className="text-muted text-[15px] sm:text-base mt-4 leading-relaxed ">{post.excerpt}</p>
        <span className="inline-flex mt-5 text-sm font-medium text-foreground underline-offset-4 group-hover:underline group-focus-visible:underline">
          {WRITING_READ_ARTICLE_CTA}
        </span>
      </Link>
    </article>
  );
}
