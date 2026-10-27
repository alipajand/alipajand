import Link from "next/link";

import { Chev } from "components/hairline/Icons/Icons";
import { SectionHead } from "components/hairline/SectionHead/SectionHead";
import type { WritingPost } from "components/Writing/WritingPost";
import styles from "features/home/HomeWriting.module.css";
import {
  WRITING_ALL_POSTS_CTA,
  WRITING_FEATURED_LABEL,
  WRITING_SECTION_HEADING,
  WRITING_SECTION_LEDE,
  WRITING_WHY_IT_MATTERS,
} from "data/writing";
import { formatShortDate } from "utils/date";

interface HomeWritingProps {
  featured: WritingPost | null;
  posts: WritingPost[];
  heading?: string;
}

const postHref = (slug: string) => `/writing/${encodeURIComponent(slug)}`;

export const HomeWriting = ({
  featured,
  posts,
  heading = WRITING_SECTION_HEADING,
}: HomeWritingProps) => {
  if (!featured && posts.length === 0) return null;
  return (
    <section id="writing" aria-labelledby="writing-heading">
      <SectionHead
        title={heading}
        titleId="writing-heading"
        lede={[WRITING_SECTION_LEDE, WRITING_WHY_IT_MATTERS]}
        action={{ href: "/writing", label: WRITING_ALL_POSTS_CTA }}
      />
      <div className={featured ? styles.writing : `${styles.writing} ${styles.single}`}>
        {featured ? (
          <article className={`${styles.post} ${styles.feature}`}>
            <p className={styles.meta}>
              {WRITING_FEATURED_LABEL} ·{" "}
              <time dateTime={featured.date}>{formatShortDate(featured.date)}</time>
            </p>
            <h3>
              <Link href={postHref(featured.slug)} className={styles.link}>
                {featured.title}
              </Link>
            </h3>
            <p className={styles.excerpt}>{featured.excerpt}</p>
            <Chev />
          </article>
        ) : null}
        {posts.length > 0 ? (
          <ul className={styles.list}>
            {posts.map((post) => (
              <li key={post.slug} className={styles.post}>
                <p className={styles.meta}>
                  <time dateTime={post.date}>{formatShortDate(post.date)}</time>
                </p>
                <h3>
                  <Link href={postHref(post.slug)} className={styles.link}>
                    {post.title}
                  </Link>
                </h3>
                <p className={styles.excerpt}>{post.excerpt}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
};
