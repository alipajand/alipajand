import Link from "next/link";

import { Chev } from "components/hairline/Icons/Icons";
import { SectionHead } from "components/hairline/SectionHead/SectionHead";
import styles from "features/writing/WritingIndexFeatured.module.css";
import type { WritingListPost } from "features/writing/writingModel";
import {
  WRITING_FEATURED_HEADING,
  WRITING_FEATURED_LABEL,
  WRITING_READ_ARTICLE,
} from "data/writing";
import { formatDate } from "utils/date";

/** The featured post as one large link that fills with bone on hover. */
export const WritingIndexFeatured = ({ post }: { post: WritingListPost }) => (
  <section id="featured" aria-labelledby="featured-title">
    <SectionHead title={WRITING_FEATURED_HEADING} titleId="featured-title" />
    <Link className={styles.feature} href={`/writing/${post.slug}`}>
      <div className={styles.title}>
        <span className={styles.mono}>
          {WRITING_FEATURED_LABEL} · <time dateTime={post.date}>{formatDate(post.date)}</time>
        </span>
        <h3>{post.title}</h3>
      </div>
      <div className={styles.body}>
        <p>{post.excerpt}</p>
        {post.tags.length > 0 ? (
          <span className={styles.tagline}>{post.tags.join(" · ")}</span>
        ) : null}
        <span className={styles.go}>
          {WRITING_READ_ARTICLE}
          <Chev />
        </span>
      </div>
    </Link>
  </section>
);
