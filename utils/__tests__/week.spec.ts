import { WEEKS_IN_RULER, weekOfYear } from "utils/week";

const hoursOf = (year: number) => {
  const hours: { date: Date; day: number }[] = [];
  for (let day = 0; new Date(year, 0, 1 + day).getFullYear() === year; day++) {
    for (let hour = 0; hour < 24; hour++)
      hours.push({ date: new Date(year, 0, 1 + day, hour), day });
  }
  return hours;
};

describe("weekOfYear", () => {
  // In a time zone with daylight saving time, an hour is missing from the elapsed milliseconds after
  // the spring change, so dividing them by a week's length used to put the first hour of each new week
  // in the week before. Run this spec with TZ=America/Los_Angeles to exercise that case.
  it.each([2026, 2027, 2028])(
    "should follow the local calendar day for every hour of %i",
    (year) => {
      const wrong = hoursOf(year).filter(
        ({ date, day }) => weekOfYear(date) !== Math.min(WEEKS_IN_RULER, Math.floor(day / 7) + 1)
      );
      expect(wrong.map(({ date }) => date.toString())).toEqual([]);
    }
  );

  it("should start week 11 at midnight on March 12, 2026, after the clocks change", () => {
    expect(weekOfYear(new Date(2026, 2, 11, 23, 30))).toBe(10);
    expect(weekOfYear(new Date(2026, 2, 12, 0, 30))).toBe(11);
  });
});
