import { buildLlmsTxt } from "utils/llms";
import { getAllPosts } from "utils/posts";
import { getDedicatedCaseStudyProjects } from "utils/projects";

export const dynamic = "force-static";

export function GET() {
  return new Response(
    buildLlmsTxt({ projects: getDedicatedCaseStudyProjects(), posts: getAllPosts() }),
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    }
  );
}
