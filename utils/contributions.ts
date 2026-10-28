import type { ContributionSnapshot } from "data/openSourceActivity";
import { OPEN_SOURCE_ACTIVITY_COUNT_NOUN } from "data/openSourcePage";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Grid geometry of the contribution calendar, in SVG user units. */
export const CALENDAR_PITCH = 15;
export const CALENDAR_CELL = 12;
export const CALENDAR_LEFT = 30;
export const CALENDAR_TOP = 18;

export const dayOfSnapshot = (snapshot: ContributionSnapshot, index: number): Date =>
  new Date(Date.parse(`${snapshot.from}T00:00:00Z`) + index * DAY_MS);

export const formatSnapshotDay = (date: Date): string =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

/** Contributions in the snapshot: the sum of its days, so the total cannot disagree with them. */
export const snapshotTotal = (snapshot: ContributionSnapshot): number =>
  snapshot.counts.reduce((sum, count) => sum + count, 0);

/**
 * Shade levels 1–4 for active days, split at the quartiles of the active days' counts, so one busy
 * day does not wash out the rest of the year. A day with no contributions is level 0.
 */
export const contributionLevels = (counts: readonly number[]): (0 | 1 | 2 | 3 | 4)[] => {
  const active = counts.filter(Boolean).sort((a, b) => a - b);
  const quartile = (q: number) => active[Math.max(0, Math.ceil(active.length * q) - 1)] ?? 0;
  const [q1, q2, q3] = [quartile(0.25), quartile(0.5), quartile(0.75)];
  return counts.map((count) =>
    count === 0 ? 0 : count <= q1 ? 1 : count <= q2 ? 2 : count <= q3 ? 3 : 4
  );
};

export const pluralize = (count: number, word: string): string =>
  `${count.toLocaleString("en-US")} ${word}${count === 1 ? "" : "s"}`;

export interface ContributionStats {
  total: number;
  activeDays: number;
  days: number;
  longestStreak: number;
  busiestCount: number;
  busiestDay: Date;
  first: Date;
  last: Date;
}

export const contributionStats = (snapshot: ContributionSnapshot): ContributionStats => {
  const { counts } = snapshot;
  let longestStreak = 0;
  let run = 0;
  let busiest = 0;
  counts.forEach((count, index) => {
    run = count ? run + 1 : 0;
    longestStreak = Math.max(longestStreak, run);
    if (count > counts[busiest]) busiest = index;
  });
  return {
    total: snapshotTotal(snapshot),
    activeDays: counts.filter(Boolean).length,
    days: counts.length,
    longestStreak,
    busiestCount: counts[busiest] ?? 0,
    busiestDay: dayOfSnapshot(snapshot, busiest),
    first: dayOfSnapshot(snapshot, 0),
    last: dayOfSnapshot(snapshot, counts.length - 1),
  };
};

export interface CalendarCell {
  index: number;
  x: number;
  y: number;
  level: number;
  count: number;
  /** "Oct 20, 2026 · 12 public contributions", for the readout under the calendar. */
  label: string;
}

export interface CalendarLayout {
  width: number;
  height: number;
  weeks: CalendarCell[][];
  months: { x: number; label: string }[];
  weekdays: { y: number; label: string }[];
}

/**
 * One column per week, Sunday at the top, like GitHub's calendar. Month labels sit over the week that
 * holds the 1st (skipping the last, partial column); Mon, Wed and Fri label the rows.
 */
export const calendarLayout = (snapshot: ContributionSnapshot): CalendarLayout => {
  const lead = dayOfSnapshot(snapshot, 0).getUTCDay();
  const weekCount = Math.ceil((snapshot.counts.length + lead) / 7);
  const weeks: CalendarCell[][] = Array.from({ length: weekCount }, () => []);
  const months: CalendarLayout["months"] = [];
  const levels = contributionLevels(snapshot.counts);
  snapshot.counts.forEach((count, index) => {
    const at = index + lead;
    const column = Math.floor(at / 7);
    const row = at % 7;
    const day = dayOfSnapshot(snapshot, index);
    weeks[column].push({
      index,
      x: CALENDAR_LEFT + column * CALENDAR_PITCH,
      y: CALENDAR_TOP + row * CALENDAR_PITCH,
      level: levels[index],
      count,
      label: `${formatSnapshotDay(day)} · ${pluralize(count, OPEN_SOURCE_ACTIVITY_COUNT_NOUN)}`,
    });
    if (day.getUTCDate() === 1 && column < weekCount - 1) {
      months.push({
        x: CALENDAR_LEFT + column * CALENDAR_PITCH,
        label: day.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
      });
    }
  });
  const weekdays = (
    [
      [1, "Mon"],
      [3, "Wed"],
      [5, "Fri"],
    ] as const
  ).map(([row, label]) => ({ y: CALENDAR_TOP + row * CALENDAR_PITCH + 9, label }));
  return {
    width: CALENDAR_LEFT + weekCount * CALENDAR_PITCH - (CALENDAR_PITCH - CALENDAR_CELL),
    height: CALENDAR_TOP + 7 * CALENDAR_PITCH - (CALENDAR_PITCH - CALENDAR_CELL),
    weeks,
    months,
    weekdays,
  };
};

/** Contributions per calendar month, oldest first, for the text alternative to the graph. */
export const monthlyContributions = (
  snapshot: ContributionSnapshot
): { month: string; total: number }[] => {
  const totals = new Map<string, number>();
  snapshot.counts.forEach((count, index) => {
    const month = dayOfSnapshot(snapshot, index).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
    totals.set(month, (totals.get(month) ?? 0) + count);
  });
  return Array.from(totals, ([month, total]) => ({ month, total }));
};
