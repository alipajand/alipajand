import { OPEN_SOURCE_CONTRIBUTION_SNAPSHOT } from "data/openSourceActivity";
import {
  OPEN_SOURCE_PROJECTS,
  openSourceProjectSlug,
  openSourceRouteReadout,
} from "data/openSourcePage";
import {
  calendarLayout,
  contributionLevels,
  contributionStats,
  monthlyContributions,
  snapshotTotal,
  pluralize,
} from "utils/contributions";
import { WEEKS_IN_RULER, weekOfYear } from "utils/week";

describe("weekOfYear", () => {
  it("should count weeks from January 1 in local time", () => {
    expect(weekOfYear(new Date(2026, 0, 1))).toBe(1);
    expect(weekOfYear(new Date(2026, 0, 7, 23))).toBe(1);
    expect(weekOfYear(new Date(2026, 0, 8))).toBe(2);
    expect(weekOfYear(new Date(2026, 9, 27))).toBe(43);
  });

  it("should fold the partial last week into week 52", () => {
    expect(weekOfYear(new Date(2026, 11, 31))).toBe(WEEKS_IN_RULER);
    expect(weekOfYear(new Date(2028, 11, 31))).toBe(WEEKS_IN_RULER);
  });
});

describe("contribution snapshot", () => {
  const snapshot = OPEN_SOURCE_CONTRIBUTION_SNAPSHOT;

  // Public contributions only, for the full days 2025-10-26 to 2026-10-26 (decision A3).
  it("should hold one count per full day before it was collected", () => {
    const days = (Date.parse(snapshot.to) - Date.parse(snapshot.from)) / 86_400_000 + 1;
    expect(snapshot.counts).toHaveLength(days);
    expect(snapshot.to < snapshot.collectedAt.slice(0, 10)).toBe(true);
    expect(snapshot.source).toMatch(/public repositories only/);
    expect(snapshotTotal(snapshot)).toBe(910);
    expect(snapshot.counts.filter(Boolean)).toHaveLength(82);
  });

  it("should shade active days by quartile and leave empty days at level 0", () => {
    expect(contributionLevels([0, 1, 2, 3, 4, 0, 100])).toEqual([0, 1, 1, 2, 3, 0, 4]);
    expect(contributionLevels([0, 0])).toEqual([0, 0]);
    expect(contributionLevels([5])).toEqual([1]);
  });

  it("should derive the stats shown on the page", () => {
    const stats = contributionStats(snapshot);
    expect(stats.total).toBe(910);
    expect(stats.days).toBe(snapshot.counts.length);
    expect(stats.activeDays).toBe(snapshot.counts.filter(Boolean).length);
    expect(stats.busiestCount).toBe(Math.max(...snapshot.counts));
    expect(stats.first.toISOString().slice(0, 10)).toBe(snapshot.from);
    expect(stats.last.toISOString().slice(0, 10)).toBe(snapshot.to);
  });

  it("should lay the calendar out one column per week, Sunday first", () => {
    const layout = calendarLayout(snapshot);
    const cells = layout.weeks.flat();
    expect(cells).toHaveLength(snapshot.counts.length);
    expect(cells.map((cell) => cell.index)).toEqual(snapshot.counts.map((_, index) => index));
    // October 26, 2025 was a Sunday, so the first column is full.
    expect(layout.weeks[0]).toHaveLength(7);
    expect(layout.months.length).toBeGreaterThanOrEqual(11);
    expect(cells[cells.length - 1].label).toBe("Oct 26, 2026 · 2 public contributions");
    expect(cells.every((cell) => (cell.count === 0) === (cell.level === 0))).toBe(true);
  });

  it("should sum contributions per month", () => {
    const months = monthlyContributions(snapshot);
    expect(months[0].month).toBe("October 2025");
    expect(months.reduce((sum, month) => sum + month.total, 0)).toBe(snapshotTotal(snapshot));
  });

  it("should pluralise counts", () => {
    expect(pluralize(1, "day")).toBe("1 day");
    expect(pluralize(1200, "contribution")).toBe("1,200 contributions");
  });
});

describe("open-source display helpers", () => {
  it("should give every project a unique anchor", () => {
    const slugs = OPEN_SOURCE_PROJECTS.map((project) => openSourceProjectSlug(project.title));
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs[0]).toBe("p-agent-readiness-mcp");
  });

  it("should name the lit surface in the diagram readout", () => {
    expect(openSourceRouteReadout(0)).toBe("01 / 05 · agent-readiness-action");
    expect(openSourceRouteReadout(4)).toBe("05 / 05 · agent-pr-reviewer-lite");
  });
});
