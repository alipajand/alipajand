import { SITE_TIME_ZONE } from "utils/date";

export type PublicationState = "draft" | "scheduled" | "published";

export interface PublicationFields {
  date: string;
  updated?: string;
  draft?: boolean;
  preview?: boolean;
}

export const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

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

export const publicationInstant = (date: string): Date => {
  if (!isCalendarDate(date)) throw new Error(`Not a YYYY-MM-DD date: ${JSON.stringify(date)}`);
  const [year, month, day] = date.split("-").map(Number);
  const utcMidnight = Date.UTC(year, month - 1, day);
  const guess = utcMidnight - zoneOffsetMinutes(utcMidnight) * 60_000;
  return new Date(utcMidnight - zoneOffsetMinutes(guess) * 60_000);
};

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

export const isPublished = (post: PublicationFields, now: Date): boolean =>
  publicationState(post, now) === "published";

export const isPreview = (post: PublicationFields, now: Date): boolean =>
  post.preview === true && publicationState(post, now) === "scheduled";

export const isRoutable = (post: PublicationFields, now: Date): boolean =>
  isPublished(post, now) || isPreview(post, now);

export const modifiedDate = (post: PublicationFields): string => post.updated ?? post.date;
