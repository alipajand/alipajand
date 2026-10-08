import { buildRssFeed } from "utils/feed";
import { getAllPosts } from "utils/posts";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildRssFeed(getAllPosts()), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
