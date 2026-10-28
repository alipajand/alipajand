/** @jest-environment node */

/*
 * Pins the publication policy for posts (see utils/publication.ts). A post is a draft, scheduled
 * until 00:00 America/Toronto on its `date`, or published. Only published posts appear on any
 * list, feed, export or sitemap; a scheduled post's article and OG image answer 404 unless it
 * opts into a `noindex` preview. Every surface reads the same clock, so they agree on either side
 * of midnight.
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
import {
  getAllPosts,
  getPostMarkdown,
  getPostsForWritingSection,
  getPublishedPosts,
  getRoutablePost,
} from "utils/posts";
import { isPublished, publicationInstant } from "utils/publication";

// The 2026-10-28 post is the repository's scheduled fixture: Toronto midnight is 04:00 UTC (EDT).
const SCHEDULED = "preparing-integrations-for-anthropic-and-cursor-directories";
const MIDNIGHT = publicationInstant("2026-10-28");
const BEFORE = new Date(MIDNIGHT.getTime() - 1);
const AFTER = new Date(MIDNIGHT.getTime() + 60 * 60 * 1000);

afterEach(() => {
  jest.useRealTimers();
});

const surfaces = async (slug: string, now: Date) => {
  jest.useFakeTimers().setSystemTime(now);
  const url = `${CANONICAL_URL}/writing/${slug}`;
  const { featured, recent } = getPostsForWritingSection(50, now);
  const [rss, summary, full] = await Promise.all(
    [feed(), llms(), llmsFull()].map((response) => response.text())
  );
  return {
    article: getRoutablePost(slug, now) !== null,
    writingIndex: getPublishedPosts(now).some((post) => post.slug === slug),
    home: [featured, ...recent].some((post) => post?.slug === slug),
    sitemap: sitemap().some((entry) => entry.url === url),
    rss: rss.includes(`<guid isPermaLink="true">${url}</guid>`),
    llms: summary.includes(url),
    llmsFull: full.includes(url),
  };
};

describe("writing publication policy", () => {
  it("should keep drafts out of the repository (P1)", () => {
    const dir = join(process.cwd(), "content", "posts");
    for (const file of readdirSync(dir)) {
      const head = readFileSync(join(dir, file), "utf8").split("\n---")[0];
      expect(head).not.toMatch(/^draft:\s*true/m);
    }
  });

  it("should still have the scheduled fixture this file depends on", () => {
    expect(getAllPosts().find((post) => post.slug === SCHEDULED)?.date).toBe("2026-10-28");
    expect(MIDNIGHT.toISOString()).toBe("2026-10-28T04:00:00.000Z");
  });

  it.each([
    ["one millisecond before Toronto midnight", BEFORE, false],
    ["at Toronto midnight", MIDNIGHT, true],
    ["an hour after Toronto midnight", AFTER, true],
  ])("should show the post on every surface or none %s", async (_label, now, shown) => {
    const seen = await surfaces(SCHEDULED, now);
    expect(Object.values(seen).every((value) => value === shown)).toBe(true);
  });

  it("should agree with isPublished for every post at the same instant", async () => {
    for (const post of getAllPosts()) {
      const seen = await surfaces(post.slug, BEFORE);
      for (const value of Object.values(seen)) expect(value).toBe(isPublished(post, BEFORE));
    }
  });

  it("should generate every non-draft route so a scheduled slug exists in the route table", async () => {
    const params = (await generateStaticParams()).map(({ slug }) => slug);
    expect(params).toContain(SCHEDULED);
    expect(params).toHaveLength(getAllPosts().filter((post) => !post.draft).length);
  });

  // P4: a link from a published page to an unpublished post is a 404 until that post's date.
  it("should not link from a published page to a post that is not published yet", () => {
    const now = new Date();
    const published = new Set(getPublishedPosts(now).map((post) => post.slug));
    const posts = new Set(getAllPosts().map((post) => post.slug));
    const linked = (text: string) =>
      [...text.matchAll(/\/writing\/([a-z0-9-]+)(?![a-z0-9.-])/g)].map((match) => match[1]);

    const sources: Array<[string, string]> = [
      ...[...published].map((slug): [string, string] => [slug, getPostMarkdown(slug) ?? ""]),
      ...readdirSync(join(process.cwd(), "data"), { recursive: true })
        .map(String)
        .filter((file) => file.endsWith(".ts"))
        .map((file): [string, string] => [
          `data/${file}`,
          readFileSync(join(process.cwd(), "data", file), "utf8"),
        ]),
    ];
    const problems = sources.flatMap(([source, text]) =>
      linked(text)
        .filter((slug) => posts.has(slug) && !published.has(slug))
        .map((slug) => `${source} links to unpublished /writing/${slug}`)
    );
    expect(problems).toEqual([]);
  });
});
