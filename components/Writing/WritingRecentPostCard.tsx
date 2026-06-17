import Link from "next/link";

import type { WritingPost } from "components/Writing/WritingPost";
import { WritingPostMeta } from "components/Writing/WritingPostMeta";
import { WRITING_READ_ARTICLE_CTA } from "data/writing";
import { CARD_SURFACE_HOVER, FOCUS_RING } from "utils/visual";

interface WritingRecentPostCardProps {
  post: WritingPost;
}

export const WritingRecentPostCard = ({ post }: WritingRecentPostCardProps) => {
  return (
    <article>
      <Link
        href={`/writing/${post.slug}`}
        className={`group block ${CARD_SURFACE_HOVER} p-5 sm:p-6 ${FOCUS_RING}`}
      >
        <h3 className="font-display font-semibold text-xl sm:text-2xl text-foreground leading-snug tracking-tight group-hover:text-foreground/90">
          {post.title}
        </h3>
        <WritingPostMeta date={post.date} tags={post.tags} />
        <p className="text-muted text-[15px] mt-3 leading-relaxed line-clamp-2">{post.excerpt}</p>
        <span className="inline-flex mt-4 text-sm font-medium text-foreground/90 underline-offset-4 group-hover:underline group-focus-visible:underline">
          {WRITING_READ_ARTICLE_CTA}
        </span>
      </Link>
    </article>
  );
};
