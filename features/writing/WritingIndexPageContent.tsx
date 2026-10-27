import { Breadcrumbs } from "components/Breadcrumbs/Breadcrumbs";
import type { WritingIndexPost } from "features/writing/WritingIndexPost";
import { WritingIndexPostListItem } from "features/writing/WritingIndexPostListItem";
import { writingIndexBreadcrumbs } from "data/breadcrumbs";
import {
  WRITING_INDEX_EMPTY_MESSAGE,
  WRITING_SECTION_HEADING,
  WRITING_SECTION_LEDE,
  WRITING_WHY_IT_MATTERS,
} from "data/writing";

interface WritingIndexPageContentProps {
  posts: WritingIndexPost[];
}

export const WritingIndexPageContent = ({ posts }: WritingIndexPageContentProps) => {
  return (
    <div>
      <main id="main-content" tabIndex={-1}>
        <div>
          <Breadcrumbs items={writingIndexBreadcrumbs()} />
          <header>
            <h1>{WRITING_SECTION_HEADING}</h1>
            <p>{WRITING_SECTION_LEDE}</p>
            <p>{WRITING_WHY_IT_MATTERS}</p>
          </header>

          {posts.length === 0 ? (
            <p>{WRITING_INDEX_EMPTY_MESSAGE}</p>
          ) : (
            <ul>
              {posts.map((post) => (
                <WritingIndexPostListItem key={post.slug} post={post} />
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};
