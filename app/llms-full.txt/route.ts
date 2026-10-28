import { buildLlmsFullTxt } from "utils/llms";
import { currentTime } from "utils/clock";
import { getPostMarkdown, getPublishedPosts } from "utils/posts";
import { getDedicatedCaseStudyProjects } from "utils/projects";

export const dynamic = "force-static";

/** Hourly, so a scheduled post goes live within an hour of its date without a deploy. */
export const revalidate = 3600;

export function GET() {
  return new Response(
    buildLlmsFullTxt({
      projects: getDedicatedCaseStudyProjects(),
      posts: getPublishedPosts(currentTime()),
      getPostMarkdown,
    }),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}
