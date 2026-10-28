"use client";

import Link from "next/link";
import { useState } from "react";

import { Chev } from "components/hairline/Icons/Icons";
import styles from "features/writing/WritingIndexPosts.module.css";
import { hasTopic, type TopicLane, type WritingListPost } from "features/writing/writingModel";
import {
  WRITING_FEATURED_LABEL,
  WRITING_INDEX_EMPTY_MESSAGE,
  WRITING_FILTER_ALL,
  WRITING_FILTER_GROUP_LABEL,
  WRITING_FILTER_LABEL,
  WRITING_READ_ARTICLE,
  writingShownCount,
} from "data/writing";
import { formatDate } from "utils/date";

interface WritingPostFiltersProps {
  posts: readonly WritingListPost[];
  lanes: readonly TopicLane[];
}

/**
 * Every post, newest first, with topic filters. The server renders the full list; the chips only
 * narrow it once the page is interactive, and the count is announced as a status.
 */
export const WritingPostFilters = ({ posts, lanes }: WritingPostFiltersProps) => {
  const [filter, setFilter] = useState("all");
  const shown = posts.filter((post) => hasTopic(post, filter));
  const chips = [{ key: "all", label: WRITING_FILTER_ALL, count: posts.length }, ...lanes];

  return (
    <>
      <div className={styles.filters} role="group" aria-label={WRITING_FILTER_GROUP_LABEL}>
        <span className={styles.label}>{WRITING_FILTER_LABEL}</span>
        {chips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            className={styles.chip}
            aria-pressed={filter === chip.key}
            onClick={() => setFilter(chip.key)}
          >
            {chip.label}
            <span>{chip.count}</span>
          </button>
        ))}
        <span className={styles.count} role="status">
          {writingShownCount(shown.length, posts.length)}
        </span>
      </div>
      <ul className={styles.posts}>
        {shown.length === 0 ? (
          <li>
            <p className={styles.empty}>{WRITING_INDEX_EMPTY_MESSAGE}</p>
          </li>
        ) : (
          shown.map((post) => (
            <li key={post.slug}>
              <article>
                <Link className={styles.post} href={`/writing/${post.slug}`}>
                  <time className={styles.date} dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                  <div className={styles.main}>
                    {post.featured ? (
                      <span className={styles.mono}>{WRITING_FEATURED_LABEL}</span>
                    ) : null}
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    {post.tags.length > 0 ? (
                      <span className={styles.tagline}>{post.tags.join(" · ")}</span>
                    ) : null}
                  </div>
                  <span className={styles.go}>
                    {WRITING_READ_ARTICLE}
                    <Chev />
                  </span>
                </Link>
              </article>
            </li>
          ))
        )}
      </ul>
    </>
  );
};
