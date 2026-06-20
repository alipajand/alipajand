/** @jest-environment node */

import {
  buildArticleMetadata,
  buildEngineeringPrinciplesMetadata,
  buildNowMetadata,
  buildOpenSourceMetadata,
  buildPortfolioCaseStudyMetadata,
  buildPortfolioMetadata,
  buildWritingIndexMetadata,
} from "utils/metadata";
import { ENGINEERING_PRINCIPLES_META_DESCRIPTION } from "data/engineeringPrinciples";
import { NOW_META_DESCRIPTION, NOW_PAGE_TITLE } from "data/now";
import { OPEN_SOURCE_META_DESCRIPTION, OPEN_SOURCE_META_TITLE } from "data/openSourcePage";
import { PORTFOLIO_META_DESCRIPTION, PORTFOLIO_META_TITLE } from "data/projects";
import { CANONICAL_URL } from "data/site";
import { WRITING_INDEX_DESCRIPTION, WRITING_INDEX_TITLE } from "data/writing";
import { getProjectBySlug } from "utils/projects";

describe("utils/metadata", () => {
  it("should set canonical and descriptions for buildWritingIndexMetadata", () => {
    const m = buildWritingIndexMetadata();
    expect(m.alternates?.canonical).toBe(`${CANONICAL_URL}/writing`);
    expect(m.description).toBe(WRITING_INDEX_DESCRIPTION);
    expect(m.openGraph?.url).toBe(`${CANONICAL_URL}/writing`);
    expect(m.title).toEqual({
      absolute: WRITING_INDEX_TITLE,
    });
  });

  it("should set article Open Graph and canonical for buildArticleMetadata", () => {
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

  it("should prefer post SEO overrides when provided", () => {
    const m = buildArticleMetadata({
      slug: "my-post",
      title: "My post",
      date: "2025-01-01",
      excerpt: "Short excerpt for meta.",
      seoTitle: "SEO Title Override",
      seoDescription: "SEO description override.",
      contentHtml: "<p>x</p>",
    });
    expect(m.title).toEqual({ absolute: "SEO Title Override" });
    expect(m.description).toBe("SEO description override.");
    expect(m.openGraph?.title).toBe("SEO Title Override");
    expect(m.openGraph?.description).toBe("SEO description override.");
    expect(m.twitter?.title).toBe("SEO Title Override");
    expect(m.twitter?.description).toBe("SEO description override.");
  });

  it("should set canonical and portfolio description for buildPortfolioMetadata", () => {
    const m = buildPortfolioMetadata();
    expect(m.alternates?.canonical).toBe(`${CANONICAL_URL}/portfolio`);
    expect(m.description).toBe(PORTFOLIO_META_DESCRIPTION);
    expect(m.title).toEqual({ absolute: PORTFOLIO_META_TITLE });
  });

  it("should set canonical and case-study description for buildPortfolioCaseStudyMetadata", () => {
    const project = getProjectBySlug("ledgerguard")!;
    const m = buildPortfolioCaseStudyMetadata(project);
    expect(m.alternates?.canonical).toBe(`${CANONICAL_URL}/portfolio/ledgerguard`);
    expect(m.title).toEqual({ absolute: project.caseStudyMetaTitle });
    expect(m.description).toBe(project.caseStudyMetaDescription);
  });

  it("should set canonical, title, and description for buildEngineeringPrinciplesMetadata", () => {
    const m = buildEngineeringPrinciplesMetadata();
    expect(m.alternates?.canonical).toBe(`${CANONICAL_URL}/engineering-principles`);
    expect(m.title).toEqual({
      absolute: "Engineering Principles — Ali Pajand · Senior Frontend Engineer",
    });
    expect(m.description).toBe(ENGINEERING_PRINCIPLES_META_DESCRIPTION);
    expect(m.openGraph?.url).toBe(`${CANONICAL_URL}/engineering-principles`);
  });

  it("should set canonical, title, and description for buildNowMetadata", () => {
    const m = buildNowMetadata();
    expect(m.alternates?.canonical).toBe(`${CANONICAL_URL}/now`);
    expect(m.title).toEqual({ absolute: `${NOW_PAGE_TITLE} | Ali Pajand` });
    expect(m.description).toBe(NOW_META_DESCRIPTION);
    expect(m.openGraph?.url).toBe(`${CANONICAL_URL}/now`);
  });

  it("should set canonical, title, and description for buildOpenSourceMetadata", () => {
    const m = buildOpenSourceMetadata();
    expect(m.alternates?.canonical).toBe(`${CANONICAL_URL}/open-source`);
    expect(m.title).toEqual({ absolute: OPEN_SOURCE_META_TITLE });
    expect(m.description).toBe(OPEN_SOURCE_META_DESCRIPTION);
    expect(m.openGraph?.url).toBe(`${CANONICAL_URL}/open-source`);
  });
});
