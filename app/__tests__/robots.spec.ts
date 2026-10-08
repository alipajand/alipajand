/** @jest-environment node */

import robots, { AI_CRAWLER_USER_AGENTS } from "../robots";
import { CANONICAL_URL } from "data/site";

describe("app/robots", () => {
  const result = robots();
  const rules = Array.isArray(result.rules) ? result.rules : [result.rules];

  it("should keep API routes out of the index for every crawler", () => {
    rules.forEach((rule) => {
      expect(rule.disallow).toContain("/api/");
    });
  });

  it("should explicitly allow AI answer-engine crawlers", () => {
    const aiRule = rules.find((rule) => Array.isArray(rule.userAgent));
    expect(aiRule?.userAgent).toEqual([...AI_CRAWLER_USER_AGENTS]);
    expect(aiRule?.allow).toBe("/");
  });

  it("should point to the sitemap", () => {
    expect(result.sitemap).toBe(`${CANONICAL_URL}/sitemap.xml`);
  });
});
