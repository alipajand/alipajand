import { WRITING_TOPIC_LANE_MIN_POSTS } from "data/writing";

/** The fields the index, timeline and "More writing" list need from a post. */
export interface WritingListPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  featured: boolean;
  /** Dated after today in the site's time zone (shown, flagged, kept out of structured data). */
  upcoming: boolean;
}

export interface TopicLane {
  /** Lower-cased tag, the filter key. */
  key: string;
  /** The tag as first written in the newest post that uses it. */
  label: string;
  count: number;
}

export const topicKey = (tag: string): string => tag.toLowerCase();

/**
 * Topic lanes: tags matched case-insensitively, kept once at least `min` posts use them, most used
 * first. Ties keep the order in which the tags first appear in the newest-first list.
 */
export const topicLanes = (
  posts: readonly Pick<WritingListPost, "tags">[],
  min = WRITING_TOPIC_LANE_MIN_POSTS
): TopicLane[] => {
  const counts = new Map<string, number>();
  const labels = new Map<string, string>();
  for (const post of posts) {
    for (const tag of post.tags) if (!labels.has(topicKey(tag))) labels.set(topicKey(tag), tag);
    for (const key of new Set(post.tags.map(topicKey))) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= min)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({ key, label: labels.get(key) ?? key, count }));
};

export const hasTopic = (post: Pick<WritingListPost, "tags">, key: string): boolean =>
  key === "all" || post.tags.some((tag) => topicKey(tag) === key);

/** The featured post: the first one marked featured that is already published. */
export const pickFeatured = <P extends Pick<WritingListPost, "featured" | "upcoming">>(
  posts: readonly P[]
): P | null => posts.find((post) => post.featured && !post.upcoming) ?? null;

/** "01", "02", … */
export const pad = (index: number): string => String(index + 1).padStart(2, "0");

const MONTH_MS = (date: string) => Date.parse(`${date}T00:00:00Z`);

export interface TimelineRange {
  /** First day of the first month shown (UTC ms). */
  start: number;
  /** First day of the month after the newest post (UTC ms). */
  end: number;
  /** Number of month gridlines from `start`. */
  months: number;
  year: number;
}

/**
 * The timeline spans whole months: from January of the oldest post's year to the first day of the
 * month after the newest post. With every post in 2026 and the newest on 28 October, that is
 * 1 January to 1 November with ten gridlines, as in the design.
 */
export const timelineRange = (dates: readonly string[]): TimelineRange => {
  const sorted = [...dates].filter(Boolean).sort();
  const first = sorted[0] ?? "2026-01-01";
  const last = sorted[sorted.length - 1] ?? first;
  const startYear = Number(first.slice(0, 4));
  const endYear = Number(last.slice(0, 4));
  const endMonth = Number(last.slice(5, 7));
  const start = Date.UTC(startYear, 0, 1);
  const end = Date.UTC(endYear, endMonth, 1);
  const months = (endYear - startYear) * 12 + endMonth;
  return { start, end, months, year: endYear };
};

/** Position of a date on the range, 0 to 1. */
export const timelinePosition = (date: string, range: TimelineRange): number =>
  (MONTH_MS(date) - range.start) / Math.max(range.end - range.start, 1);
