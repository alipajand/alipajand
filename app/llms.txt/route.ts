import { buildLlmsTxt } from "utils/llms";
import { currentTime } from "utils/clock";
import { getPublishedPosts } from "utils/posts";
import { getDedicatedCaseStudyProjects } from "utils/projects";

export const dynamic = "force-static";

export const revalidate = 3600;

export function GET() {
  return new Response(
    buildLlmsTxt({
      projects: getDedicatedCaseStudyProjects(),
      posts: getPublishedPosts(currentTime()),
    }),
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    }
  );
}
