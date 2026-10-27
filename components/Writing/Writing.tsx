import Link from "next/link";

import type { WritingPost } from "components/Writing/WritingPost";
import { WritingFeaturedPostCard } from "components/Writing/WritingFeaturedPostCard";
import { WritingRecentPostListItem } from "components/Writing/WritingRecentPostListItem";

import {
  WRITING_ALL_POSTS_CTA,
  WRITING_SECTION_HEADING,
  WRITING_SECTION_LEDE,
  WRITING_WHY_IT_MATTERS,
} from "data/writing";

interface WritingProps {
  featured: WritingPost | null;
  posts: WritingPost[];
  heading?: string;
}

export const Writing = ({ featured, posts, heading = WRITING_SECTION_HEADING }: WritingProps) => {
  if (!featured && posts.length === 0) return null;
  return (
    <section id="writing" aria-labelledby="writing-heading">
      <div>
        <header>
          <h2 id="writing-heading">{heading}</h2>
          <p>{WRITING_SECTION_LEDE}</p>
          <p>{WRITING_WHY_IT_MATTERS}</p>
        </header>

        <div>
          {featured ? <WritingFeaturedPostCard post={featured} /> : null}
          {posts.length > 0 ? (
            <ul>
              {posts.map((post) => (
                <WritingRecentPostListItem key={post.slug} post={post} />
              ))}
            </ul>
          ) : null}
        </div>

        <div>
          <Link href="/writing">{WRITING_ALL_POSTS_CTA}</Link>
        </div>
      </div>
    </section>
  );
};
