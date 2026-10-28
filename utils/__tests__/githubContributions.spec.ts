/** @jest-environment node */

import { OPEN_SOURCE_CONTRIBUTION_SNAPSHOT } from "data/openSourceActivity";
import {
  CONTRIBUTIONS_REVALIDATE_SECONDS,
  getContributionSnapshot,
  snapshotFromCalendar,
} from "utils/githubContributions";

const LEVEL_NAMES = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
] as const;

const calendarBody = (days = 368) => {
  const start = Date.parse("2025-10-26T00:00:00Z");
  const all = Array.from({ length: days }, (_, index) => ({
    date: new Date(start + index * 86400000).toISOString().slice(0, 10),
    contributionCount: index % 5,
    contributionLevel: LEVEL_NAMES[index % 5],
  }));
  const weeks = Array.from({ length: Math.ceil(days / 7) }, (_, week) => ({
    contributionDays: all.slice(week * 7, week * 7 + 7),
  }));
  return {
    data: { user: { contributionsCollection: { contributionCalendar: { weeks } } } },
  };
};

const respond = (body: unknown, status = 200) =>
  jest.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));

describe("snapshotFromCalendar", () => {
  it("should flatten the weeks into one count and level per day", () => {
    const snapshot = snapshotFromCalendar("alipajand", calendarBody());

    expect(snapshot.from).toBe("2025-10-26");
    expect(snapshot.taken).toBe("2026-10-28");
    expect(snapshot.counts).toHaveLength(368);
    expect(snapshot.levels.slice(0, 6)).toEqual([0, 1, 2, 3, 4, 0]);
    expect(snapshot.total).toBe(snapshot.counts.reduce((sum, count) => sum + count, 0));
  });

  it("should reject GraphQL errors and short calendars", () => {
    expect(() => snapshotFromCalendar("alipajand", { errors: [{ message: "Bad login" }] })).toThrow(
      "Bad login"
    );
    expect(() => snapshotFromCalendar("alipajand", calendarBody(30))).toThrow("only 30 days");
    expect(() => snapshotFromCalendar("alipajand", { data: { user: null } })).toThrow(
      "only 0 days"
    );
  });
});

describe("getContributionSnapshot", () => {
  const originalFetch = global.fetch;
  const originalToken = process.env.GITHUB_TOKEN;

  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalToken === undefined) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = originalToken;
    jest.restoreAllMocks();
  });

  it("should use the committed snapshot without a token and not call GitHub", async () => {
    delete process.env.GITHUB_TOKEN;
    global.fetch = jest.fn();

    await expect(getContributionSnapshot()).resolves.toBe(OPEN_SOURCE_CONTRIBUTION_SNAPSHOT);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should read the live calendar with the token and cache it for the revalidate window", async () => {
    process.env.GITHUB_TOKEN = "ghp_test";
    global.fetch = respond(calendarBody());

    const snapshot = await getContributionSnapshot();

    expect(snapshot.taken).toBe("2026-10-28");
    expect(snapshot.user).toBe("alipajand");
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe("https://api.github.com/graphql");
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe("bearer ghp_test");
    expect(JSON.parse(init.body).variables).toEqual({ login: "alipajand" });
    expect(init.next).toEqual({ revalidate: CONTRIBUTIONS_REVALIDATE_SECONDS });
  });

  it.each([
    ["an HTTP error", () => respond({ message: "Bad credentials" }, 401)],
    ["a GraphQL error", () => respond({ errors: [{ message: "Rate limited" }] })],
    ["a network failure", () => jest.fn().mockRejectedValue(new Error("socket hang up"))],
  ])("should fall back to the committed snapshot on %s", async (_, makeFetch) => {
    process.env.GITHUB_TOKEN = "ghp_test";
    global.fetch = makeFetch();

    await expect(getContributionSnapshot()).resolves.toBe(OPEN_SOURCE_CONTRIBUTION_SNAPSHOT);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining(`using the ${OPEN_SOURCE_CONTRIBUTION_SNAPSHOT.taken} snapshot`)
    );
  });
});
