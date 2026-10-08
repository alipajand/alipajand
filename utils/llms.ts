import { ABOUT_PARAGRAPHS } from "data/about";
import {
  ENGINEERING_PRINCIPLES_LEDE,
  ENGINEERING_PRINCIPLES_META_DESCRIPTION,
  ENGINEERING_PRINCIPLES_SECTIONS,
} from "data/engineeringPrinciples";
import { HOMEPAGE_HERO_BODY, HOMEPAGE_HERO_TITLE } from "data/homepage";
import { LINKS } from "data/links";
import { NOW_META_DESCRIPTION, NOW_SECTIONS } from "data/now";
import {
  OPEN_SOURCE_INSTALL_NOTE,
  OPEN_SOURCE_META_DESCRIPTION,
  OPEN_SOURCE_PROJECTS,
  openSourceReleaseLabel,
} from "data/openSourcePage";
import type { Project } from "data/projects";
import { PORTFOLIO_META_DESCRIPTION, PORTFOLIO_PROFILE_DETAILS } from "data/projects";
import {
  CANONICAL_URL,
  KEYWORDS,
  PERSON_SCHEMA_JOB_TITLE,
  SITE_META_DESCRIPTION,
  SITE_NAME,
} from "data/site";
import { WRITING_INDEX_DESCRIPTION } from "data/writing";
import type { PostSummary } from "utils/posts";

export const LLMS_TXT_PATH = "/llms.txt";
export const LLMS_FULL_TXT_PATH = "/llms-full.txt";

const bulletList = (items: readonly string[]): string =>
  items.map((item) => `- ${item}`).join("\n");

const caseStudyUrl = (project: Project): string => `${CANONICAL_URL}/portfolio/${project.slug}`;

const postUrl = (post: PostSummary): string => `${CANONICAL_URL}/writing/${post.slug}`;

const contactLines = (): string => LINKS.map((link) => `- ${link.label}: ${link.href}`).join("\n");

/**
 * Short, link-first summary of the site following the llms.txt convention:
 * an H1, a blockquote summary, then sections of annotated links.
 */
export const buildLlmsTxt = ({
  projects,
  posts,
}: {
  projects: Project[];
  posts: PostSummary[];
}): string => {
  const caseStudies = projects
    .map(
      (project) => `- [${project.caseStudyTitle}](${caseStudyUrl(project)}): ${project.cardProblem}`
    )
    .join("\n");

  const openSource = OPEN_SOURCE_PROJECTS.map(
    (project) => `- [${project.title}](${project.repositoryUrl}): ${project.summary}`
  ).join("\n");

  const writing = posts
    .map((post) => `- [${post.title}](${postUrl(post)}): ${post.seoDescription ?? post.excerpt}`)
    .join("\n");

  return [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_META_DESCRIPTION}`,
    "",
    `${SITE_NAME} is a ${PERSON_SCHEMA_JOB_TITLE}. ${PORTFOLIO_PROFILE_DETAILS}`,
    "",
    `Focus areas: ${KEYWORDS.join(", ")}.`,
    "",
    "## Pages",
    "",
    `- [Home](${CANONICAL_URL}/): ${HOMEPAGE_HERO_TITLE}`,
    `- [Portfolio](${CANONICAL_URL}/portfolio): ${PORTFOLIO_META_DESCRIPTION}`,
    `- [Open source](${CANONICAL_URL}/open-source): ${OPEN_SOURCE_META_DESCRIPTION}`,
    `- [Engineering principles](${CANONICAL_URL}/engineering-principles): ${ENGINEERING_PRINCIPLES_META_DESCRIPTION}`,
    `- [Writing](${CANONICAL_URL}/writing): ${WRITING_INDEX_DESCRIPTION}`,
    `- [Now](${CANONICAL_URL}/now): ${NOW_META_DESCRIPTION}`,
    "",
    "## Case studies",
    "",
    caseStudies,
    "",
    "## Open source",
    "",
    openSource,
    "",
    "## Writing",
    "",
    writing,
    "",
    "## Contact",
    "",
    contactLines(),
    "",
    "## Optional",
    "",
    `- [Full text for language models](${CANONICAL_URL}${LLMS_FULL_TXT_PATH}): Case studies, open-source projects, principles, and every article in one plain-text file.`,
    `- [RSS feed](${CANONICAL_URL}/feed.xml): Writing feed.`,
    `- [Sitemap](${CANONICAL_URL}/sitemap.xml): Every indexable URL.`,
    "",
  ].join("\n");
};

const caseStudySection = (project: Project): string => {
  const { caseStudy } = project;
  const decisions = caseStudy.technicalDecisions
    .map(
      (decision) =>
        `- ${decision.decision}\n  - Why: ${decision.why}\n  - Trade-off: ${decision.tradeOff}\n  - Result: ${decision.result}`
    )
    .join("\n");

  return [
    `### ${project.caseStudyTitle}`,
    "",
    `URL: ${caseStudyUrl(project)}`,
    `Context: ${project.employerContext}`,
    `Role: ${project.role}`,
    project.timeframe ? `Timeframe: ${project.timeframe}` : null,
    `Capabilities: ${project.capabilityTags.join(", ")}`,
    "",
    caseStudy.overview,
    "",
    "#### Context",
    "",
    caseStudy.context,
    "",
    "#### Problem",
    "",
    caseStudy.problem,
    "",
    "#### Role",
    "",
    bulletList(caseStudy.myRole),
    "",
    "#### What was built",
    "",
    bulletList(caseStudy.whatIBuilt),
    "",
    "#### Technical decisions",
    "",
    decisions,
    "",
    "#### UX decisions",
    "",
    bulletList(caseStudy.uxDecisions),
    "",
    "#### Outcome",
    "",
    bulletList(caseStudy.outcome),
    "",
    "#### Next improvements",
    "",
    bulletList(caseStudy.nextImprovements),
  ]
    .filter((line) => line !== null)
    .join("\n");
};

