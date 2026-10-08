import { buildLlmsFullTxt } from "utils/llms";
import { getAllPosts, getPostMarkdown } from "utils/posts";
import { getDedicatedCaseStudyProjects } from "utils/projects";

export const dynamic = "force-static";

export function GET() {
  return new Response(
    buildLlmsFullTxt({
      projects: getDedicatedCaseStudyProjects(),
      posts: getAllPosts(),
      getPostMarkdown,
    }),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}
