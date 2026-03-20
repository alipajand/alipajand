/** @jest-environment node */

import { buildArticleMetadata, buildBlogIndexMetadata, buildPortfolioMetadata } from "utils/metadata";
import { CANONICAL_URL, PORTFOLIO_PAGE_LEDE } from "data/site";
import { BLOG_INDEX_DESCRIPTION } from "data/writing";

describe("utils/metadata", () => {
  it("buildBlogIndexMetadata sets canonical and descriptions", () => {
    const m = buildBlogIndexMetadata();
    expect(m.alternates?.canonical).toBe(`${CANONICAL_URL}/blog`);
    expect(m.description).toBe(BLOG_INDEX_DESCRIPTION);
    expect(m.openGraph?.url).toBe(`${CANONICAL_URL}/blog`);
  });

  it("buildArticleMetadata sets article Open Graph and canonical", () => {
    const m = buildArticleMetadata({
      slug: "my-post",
      title: "My post",
      date: "2025-01-01",
      excerpt: "Short excerpt for meta.",
      contentHtml: "<p>x</p>",
    });
    expect(m.alternates?.canonical).toBe(`${CANONICAL_URL}/blog/my-post`);
    expect(m.openGraph?.type).toBe("article");
    expect(m.openGraph?.publishedTime).toBe("2025-01-01");
  });

  it("buildPortfolioMetadata sets canonical and portfolio description", () => {
    const m = buildPortfolioMetadata();
    expect(m.alternates?.canonical).toBe(`${CANONICAL_URL}/portfolio`);
    expect(m.description).toBe(PORTFOLIO_PAGE_LEDE);
  });
});
