import { buildRssFeed } from "utils/feed";
import { currentTime } from "utils/clock";
import { getPublishedPosts } from "utils/posts";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildRssFeed(getPublishedPosts(currentTime())), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
