const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Weeks drawn on the Now page's year ruler. */
export const WEEKS_IN_RULER = 52;

/**
 * The week of the year (1–52) that `date` falls in, counting from January 1 in local time. The 53rd
 * partial week folds into week 52 so the ruler always has 52 ticks.
 */
export const weekOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 1);
  const week = Math.floor((date.getTime() - start.getTime()) / WEEK_MS) + 1;
  return Math.min(WEEKS_IN_RULER, Math.max(1, week));
};
