import type { WritingPost } from "components/Writing/WritingPost";
import { WritingRecentPostCard } from "components/Writing/WritingRecentPostCard";

interface WritingRecentPostListItemProps {
  post: WritingPost;
}

export const WritingRecentPostListItem = ({ post }: WritingRecentPostListItemProps) => {
  return (
    <li>
      <WritingRecentPostCard post={post} />
    </li>
  );
};
