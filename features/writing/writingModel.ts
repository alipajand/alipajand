import { WRITING_TOPIC_LANE_MIN_POSTS } from "data/writing";

export interface WritingListPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  featured: boolean;
}

export interface TopicLane {
  key: string;
  label: string;
  count: number;
}

export const topicKey = (tag: string): string => tag.toLowerCase();

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

export const pickFeatured = <P extends Pick<WritingListPost, "featured">>(
  posts: readonly P[]
): P | null => posts.find((post) => post.featured) ?? null;

export const pad = (index: number): string => String(index + 1).padStart(2, "0");

const MONTH_MS = (date: string) => Date.parse(`${date}T00:00:00Z`);

export interface TimelineRange {
  start: number;
  end: number;
  months: number;
  year: number;
}

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

export const timelinePosition = (date: string, range: TimelineRange): number =>
  (MONTH_MS(date) - range.start) / Math.max(range.end - range.start, 1);
