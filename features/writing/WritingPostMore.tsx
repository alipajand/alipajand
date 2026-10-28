import Link from "next/link";

import { Chev } from "components/hairline/Icons/Icons";
import styles from "features/writing/WritingPostMore.module.css";
import type { WritingListPost } from "features/writing/writingModel";
import { WRITING_MORE_ACTION, WRITING_MORE_HEADING } from "data/writing";
import { formatShortDate } from "utils/date";

interface WritingPostMoreProps {
  posts: readonly Pick<WritingListPost, "slug" | "title" | "date">[];
  currentSlug: string;
}

export const WritingPostMore = ({ posts, currentSlug }: WritingPostMoreProps) => (
  <section className={styles.more} aria-labelledby="more-title">
    <div className={styles.head}>
      <h2 id="more-title" className={styles.title}>
        {WRITING_MORE_HEADING}
      </h2>
      <Link className={styles.action} href="/writing">
        {WRITING_MORE_ACTION}
        <Chev />
      </Link>
    </div>
    <ol className={styles.list}>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            className={styles.row}
            href={`/writing/${post.slug}`}
            aria-current={post.slug === currentSlug ? "page" : undefined}
          >
            <span className={styles.date}>
              <time dateTime={post.date}>{formatShortDate(post.date)}</time>
            </span>
            <strong>{post.title}</strong>
            <Chev />
          </Link>
        </li>
      ))}
    </ol>
  </section>
);
