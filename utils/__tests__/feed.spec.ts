/** @jest-environment node */

import { CANONICAL_URL } from "data/site";
import { buildRssFeed, FEED_PATH } from "utils/feed";

describe("buildRssFeed", () => {
  it("should render one escaped item per post", () => {
    const xml = buildRssFeed([
      {
        slug: "a-post",
        title: "Tools & <tests>",
        date: "2026-03-04",
        excerpt: "Excerpt",
        tags: ["dx"],
      },
    ]);

    expect(xml).toContain(`<atom:link href="${CANONICAL_URL}${FEED_PATH}"`);
    expect(xml).toContain("<title>Tools &amp; &lt;tests&gt;</title>");
    expect(xml).toContain(`<guid isPermaLink="true">${CANONICAL_URL}/writing/a-post</guid>`);
    expect(xml).toContain("<pubDate>Wed, 04 Mar 2026 00:00:00 GMT</pubDate>");
    expect(xml).toContain("<category>dx</category>");
  });

  it("should omit pubDate when the date is invalid", () => {
    const xml = buildRssFeed([{ slug: "x", title: "X", date: "", excerpt: "E" }]);

    expect(xml).not.toContain("<pubDate>");
    expect(xml).not.toContain("<lastBuildDate>");
  });
});