/**
 * Long-form plain-text export of the site so answer engines can read the
 * substance without executing client-side code.
 */
export const buildLlmsFullTxt = ({
  projects,
  posts,
  getPostMarkdown,
}: {
  projects: Project[];
  posts: PostSummary[];
  getPostMarkdown: (slug: string) => string | null;
}): string => {
  const openSource = OPEN_SOURCE_PROJECTS.map((project) =>
    [
      `### ${project.title}`,
      "",
      `Repository: ${project.repositoryUrl}`,
      `Latest release: ${openSourceReleaseLabel(project)}`,
      `Format: ${project.format}`,
      `Install: ${project.install}`,
      "",
      project.summary,
      "",
      bulletList(project.testedCapabilities),
      "",
      project.contribution,
    ].join("\n")
  ).join("\n\n");

  const principles = ENGINEERING_PRINCIPLES_SECTIONS.map((section) =>
    [`### ${section.title}`, "", section.paragraphs.join("\n\n")].join("\n")
  ).join("\n\n");

  const now = NOW_SECTIONS.map((section) =>
    [`### ${section.title}`, "", bulletList(section.items)].join("\n")
  ).join("\n\n");

  const articles = posts
    .map((post) => {
      const body = getPostMarkdown(post.slug);
      return [
        `### ${post.title}`,
        "",
        `URL: ${postUrl(post)}`,
        post.date ? `Published: ${post.date}` : null,
        post.tags?.length ? `Tags: ${post.tags.join(", ")}` : null,
        "",
        body ?? post.excerpt,
      ]
        .filter((line) => line !== null)
        .join("\n");
    })
    .join("\n\n---\n\n");

  return [
    `# ${SITE_NAME} — ${PERSON_SCHEMA_JOB_TITLE}`,
    "",
    `> ${SITE_META_DESCRIPTION}`,
    "",
    `Website: ${CANONICAL_URL}`,
    PORTFOLIO_PROFILE_DETAILS,
    "",
    "## Summary",
    "",
    HOMEPAGE_HERO_TITLE,
    "",
    HOMEPAGE_HERO_BODY,
    "",
    "## How I work",
    "",
    ABOUT_PARAGRAPHS.join("\n\n"),
    "",
    "## Contact",
    "",
    contactLines(),
    "",
    "## Case studies",
    "",
    projects.map(caseStudySection).join("\n\n"),
    "",
    "## Open source",
    "",
    OPEN_SOURCE_INSTALL_NOTE,
    "",
    openSource,
    "",
    "## Engineering principles",
    "",
    ENGINEERING_PRINCIPLES_LEDE,
    "",
    principles,
    "",
    "## Now",
    "",
    now,
    "",
    "## Writing",
    "",
    articles,
    "",
  ].join("\n");
};
