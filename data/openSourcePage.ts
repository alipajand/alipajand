export type OpenSourceProjectStatus = "Active development" | "Experimental";

export interface OpenSourceProject {
  title: string;
  repositoryUrl: string;
  summary: string;
  status: OpenSourceProjectStatus;
  format: string;
  testedCapabilitiesLabel: string;
  testedCapabilities: string[];
  contribution: string;
  featured?: boolean;
}

export interface OpenSourcePrinciple {
  title: string;
  body: string;
}

export const OPEN_SOURCE_META_TITLE =
  "Open Source & Tooling — Ali Pajand · Frontend Developer Experience";
export const OPEN_SOURCE_META_DESCRIPTION =
  "Open source tooling projects for AI coding agent readiness, PR review automation, and frontend developer experience. agent-context-doctor, agent-pr-reviewer-lite, agent-readiness-kit. Ali Pajand.";

export const OPEN_SOURCE_HEADER_OVERLINE = "Open source";
export const OPEN_SOURCE_HEADER_HEADING = "Open Source & Tooling";
export const OPEN_SOURCE_HEADER_LEDE =
  "I use small tooling projects to explore how frontend teams can work better with AI agents, automated review feedback, and developer experience improvements.";
export const OPEN_SOURCE_HEADER_INTRO =
  "These are focused tools built to close specific gaps I’ve noticed while working with AI-assisted workflows.";

export const OPEN_SOURCE_FEATURED_HEADING = "Projects";
export const OPEN_SOURCE_FEATURED_LEDE =
  "Focused tools for better context quality, review feedback, and agent-readiness evaluation.";

export const OPEN_SOURCE_SUPPORTING_HEADING = "More tooling";
export const OPEN_SOURCE_SUPPORTING_LEDE =
  "Additional experiments in the same space, kept intentionally small and practical.";

export const OPEN_SOURCE_STATUS_LABEL = "Status";
export const OPEN_SOURCE_FORMAT_LABEL = "Format";

export const OPEN_SOURCE_CONTRIBUTION_LABEL = "What it demonstrates";

export const OPEN_SOURCE_REPOSITORY_LINK_LABEL = "Repository";

export const openSourceRepositoryAriaLabel = (projectTitle: string): string =>
  `Open ${projectTitle} repository on GitHub`;

export const OPEN_SOURCE_PROJECTS: OpenSourceProject[] = [
  {
    title: "agent-context-doctor",
    repositoryUrl: "https://github.com/alipajand/agent-context-doctor",
    summary:
      "Checks whether an AI coding agent has enough context, constraints, and instructions before implementation.",
    status: "Active development",
    format: "TypeScript CLI",
    testedCapabilitiesLabel: "Why it matters",
    testedCapabilities: [
      "Poor context is one of the most common sources of poor agent output.",
      "This tool makes the quality of that context easier to evaluate before the agent starts.",
    ],
    contribution: "I treat context quality as an engineering input, not an afterthought.",
    featured: true,
  },
  {
    title: "agent-pr-reviewer-lite",
    repositoryUrl: "https://github.com/alipajand/agent-pr-reviewer-lite",
    summary:
      "Lightweight PR review assistant focused on structured code-review feedback and risk detection.",
    status: "Active development",
    format: "TypeScript CLI",
    testedCapabilitiesLabel: "Why it matters",
    testedCapabilities: [
      "Generic AI review feedback is easy to ignore.",
      "Structured feedback by category is easier to act on and easier to evaluate.",
    ],
    contribution:
      "I think about code review as a system for producing actionable, categorized feedback.",
    featured: true,
  },
  {
    title: "agent-readiness-kit",
    repositoryUrl: "https://github.com/alipajand/agent-readiness-kit",
    summary:
      "Tooling for evaluating whether a frontend codebase or workflow is ready for agent-assisted development.",
    status: "Experimental",
    format: "TypeScript CLI",
    testedCapabilitiesLabel: "Why it matters",
    testedCapabilities: [
      "Teams often adopt AI-assisted development before their conventions, documentation, and tooling are ready for it.",
      "The tool helps teams spot those readiness gaps before agent output creates avoidable risk.",
    ],
    contribution:
      "I treat developer experience as a product problem, not just a configuration task.",
  },
];

export const OPEN_SOURCE_SHARED_PRINCIPLES_HEADING = "Working principles";

export const OPEN_SOURCE_SHARED_PRINCIPLES: OpenSourcePrinciple[] = [
  {
    title: "Context is part of the system",
    body: "Agent output quality depends heavily on the instructions, constraints, and repository guidance that exist before implementation starts.",
  },
  {
    title: "Feedback should be actionable",
    body: "Review tools are most useful when they produce categorized output that tells people what changed, why it matters, and where to look.",
  },
  {
    title: "Developer experience is product work",
    body: "Teams adopt tools more successfully when the workflow feels coherent and the friction is reduced intentionally.",
  },
];

export const OPEN_SOURCE_TECHNOLOGY_HEADING = "Technology and scope";

export const OPEN_SOURCE_TECHNOLOGY_BADGES = [
  "TypeScript",
  "Node.js",
  "CLI design",
  "GitHub Actions",
  "CI/CD",
  "Static analysis",
  "Developer experience",
] as const;

export const OPEN_SOURCE_CTA_HEADING = "Explore the repositories";
export const OPEN_SOURCE_CTA_BODY =
  "Browse the repositories directly for source, usage, and current status. The writing section covers the engineering ideas behind these tools.";
export const OPEN_SOURCE_CTA_PRIMARY_LABEL = "Browse GitHub profile";
export const OPEN_SOURCE_CTA_PRIMARY_HREF = "https://github.com/alipajand";
export const OPEN_SOURCE_CTA_SECONDARY_LABEL = "Read my writing";
export const OPEN_SOURCE_CTA_SECONDARY_HREF = "/writing";
