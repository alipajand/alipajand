const DAY_MS = 24 * 60 * 60 * 1000;

/** Weeks drawn on the Now page's year ruler. */
export const WEEKS_IN_RULER = 52;

/**
 * The week of the year (1–52) that `date` falls in: days 1–7 of the local calendar year are week 1,
 * days 8–14 week 2, and so on. This is not the ISO week, which starts on a Monday and can reach 53.
 * The day is counted on the local calendar date, not elapsed time, so a daylight-saving change can't
 * move the first hour of a week into the week before. The 53rd partial week (day 365, and 366 in a
 * leap year) folds into week 52 so the ruler always has 52 ticks.
 */
export const weekOfYear = (date: Date): number => {
  const year = date.getFullYear();
  const day = Math.round(
    (Date.UTC(year, date.getMonth(), date.getDate()) - Date.UTC(year, 0, 1)) / DAY_MS
  );
  return Math.min(WEEKS_IN_RULER, Math.floor(day / 7) + 1);
};
