/** @jest-environment node */

import {
  buildArticleMetadata,
  buildBlogIndexMetadata,
  buildPortfolioMetadata,
} from "utils/metadata";
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
    const articleOg = m.openGraph as {
      type?: string;
      publishedTime?: string;
    };
    expect(articleOg.type).toBe("article");
    expect(articleOg.publishedTime).toBe("2025-01-01");
    const ogImages = m.openGraph?.images;
    expect(Array.isArray(ogImages) && ogImages[0]).toMatchObject({
      url: "/blog/my-post/opengraph-image",
      width: 1200,
      height: 630,
      alt: "My post",
    });
  });

  it("buildPortfolioMetadata sets canonical and portfolio description", () => {
    const m = buildPortfolioMetadata();
    expect(m.alternates?.canonical).toBe(`${CANONICAL_URL}/portfolio`);
    expect(m.description).toBe(PORTFOLIO_PAGE_LEDE);
  });
});
