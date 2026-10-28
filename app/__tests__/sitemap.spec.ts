/** @jest-environment node */

jest.mock("utils/posts", () => ({
  getPublishedPosts: () => [],
}));

import sitemap from "../sitemap";
import { CANONICAL_URL } from "data/site";
import { getDedicatedCaseStudySlugs } from "utils/projects";

describe("app/sitemap", () => {
  it("should include all dedicated portfolio case-study routes", () => {
    const entries = sitemap();

    for (const slug of getDedicatedCaseStudySlugs()) {
      expect(entries.some((entry) => entry.url === `${CANONICAL_URL}/portfolio/${slug}`)).toBe(
        true
      );
    }
  });
});

describe("app/sitemap lastmod", () => {
  afterEach(() => jest.useRealTimers());

  it("should not change with the build clock", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const first = sitemap();
    jest.setSystemTime(new Date("2027-06-01T00:00:00Z"));
    expect(sitemap()).toEqual(first);
  });

  it("should date only pages whose content carries a date", () => {
    const dated = sitemap()
      .filter((entry) => entry.lastModified !== undefined)
      .map((entry) => entry.url);
    expect(dated).toEqual([`${CANONICAL_URL}/now`]);
  });
});
