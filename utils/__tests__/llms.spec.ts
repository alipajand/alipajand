/** @jest-environment node */

import { OPEN_SOURCE_PROJECTS } from "data/openSourcePage";
import { CANONICAL_URL, SITE_NAME } from "data/site";
import { buildLlmsFullTxt, buildLlmsTxt, LLMS_FULL_TXT_PATH } from "utils/llms";
import type { PostSummary } from "utils/posts";
import { getDedicatedCaseStudyProjects } from "utils/projects";

const posts: PostSummary[] = [
  {
    slug: "sample-post",
    title: "Sample post",
    date: "2026-01-02",
    excerpt: "Sample excerpt",
    tags: ["frontend"],
  },
];

describe("buildLlmsTxt", () => {
  const text = buildLlmsTxt({ projects: getDedicatedCaseStudyProjects(), posts });

  it("should start with the site name and a blockquote summary", () => {
    const [heading, , summary] = text.split("\n");
    expect(heading).toBe(`# ${SITE_NAME}`);
    expect(summary.startsWith("> ")).toBe(true);
  });

  it("should link every case study, open-source project, and post", () => {
    getDedicatedCaseStudyProjects().forEach((project) => {
      expect(text).toContain(`(${CANONICAL_URL}/portfolio/${project.slug})`);
    });
    OPEN_SOURCE_PROJECTS.forEach((project) => {
      expect(text).toContain(`[${project.title}](${project.repositoryUrl})`);
    });
    expect(text).toContain(`[Sample post](${CANONICAL_URL}/writing/sample-post): Sample excerpt`);
  });

  it("should point to the full-text export", () => {
    expect(text).toContain(`${CANONICAL_URL}${LLMS_FULL_TXT_PATH}`);
  });
});

describe("buildLlmsFullTxt", () => {
  it("should inline post bodies and fall back to the excerpt", () => {
    const withBody = buildLlmsFullTxt({
      projects: getDedicatedCaseStudyProjects(),
      posts,
      getPostMarkdown: () => "Full markdown body",
    });
    const withoutBody = buildLlmsFullTxt({
      projects: getDedicatedCaseStudyProjects(),
      posts,
      getPostMarkdown: () => null,
    });

    expect(withBody).toContain("Full markdown body");
    expect(withBody).toContain("Tags: frontend");
    expect(withoutBody).toContain("Sample excerpt");
  });

  it("should include each case study's decisions", () => {
    const text = buildLlmsFullTxt({
      projects: getDedicatedCaseStudyProjects(),
      posts: [],
      getPostMarkdown: () => null,
    });

    getDedicatedCaseStudyProjects().forEach((project) => {
      expect(text).toContain(`### ${project.caseStudyTitle}`);
      project.caseStudy.technicalDecisions.forEach((decision) => {
        expect(text).toContain(decision.decision);
      });
    });
  });
});
