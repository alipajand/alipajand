import Link from "next/link";

import type { WritingPost } from "components/Writing/WritingPost";
import { WritingPostMeta } from "components/Writing/WritingPostMeta";
import { WRITING_FEATURED_LABEL, WRITING_READ_ARTICLE_CTA } from "data/writing";

interface WritingFeaturedPostCardProps {
  post: WritingPost;
}

export const WritingFeaturedPostCard = ({ post }: WritingFeaturedPostCardProps) => {
  return (
    <article>
      <Link href={`/writing/${encodeURIComponent(post.slug)}`}>
        <p>{WRITING_FEATURED_LABEL}</p>
        <h3>{post.title}</h3>
        <WritingPostMeta date={post.date} tags={post.tags} />
        <p>{post.excerpt}</p>
        <span>{WRITING_READ_ARTICLE_CTA}</span>
      </Link>
    </article>
  );
};
