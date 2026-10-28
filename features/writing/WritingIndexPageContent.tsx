import { DisplayWord } from "components/hairline/DisplayWord/DisplayWord";
import { NextLinks } from "components/hairline/NextLinks/NextLinks";
import { Ticker } from "components/hairline/Ticker/Ticker";
import styles from "features/writing/WritingIndexPageContent.module.css";
import { WritingIndexFeatured } from "features/writing/WritingIndexFeatured";
import { WritingIndexHero } from "features/writing/WritingIndexHero";
import { WritingIndexPosts } from "features/writing/WritingIndexPosts";
import { WritingIndexWhy } from "features/writing/WritingIndexWhy";
import {
  pickFeatured,
  timelineRange,
  topicLanes,
  type WritingListPost,
} from "features/writing/writingModel";
import {
  WRITING_INDEX_NEXT_LABEL,
  WRITING_INDEX_NEXT_LINKS,
  WRITING_SECTION_HEADING,
} from "data/writing";

interface WritingIndexPageContentProps {
  posts: WritingListPost[];
}

export const WritingIndexPageContent = ({ posts }: WritingIndexPageContentProps) => {
  const lanes = topicLanes(posts);
  const range = timelineRange(posts.map((post) => post.date));
  const featured = pickFeatured(posts);

  return (
    <main id="main-content" tabIndex={-1}>
      <div className={styles.display}>
        <DisplayWord as="h1" words={[WRITING_SECTION_HEADING, String(range.year)]} />
      </div>
      <WritingIndexHero posts={posts} lanes={lanes} range={range} hasFeatured={featured !== null} />
      <Ticker items={lanes.map((lane) => lane.label)} icon="ring" direction={1} />
      {featured ? <WritingIndexFeatured post={featured} /> : null}
      <WritingIndexWhy />
      <WritingIndexPosts posts={posts} lanes={lanes} />
      <NextLinks label={WRITING_INDEX_NEXT_LABEL} links={WRITING_INDEX_NEXT_LINKS} />
    </main>
  );
};
