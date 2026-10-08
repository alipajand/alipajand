import type { MetadataRoute } from "next";

import { CANONICAL_URL } from "data/site";

/**
 * AI answer-engine and search crawlers that are explicitly welcome to read the
 * public site. Listing them makes the intent unambiguous instead of relying on
 * the wildcard rule alone.
 */
export const AI_CRAWLER_USER_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
] as const;

const DISALLOWED_PATHS = ["/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: [...AI_CRAWLER_USER_AGENTS],
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
    ],
    sitemap: `${CANONICAL_URL}/sitemap.xml`,
  };
}
