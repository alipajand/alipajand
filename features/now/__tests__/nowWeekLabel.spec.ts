import { nowWeekLabel } from "data/now";
import { weekOfYear } from "utils/week";

const labelFor = (date: Date) => nowWeekLabel(weekOfYear(date));

/** Every local calendar day of `year`. */
const daysOf = (year: number) => {
  const days: Date[] = [];
  for (let day = 0; new Date(year, 0, 1 + day).getFullYear() === year; day++) {
    days.push(new Date(year, 0, 1 + day, 12));
  }
  return days;
};

describe("nowWeekLabel", () => {
  it("should read as year progress, not as an ISO week number", () => {
    // October 27, 2026 is ISO week 44; the ruler is on its 43rd seven-day step from January 1.
    expect(labelFor(new Date(2026, 9, 27, 12))).toBe("Week 43 of 52 · year progress");
    expect(labelFor(new Date(2026, 9, 27, 12))).not.toMatch(/\bwk\b/i);
  });

  it.each([
    // [date, step, ISO week for reference]
    [new Date(2026, 0, 1), 1, "2026-W01"],
    [new Date(2026, 0, 7, 23, 59), 1, "2026-W02"],
    [new Date(2026, 0, 8), 2, "2026-W02"],
    [new Date(2026, 11, 24), 52, "2026-W52"],
    [new Date(2026, 11, 28), 52, "2026-W53"],
    [new Date(2026, 11, 31, 23, 59), 52, "2026-W53"],
    [new Date(2027, 0, 1), 1, "2026-W53"],
    [new Date(2027, 0, 4), 1, "2027-W01"],
    [new Date(2027, 11, 31), 52, "2027-W52"],
    [new Date(2028, 11, 30), 52, "2028-W52"],
    [new Date(2028, 11, 31), 52, "2028-W52"],
  ])("should label %s as step %i of 52 (ISO %s)", (date, step) => {
    expect(labelFor(date)).toBe(`Week ${step} of 52 · year progress`);
  });

  it.each([2026, 2027, 2028])("should stay within 52 steps on every day of %i", (year) => {
    const labels = new Set(daysOf(year).map(labelFor));
    expect(labels.size).toBe(52);
    expect(
      [...labels].filter((label) => !/^Week ([1-9]|[1-4]\d|5[0-2]) of 52 · /.test(label))
    ).toEqual([]);
  });
});
