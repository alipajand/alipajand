import { SITE_TIME_ZONE } from "utils/date";

/*
 * One publication model for every surface: the article, its OG image, the home page, /writing,
 * "More writing", the sitemap, RSS, llms.txt, llms-full.txt and structured data all ask these
 * functions, with the same clock, whether a post may appear.
 *
 * - draft: never served. Drafts belong outside this public repository (a test keeps them out).
 * - scheduled: dated after now; hidden until 00:00 America/Toronto on its date.
 * - published: on or after that instant; shown everywhere.
 *
 * A scheduled post with `preview: true` is a public preview: its article and OG image answer at
 * their URL, `noindex`, and it stays out of every list, feed, export and structured data. The
 * repository is public, so a preview, like any committed post, is readable on GitHub.
 */

export type PublicationState = "draft" | "scheduled" | "published";

export interface PublicationFields {
  /** Publication day, `YYYY-MM-DD`, on the America/Toronto calendar. */
  date: string;
  /** Last substantive edit, `YYYY-MM-DD`, on or after `date`. */
  updated?: string;
  draft?: boolean;
  preview?: boolean;
}

export const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

/** True for a `YYYY-MM-DD` string that names a real calendar day. */
export const isCalendarDate = (value: unknown): value is string => {
  if (typeof value !== "string" || !DATE_ONLY_RE.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
};

const zoneParts = new Intl.DateTimeFormat("en-US", {
  timeZone: SITE_TIME_ZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** Minutes the site's time zone is ahead of UTC at `instant` (negative west of Greenwich). */
const zoneOffsetMinutes = (instant: number): number => {
  const parts = Object.fromEntries(
    zoneParts.formatToParts(new Date(instant)).map(({ type, value }) => [type, Number(value)])
  );
  const wall = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );
  return Math.round((wall - Math.floor(instant / 1000) * 1000) / 60_000);
};

/**
 * The instant `date` begins in America/Toronto: local midnight. Toronto changes clocks at 02:00, so
 * midnight always exists and is never repeated; its offset is the one in force that night (EST,
 * -05:00, or EDT, -04:00), including on the days the clocks change.
 */
export const publicationInstant = (date: string): Date => {
  if (!isCalendarDate(date)) throw new Error(`Not a YYYY-MM-DD date: ${JSON.stringify(date)}`);
  const [year, month, day] = date.split("-").map(Number);
  const utcMidnight = Date.UTC(year, month - 1, day);
  const guess = utcMidnight - zoneOffsetMinutes(utcMidnight) * 60_000;
  return new Date(utcMidnight - zoneOffsetMinutes(guess) * 60_000);
};

/** `publicationInstant(date)` as ISO 8601 with the Toronto offset: `2026-10-28T00:00:00-04:00`. */
export const publicationTimestamp = (date: string): string => {
  const instant = publicationInstant(date).getTime();
  const offset = zoneOffsetMinutes(instant);
  const sign = offset < 0 ? "-" : "+";
  const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
  const minutes = String(Math.abs(offset) % 60).padStart(2, "0");
  return `${date}T00:00:00${sign}${hours}:${minutes}`;
};

export const publicationState = (post: PublicationFields, now: Date): PublicationState => {
  if (post.draft === true) return "draft";
  return publicationInstant(post.date).getTime() <= now.getTime() ? "published" : "scheduled";
};

/** Shown in lists, feeds, exports, the sitemap and structured data. */
export const isPublished = (post: PublicationFields, now: Date): boolean =>
  publicationState(post, now) === "published";

/** A scheduled post that opted into a public, unlisted, `noindex` preview. */
export const isPreview = (post: PublicationFields, now: Date): boolean =>
  post.preview === true && publicationState(post, now) === "scheduled";

/** Whether the article and its OG image answer at their URL. */
export const isRoutable = (post: PublicationFields, now: Date): boolean =>
  isPublished(post, now) || isPreview(post, now);

/** The day the post last changed: `updated` when given, otherwise `date`. */
export const modifiedDate = (post: PublicationFields): string => post.updated ?? post.date;
