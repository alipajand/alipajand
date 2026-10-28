const DAY_MS = 24 * 60 * 60 * 1000;

export const WEEKS_IN_RULER = 52;

export const weekOfYear = (date: Date): number => {
  const year = date.getFullYear();
  const day = Math.round(
    (Date.UTC(year, date.getMonth(), date.getDate()) - Date.UTC(year, 0, 1)) / DAY_MS
  );
  return Math.min(WEEKS_IN_RULER, Math.floor(day / 7) + 1);
};

export const weekOfCalendarDate = (date: string): number => {
  const [year, month, day] = date.split("-").map(Number);
  return weekOfYear(new Date(year, month - 1, day));
};
