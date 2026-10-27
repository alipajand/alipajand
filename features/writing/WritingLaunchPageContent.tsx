import { NextLinks } from "components/hairline/NextLinks/NextLinks";
import { WritingLaunchBack } from "features/writing/WritingLaunchBack";
import { WritingLaunchHeader } from "features/writing/WritingLaunchHeader";
import { WritingLaunchScene } from "features/writing/WritingLaunchScene";
import { WritingPostBody } from "features/writing/WritingPostBody";
import { WritingPostCrumbs } from "features/writing/WritingPostCrumbs";
import type { WritingArticle } from "features/writing/WritingPostPageContent";
import { WRITING_INDEX_NEXT_LABEL, WRITING_INDEX_NEXT_LINKS } from "data/writing";

/**
 * The Agent Readiness Doctor launch article. The text still comes from its Markdown file; the
 * layout adds the refactor scene from the post's own example above the contents and prose.
 */
export const WritingLaunchPageContent = ({ post }: { post: WritingArticle }) => (
  <main id="main-content" tabIndex={-1}>
    <WritingPostCrumbs title={post.title} wrap />
    <article aria-labelledby="post-title">
      <WritingLaunchHeader
        titleId="post-title"
        title={post.title}
        excerpt={post.excerpt}
        date={post.date}
        tags={post.tags}
      />
      <WritingLaunchScene />
      <WritingPostBody
        contentHtml={post.contentHtml}
        headings={post.headings}
        diagrams={post.diagrams}
        variant="launch"
      />
    </article>
    <WritingLaunchBack />
    <NextLinks label={WRITING_INDEX_NEXT_LABEL} links={WRITING_INDEX_NEXT_LINKS} />
  </main>
);
