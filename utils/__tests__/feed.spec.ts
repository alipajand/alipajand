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
    // Midnight in Toronto: EST on March 4, before the switch to daylight time.
    expect(xml).toContain("<pubDate>Wed, 04 Mar 2026 05:00:00 GMT</pubDate>");
    expect(xml).toContain("<category>dx</category>");
  });

  it("should date items at Toronto midnight in daylight time", () => {
    const xml = buildRssFeed([{ slug: "x", title: "X", date: "2026-10-28", excerpt: "E" }]);

    expect(xml).toContain("<pubDate>Wed, 28 Oct 2026 04:00:00 GMT</pubDate>");
    expect(xml).toContain("<lastBuildDate>Wed, 28 Oct 2026 04:00:00 GMT</lastBuildDate>");
  });
});
