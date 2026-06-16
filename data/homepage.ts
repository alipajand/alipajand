export interface HomepageCaseStudy {
  id: string;
  label: string;
  title: string;
  summary: string;
  tags: [string, string, string];
  href: string;
  image?: {
    src: string;
    alt: string;
    caption?: string;
    illustrative?: false;
  };
  illustrativeLabel?: string;
}

export interface HomepageCapability {
  id: string;
  title: string;
  body: string;
}

export interface HomepageOpenSourceTool {
  name: string;
  repositoryUrl: string;
  problem: string;
  capabilities: [string, string, string];
}

export const HOMEPAGE_HERO_NAME = "Ali Pajand";
export const HOMEPAGE_HERO_EYEBROW = "Senior Product Engineer · Montreal";
export const HOMEPAGE_HERO_TITLE = "I design and ship frontend systems for complex products.";
export const HOMEPAGE_HERO_BODY =
  "I work across product decisions, interface design, design systems, frontend architecture, and developer tooling—turning ambiguous requirements into accessible, reliable production workflows.";
export const HOMEPAGE_HERO_PRIMARY_CTA_LABEL = "View case studies";
export const HOMEPAGE_HERO_PRIMARY_CTA_HREF = "/portfolio#case-studies";
export const HOMEPAGE_HERO_SECONDARY_CTA_LABEL = "Read my engineering principles";
export const HOMEPAGE_HERO_SECONDARY_CTA_HREF = "/engineering-principles";
export const HOMEPAGE_HERO_AVAILABILITY =
  "Open to senior product engineering, frontend architecture, design systems, and developer experience roles.";

export const HOMEPAGE_CASE_STUDIES_HEADING = "Selected case studies";
export const HOMEPAGE_CASE_STUDIES_LEDE =
  "A sample of the product and engineering work I’ve owned across AI-assisted workflows, shared frontend systems, and high-constraint interfaces.";
export const HOMEPAGE_CASE_STUDIES: HomepageCaseStudy[] = [
  {
    id: "ledgerguard",
    label: "Independent SaaS product",
    title: "Making AI-assisted contract review traceable and recoverable",
    summary:
      "A human-in-the-loop workflow for document extraction, source evidence, validation, renewal risk, and financial commitments.",
    tags: ["Product ownership", "AI workflows", "Next.js"],
    href: "/portfolio#project-ledgerguard-deterministic-commitments-ledger",
    image: {
      src: "/portfolio-media/ledgerguard.png",
      alt: "LedgerGuard contract review workflow with source evidence and renewal risk states.",
      caption: "Real product screenshot",
    },
  },
  {
    id: "alwaysgeeky",
    label: "Senior Frontend Engineer",
    title: "Building shared product foundations without slowing delivery",
    summary:
      "Design-system, authentication, marketplace, and release-quality work across a growing product surface.",
    tags: ["Design systems", "Frontend architecture", "DX"],
    href: "/portfolio#project-design-system-marketplace-login-web3",
    image: {
      src: "/portfolio-media/alwaysgeeky-marketplace.png",
      alt: "AlwaysGeeky marketplace screenshot showing shared product components and navigation.",
      caption: "Real product screenshot",
    },
  },
  {
    id: "emplifi",
    label: "Enterprise product engineering",
    title: "Rendering high-frequency data in constrained interfaces",
    summary:
      "Interactive React, D3.js, and GSAP experiences designed for large datasets, embedded contexts, and mobile webviews.",
    tags: ["Data visualization", "Performance", "React"],
    href: "/portfolio#project-data-dashboards-emplifi",
    illustrativeLabel: "Illustrative reconstruction",
  },
  {
    id: "mapbylaw",
    label: "Independent product",
    title: "Turning zoning evidence into explainable recommendations",
    summary:
      "A product workflow that keeps AI recommendations grounded in source evidence and explicit feasibility constraints.",
    tags: ["Product engineering", "AI reliability", "UX"],
    href: "/portfolio#project-mapbylaw-platform-ui-ai-reports",
    image: {
      src: "/portfolio-media/mapbylaw.png",
      alt: "MapBylaw property analysis workflow with feasibility details and recommendation context.",
      caption: "Real product screenshot",
    },
  },
];

export const HOMEPAGE_CAPABILITIES_HEADING = "Core capabilities";
export const HOMEPAGE_CAPABILITIES: HomepageCapability[] = [
  {
    id: "product-engineering",
    title: "Product engineering",
    body: "I turn incomplete requirements into clear workflows, implementation decisions, and production-ready interfaces.",
  },
  {
    id: "frontend-architecture",
    title: "Frontend architecture",
    body: "I design typed React and Next.js systems that remain understandable as product states, data flows, and teams grow.",
  },
  {
    id: "design-systems",
    title: "Design systems",
    body: "I build component foundations that align accessibility, visual consistency, responsive behaviour, and practical escape hatches.",
  },
  {
    id: "developer-experience",
    title: "Developer experience",
    body: "I improve feedback loops through testing, CI, documentation, deterministic automation, and focused engineering tools.",
  },
];

export const HOMEPAGE_OPEN_SOURCE_HEADING = "Open-source tools";
export const HOMEPAGE_OPEN_SOURCE_LEDE =
  "Two focused tools from my open-source work on safer, more explainable engineering workflows.";
export const HOMEPAGE_OPEN_SOURCE_TOOLS: HomepageOpenSourceTool[] = [
  {
    name: "agent-pr-reviewer-lite",
    repositoryUrl: "https://github.com/alipajand/agent-pr-reviewer-lite",
    problem:
      "Catches risky pull-request changes in security-sensitive and product-critical areas before human review starts.",
    capabilities: [
      "Inspects local diffs and pull requests with deterministic rules",
      "Flags risky route, env, dependency, migration, and security-sensitive changes",
      "Surfaces missing or weakened tests in high-risk areas",
    ],
  },
  {
    name: "agent-context-doctor",
    repositoryUrl: "https://github.com/alipajand/agent-context-doctor",
    problem:
      "Audits agent instruction files for contradictions, stale guidance, and missing repository context.",
    capabilities: [
      "Checks AGENTS.md, CLAUDE.md, Cursor rules, and prompt documents",
      "Finds contradictory instructions, unsafe guidance, and invalid commands",
      "Reports missing boundaries, validation paths, and final-report expectations",
    ],
  },
];

export const HOMEPAGE_OPEN_SOURCE_CTA_LABEL = "Explore all open-source work";
export const HOMEPAGE_OPEN_SOURCE_CTA_HREF = "/open-source";

export const HOMEPAGE_WRITING_HEADING = "Featured writing";
