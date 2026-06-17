/** @jest-environment node */

jest.mock("utils/posts", () => ({
  getAllPosts: () => [],
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
