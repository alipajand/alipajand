import { SectionHead } from "components/hairline/SectionHead/SectionHead";
import { WritingPostFilters } from "features/writing/WritingPostFilters";
import type { TopicLane, WritingListPost } from "features/writing/writingModel";
import { WRITING_ALL_POSTS_HEADING } from "data/writing";

interface WritingIndexPostsProps {
  posts: readonly WritingListPost[];
  lanes: readonly TopicLane[];
}

export const WritingIndexPosts = ({ posts, lanes }: WritingIndexPostsProps) => (
  <section id="posts" aria-labelledby="posts-title">
    <SectionHead title={WRITING_ALL_POSTS_HEADING} titleId="posts-title" />
    <WritingPostFilters posts={posts} lanes={lanes} />
  </section>
);
