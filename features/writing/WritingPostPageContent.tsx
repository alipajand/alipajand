import { NextLinks } from "components/hairline/NextLinks/NextLinks";
import { WritingPostBody } from "features/writing/WritingPostBody";
import { WritingPostCrumbs } from "features/writing/WritingPostCrumbs";
import { WritingPostHeader } from "features/writing/WritingPostHeader";
import { WritingPostMore } from "features/writing/WritingPostMore";
import { WritingPostTicker } from "features/writing/WritingPostTicker";
import type { WritingListPost } from "features/writing/writingModel";
import { WRITING_ARTICLE_NEXT_LABEL, WRITING_ARTICLE_NEXT_LINKS } from "data/writing";
import type { DiagramSpec } from "utils/diagramBlocks";
import type { PostHeading } from "utils/headings";

export interface WritingArticle {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  contentHtml: string;
  headings: PostHeading[];
  diagrams: DiagramSpec[];
}

interface WritingPostPageContentProps {
  post: WritingArticle;
  posts: readonly Pick<WritingListPost, "slug" | "title" | "date">[];
}

export const WritingPostPageContent = ({ post, posts }: WritingPostPageContentProps) => (
  <main id="main-content" tabIndex={-1}>
    <WritingPostCrumbs title={post.title} />
    <WritingPostTicker
      items={[
        post.title,
        ...post.headings.filter((heading) => heading.level === 2).map((heading) => heading.text),
      ]}
    />
    <article aria-labelledby="post-title">
      <WritingPostHeader
        titleId="post-title"
        title={post.title}
        excerpt={post.excerpt}
        date={post.date}
        tags={post.tags}
      />
      <WritingPostBody
        contentHtml={post.contentHtml}
        headings={post.headings}
        diagrams={post.diagrams}
      />
    </article>
    <WritingPostMore posts={posts} currentSlug={post.slug} />
    <NextLinks label={WRITING_ARTICLE_NEXT_LABEL} links={WRITING_ARTICLE_NEXT_LINKS} />
  </main>
);
