import Link from "next/link";

import type { WritingIndexPost } from "features/writing/WritingIndexPost";
import { formatDate } from "utils/date";
import {
  WRITING_FEATURED_LABEL,
  WRITING_READ_ARTICLE_CTA,
  WRITING_UPCOMING_LABEL,
  WRITING_PREVIEW_ARTICLE_CTA,
} from "data/writing";

interface WritingIndexPostListItemProps {
  post: WritingIndexPost;
}

export const WritingIndexPostListItem = ({ post }: WritingIndexPostListItemProps) => {
  return (
    <li>
      <article>
        <Link href={`/writing/${post.slug}`}>
          {post.upcoming ? <p>{WRITING_UPCOMING_LABEL}</p> : null}
          {post.featured && !post.upcoming ? <p>{WRITING_FEATURED_LABEL}</p> : null}
          <h2>{post.title}</h2>
          <div>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.tags && post.tags.length > 0 ? (
              <>
                <span aria-hidden>·</span>
                <span>{post.tags.join(" · ")}</span>
              </>
            ) : null}
          </div>
          <p>{post.excerpt}</p>
          <span>{post.upcoming ? WRITING_PREVIEW_ARTICLE_CTA : WRITING_READ_ARTICLE_CTA}</span>
        </Link>
      </article>
    </li>
  );
};
