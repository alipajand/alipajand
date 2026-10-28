import { NOW_RULER_LABEL, NOW_RULER_STEP, NOW_UPDATED } from "data/now";
import { WEEKS_IN_RULER, weekOfCalendarDate } from "utils/week";

describe("/now ruler marker", () => {
  // R1: the ruler dates the content, so it marks NOW_UPDATED (2026-05-08 is day 128, step 19).
  it("should mark the step NOW_UPDATED falls on, labelled with that date", () => {
    expect(NOW_UPDATED).toBe("2026-05-08");
    expect(NOW_RULER_STEP).toBe(19);
    expect(NOW_RULER_LABEL).toBe("As of May 8, 2026");
  });

  it.each([
    ["2026-01-01", 1],
    ["2026-01-07", 1],
    ["2026-01-08", 2],
    ["2026-10-27", 43],
    ["2026-12-30", WEEKS_IN_RULER],
    ["2026-12-31", WEEKS_IN_RULER],
    ["2028-12-31", WEEKS_IN_RULER],
  ])("should put %s on step %i", (date, step) => {
    expect(weekOfCalendarDate(date)).toBe(step);
  });
});
