import type { ContributionSnapshot } from "data/openSourceActivity";

const DAY_MS = 24 * 60 * 60 * 1000;

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
    total: snapshot.total,
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
  label: string;
}

export interface CalendarLayout {
  width: number;
  height: number;
  weeks: CalendarCell[][];
  months: { x: number; label: string }[];
  weekdays: { y: number; label: string }[];
}

export const calendarLayout = (snapshot: ContributionSnapshot): CalendarLayout => {
  const lead = dayOfSnapshot(snapshot, 0).getUTCDay();
  const weekCount = Math.ceil((snapshot.counts.length + lead) / 7);
  const weeks: CalendarCell[][] = Array.from({ length: weekCount }, () => []);
  const months: CalendarLayout["months"] = [];
  snapshot.counts.forEach((count, index) => {
    const at = index + lead;
    const column = Math.floor(at / 7);
    const row = at % 7;
    const day = dayOfSnapshot(snapshot, index);
    weeks[column].push({
      index,
      x: CALENDAR_LEFT + column * CALENDAR_PITCH,
      y: CALENDAR_TOP + row * CALENDAR_PITCH,
      level: snapshot.levels[index] ?? 0,
      count,
      label: `${formatSnapshotDay(day)} · ${pluralize(count, "contribution")}`,
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
