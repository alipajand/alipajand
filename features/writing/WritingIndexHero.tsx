import { Chev } from "components/hairline/Icons/Icons";
import styles from "features/writing/WritingIndexHero.module.css";
import { WritingTimeline } from "features/writing/WritingTimeline";
import type { TimelineRange, TopicLane, WritingListPost } from "features/writing/writingModel";
import {
  WRITING_ALL_POSTS_CTA,
  WRITING_FEATURED_CTA,
  WRITING_SECTION_LEDE,
  WRITING_HERO_LABEL,
  WRITING_INDEX_EYEBROW,
  writingPublishedCount,
} from "data/writing";

interface WritingIndexHeroProps {
  posts: readonly WritingListPost[];
  lanes: readonly TopicLane[];
  range: TimelineRange;
  hasFeatured: boolean;
}

/** The lede and its two jump links beside the topic timeline. */
export const WritingIndexHero = ({ posts, lanes, range, hasFeatured }: WritingIndexHeroProps) => {
  const chrono = [...posts].reverse();

  return (
    <section className={styles.hero} aria-label={WRITING_HERO_LABEL}>
      <div className={styles.copy}>
        <div className={styles.eyebrow}>
          <span>{WRITING_INDEX_EYEBROW}</span>
          <span>{writingPublishedCount(posts.length)}</span>
        </div>
        <p className={styles.lede}>{WRITING_SECTION_LEDE}</p>
        <div className={styles.ctas}>
          <a href="#posts">
            {WRITING_ALL_POSTS_CTA}
            <Chev />
          </a>
          {hasFeatured ? (
            <a href="#featured">
              {WRITING_FEATURED_CTA}
              <Chev />
            </a>
          ) : null}
        </div>
      </div>
      <WritingTimeline posts={chrono} lanes={lanes} range={range} />
    </section>
  );
};
