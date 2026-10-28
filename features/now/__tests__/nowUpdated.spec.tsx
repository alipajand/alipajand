import { render, screen, within } from "@testing-library/react";

import NowPage from "../../../app/now/page";
import sitemap from "../../../app/sitemap";
import { NowPageContent } from "features/now/NowPageContent";
import { NOW_PAGE_TITLE, NOW_UPDATED, NOW_UPDATED_PREFIX, NOW_YEAR } from "data/now";
import { CANONICAL_URL } from "data/site";
import { formatShortDate } from "utils/date";
import { isPublished } from "utils/publication";
import { buildLlmsFullTxt } from "utils/llms";
import { installMatchMedia, installObservers } from "utils/motion/testEnvironment";

jest.mock("utils/posts", () => ({
  getPublishedPosts: () => [],
}));

beforeEach(() => {
  installMatchMedia(false);
  installObservers();
  jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("NOW_UPDATED", () => {
  it("should be a real calendar date in YYYY-MM-DD form", () => {
    expect(NOW_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const parsed = new Date(`${NOW_UPDATED}T00:00:00Z`);
    expect(Number.isNaN(parsed.getTime())).toBe(false);
    // Rejects dates that roll over, such as 2026-02-30.
    expect(parsed.toISOString().slice(0, 10)).toBe(NOW_UPDATED);
  });

  it("should not be in the future", () => {
    // Today in the site's time zone, as for scheduled posts.
    expect(isPublished({ date: NOW_UPDATED }, new Date())).toBe(true);
  });

  it("should give the display title its year", () => {
    expect(NOW_YEAR).toBe(Number(NOW_UPDATED.slice(0, 4)));
  });
});

describe("/now as-of date", () => {
  it("should take the title year from NOW_UPDATED, not the clock", () => {
    render(<NowPageContent now={new Date(2031, 6, 1)} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      `${NOW_PAGE_TITLE} ${NOW_YEAR}`
    );
  });

  it("should show the date the content was last revised", () => {
    render(<NowPageContent now={new Date(2031, 6, 1)} />);

    const intro = screen.getByRole("region", { name: "About this page" });
    // The lede also says "updated when priorities shift", so match the whole line.
    const line = within(intro).getByText(
      (_, element) =>
        element?.tagName === "P" &&
        element.textContent === `${NOW_UPDATED_PREFIX} ${formatShortDate(NOW_UPDATED)}`
    );
    expect(line).toHaveTextContent(`${NOW_UPDATED_PREFIX} ${formatShortDate(NOW_UPDATED)}`);
    expect(line.querySelector("time")).toHaveAttribute("dateTime", NOW_UPDATED);
  });

  it("should use the same date for dateModified in the page's structured data", () => {
    const { container } = render(<NowPage />);

    const blocks = Array.from(
      container.querySelectorAll('script[type="application/ld+json"]'),
      (script) => JSON.parse(script.textContent ?? "{}")
    );
    const page = blocks.find((block) => block["@type"] === "WebPage");
    expect(page).toEqual(
      expect.objectContaining({
        "@id": `${CANONICAL_URL}/now`,
        url: `${CANONICAL_URL}/now`,
        dateModified: NOW_UPDATED,
      })
    );
    expect(blocks.some((block) => block["@type"] === "BreadcrumbList")).toBe(true);
  });

  it("should use the same date for the sitemap's lastmod", () => {
    const entry = sitemap().find((item) => item.url === `${CANONICAL_URL}/now`);
    expect(entry?.lastModified).toBe(NOW_UPDATED);
  });

  it("should date the Now section of llms-full.txt", () => {
    const text = buildLlmsFullTxt({ projects: [], posts: [], getPostMarkdown: () => null });
    expect(text).toContain(`## Now\n\nUpdated: ${NOW_UPDATED}\n\n### Building`);
  });
});
