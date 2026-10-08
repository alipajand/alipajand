import { CANONICAL_URL, SITE_NAME } from "data/site";
import { WRITING_INDEX_DESCRIPTION } from "data/writing";
import type { PostSummary } from "utils/posts";

export const FEED_PATH = "/feed.xml";

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toRfc822 = (date: string): string | null => {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toUTCString();
};

export const buildRssFeed = (posts: PostSummary[]): string => {
  const items = posts
    .map((post) => {
      const url = `${CANONICAL_URL}/writing/${post.slug}`;
      const pubDate = toRfc822(post.date);
      const categories = (post.tags ?? [])
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join("\n");
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(post.seoDescription ?? post.excerpt)}</description>`,
        pubDate ? `      <pubDate>${pubDate}</pubDate>` : null,
        categories || null,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const lastBuildDate = posts.length > 0 ? toRfc822(posts[0].date) : null;

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(`${SITE_NAME} — Writing`)}</title>`,
    `    <link>${CANONICAL_URL}/writing</link>`,
    `    <description>${escapeXml(WRITING_INDEX_DESCRIPTION)}</description>`,
    "    <language>en</language>",
    `    <atom:link href="${CANONICAL_URL}${FEED_PATH}" rel="self" type="application/rss+xml" />`,
    lastBuildDate ? `    <lastBuildDate>${lastBuildDate}</lastBuildDate>` : null,
    items || null,
    "  </channel>",
    "</rss>",
    "",
  ]
    .filter(Boolean)
    .join("\n");
};
