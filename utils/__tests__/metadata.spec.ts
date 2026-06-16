/** @jest-environment node */

import {
  buildArticleMetadata,
  buildEngineeringPrinciplesMetadata,
  buildNowMetadata,
  buildPortfolioMetadata,
  buildWritingIndexMetadata,
} from "utils/metadata";
import {
  ENGINEERING_PRINCIPLES_META_DESCRIPTION,
  ENGINEERING_PRINCIPLES_PAGE_TITLE,
} from "data/engineeringPrinciples";
import { NOW_META_DESCRIPTION, NOW_PAGE_TITLE } from "data/now";
import { PORTFOLIO_META_DESCRIPTION } from "data/portfolioFit";
import { CANONICAL_URL } from "data/site";
import { WRITING_INDEX_DESCRIPTION } from "data/writing";

describe("utils/metadata", () => {
  it("buildWritingIndexMetadata sets canonical and descriptions", () => {
    const m = buildWritingIndexMetadata();
    expect(m.alternates?.canonical).toBe(`${CANONICAL_URL}/writing`);
    expect(m.description).toBe(WRITING_INDEX_DESCRIPTION);
    expect(m.openGraph?.url).toBe(`${CANONICAL_URL}/writing`);
  });

  it("buildArticleMetadata sets article Open Graph and canonical", () => {
    const m = buildArticleMetadata({
      slug: "my-post",
      title: "My post",
      date: "2025-01-01",
      excerpt: "Short excerpt for meta.",
      contentHtml: "<p>x</p>",
    });
    expect(m.alternates?.canonical).toBe(`${CANONICAL_URL}/writing/my-post`);
    const articleOg = m.openGraph as {
      type?: string;
      publishedTime?: string;
    };
    expect(articleOg.type).toBe("article");
    expect(articleOg.publishedTime).toBe("2025-01-01");
    const ogImages = m.openGraph?.images;
    expect(Array.isArray(ogImages) && ogImages[0]).toMatchObject({
      url: "/writing/my-post/opengraph-image",
      width: 1200,
      height: 630,
      alt: "My post",
    });
  });

  it("buildPortfolioMetadata sets canonical and portfolio description", () => {
    const m = buildPortfolioMetadata();
    expect(m.alternates?.canonical).toBe(`${CANONICAL_URL}/portfolio`);
    expect(m.description).toBe(PORTFOLIO_META_DESCRIPTION);
  });

  it("buildEngineeringPrinciplesMetadata sets canonical, title, and description", () => {
    const m = buildEngineeringPrinciplesMetadata();
    expect(m.alternates?.canonical).toBe(`${CANONICAL_URL}/engineering-principles`);
    expect(m.title).toBe(ENGINEERING_PRINCIPLES_PAGE_TITLE);
    expect(m.description).toBe(ENGINEERING_PRINCIPLES_META_DESCRIPTION);
    expect(m.openGraph?.url).toBe(`${CANONICAL_URL}/engineering-principles`);
  });

  it("buildNowMetadata sets canonical, title, and description", () => {
    const m = buildNowMetadata();
    expect(m.alternates?.canonical).toBe(`${CANONICAL_URL}/now`);
    expect(m.title).toBe(NOW_PAGE_TITLE);
    expect(m.description).toBe(NOW_META_DESCRIPTION);
    expect(m.openGraph?.url).toBe(`${CANONICAL_URL}/now`);
  });
});
