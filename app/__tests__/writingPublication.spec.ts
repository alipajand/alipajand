/** @jest-environment node */

/*
 * Pins the current publication policy for posts dated after today (in the site's time zone). There
 * is no draft state: every Markdown file in content/posts is a post. A future-dated post is
 * previewed rather than hidden:
 * - shown on /writing, flagged "Upcoming" with a "Preview article" link;
 * - built as a static article route and listed in the sitemap, RSS feed, llms.txt and
 *   llms-full.txt;
 * - kept off the home page and out of the /writing CollectionPage structured data until its date.
 * If that policy changes, these expectations are the ones to update.
 */

jest.mock("marked", () =>
  jest.requireActual(
    jest
      .requireActual<typeof import("path")>("path")
      .join(process.cwd(), "node_modules/marked/lib/marked.umd.js")
  )
);

import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import { GET as feed } from "../feed.xml/route";
import { GET as llmsFull } from "../llms-full.txt/route";
import { GET as llms } from "../llms.txt/route";
import sitemap from "../sitemap";
import { generateStaticParams } from "../writing/[slug]/page";
import { CANONICAL_URL } from "data/site";
import { isPostPublished } from "utils/date";
import { getAllPosts, getPostsForWritingSection, getPublishedPosts } from "utils/posts";

const TODAY = new Date("2026-10-27T16:00:00Z");
const DAY_AFTER = new Date("2026-10-29T16:00:00Z");
const upcoming = () => getAllPosts().filter((post) => !isPostPublished(post.date, TODAY));

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(TODAY);
});

afterEach(() => {
  jest.useRealTimers();
});

describe("writing publication policy", () => {
  it("should have no draft state in post front matter", () => {
    const dir = join(process.cwd(), "content", "posts");
    for (const file of readdirSync(dir)) {
      const head = readFileSync(join(dir, file), "utf8").split("\n---")[0];
      expect(head).not.toMatch(/^draft:/m);
    }
  });

  it("should treat a post dated tomorrow in Toronto as upcoming until its date", () => {
    expect(upcoming().length).toBeGreaterThan(0);
    for (const post of upcoming()) expect(post.date > "2026-10-27").toBe(true);
    for (const post of upcoming()) {
      expect(getPublishedPosts(TODAY).some((value) => value.slug === post.slug)).toBe(false);
    }
    expect(getPublishedPosts(DAY_AFTER)).toHaveLength(getAllPosts().length);
  });

  it("should keep upcoming posts off the home page", () => {
    const { featured, recent } = getPostsForWritingSection(20, TODAY);
    const shown = [featured, ...recent].filter(Boolean).map((post) => post!.slug);
    for (const post of upcoming()) expect(shown).not.toContain(post.slug);
  });

  it("should still build the article route and list it in the sitemap", async () => {
    const params = (await generateStaticParams()).map(({ slug }) => slug);
    const urls = sitemap().map((entry) => entry.url);
    for (const post of upcoming()) {
      expect(params).toContain(post.slug);
      expect(urls).toContain(`${CANONICAL_URL}/writing/${post.slug}`);
    }
  });

  it("should still list it in the RSS feed, llms.txt and llms-full.txt", async () => {
    const [rss, summary, full] = await Promise.all(
      [feed(), llms(), llmsFull()].map((r) => r.text())
    );
    for (const post of upcoming()) {
      const url = `${CANONICAL_URL}/writing/${post.slug}`;
      expect(rss).toContain(`<guid isPermaLink="true">${url}</guid>`);
      expect(summary).toContain(url);
      expect(full).toContain(url);
    }
  });
});
