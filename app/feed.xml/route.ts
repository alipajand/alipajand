import { buildRssFeed } from "utils/feed";
import { currentTime } from "utils/clock";
import { getPublishedPosts } from "utils/posts";

export const dynamic = "force-static";

/** Hourly, so a scheduled post goes live within an hour of its date without a deploy. */
export const revalidate = 3600;

export function GET() {
  return new Response(buildRssFeed(getPublishedPosts(currentTime())), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
