// Content layer for the P1 concept prototypes.
//
// Every project fact is read from data/projects.ts at build time. The only text written here is
// the short index line per project (each one is condensed from that project's cardProblem,
// overview, or myRole in data/projects.ts) and the owner decisions recorded in
// owner-decisions.md (tiers, closed/omitted links, figures without provenance).

import { PORTFOLIO_CASE_STUDY_ORDER, PROJECTS } from "../../../../../data/projects.ts";

export const TIERS = {
  featured: ["ledgerguard", "alwaysgeeky", "emplifi"],
  supporting: ["agent-tooling", "tallyfolio", "controltech"],
  experiment: ["mapbylaw"],
};

export const TIER_LABEL = {
  featured: "Featured",
  supporting: "Supporting",
  experiment: "Experiment",
};

const INDEX_LINE = {
  ledgerguard:
    "Built alone across the Next.js product, Fastify API, PostgreSQL schema, and a queue-backed document pipeline, with AI-suggested values kept apart from confirmed contract data until someone reviews them.",
  alwaysgeeky:
    "Built and owned the shared React and TypeScript library four product surfaces were built on, with Storybook as the contract and CI gates that caught drift before it shipped.",
  emplifi:
    "Dense D3.js analytics modules assembled from shared accessible components, with rendering work profiled on the embedded mobile-webview path where the cost showed up.",
  "agent-tooling":
    "Three TypeScript CLIs and a GitHub Action that make repository readiness, agent settings, and pull-request risk checkable in CI.",
  tallyfolio:
    "A manual-first finance PWA with integer minor-unit money math, in-memory CSV import review, and AI limited to explaining figures already computed.",
  controltech:
    "Four years at a startup studio taking SaaS products, dashboards, and PWAs from MVP to production, with the test coverage that made repeated releases survivable.",
  mapbylaw:
    "A Montreal zoning experiment where one typed AI-recommendation contract is shared by the Fastify API, the React dashboard, and the PDF report.",
};

// Capability groupings used by the Interface Atlas highlight filter. Derived from each project's
// capabilityTags and case-study text; they group existing claims and add none.
export const CAPABILITIES = [
  {
    id: "frontend",
    label: "Frontend architecture",
    slugs: ["ledgerguard", "alwaysgeeky", "emplifi", "controltech"],
  },
  { id: "design-systems", label: "Design systems", slugs: ["alwaysgeeky", "emplifi"] },
  {
    id: "full-stack",
    label: "APIs and data",
    slugs: ["ledgerguard", "tallyfolio", "mapbylaw"],
  },
  {
    id: "ai",
    label: "AI review boundaries",
    slugs: ["ledgerguard", "tallyfolio", "mapbylaw", "agent-tooling"],
  },
  { id: "performance", label: "Rendering performance", slugs: ["emplifi"] },
  {
    id: "dx",
    label: "Testing and DX",
    slugs: ["alwaysgeeky", "agent-tooling", "controltech"],
  },
];

// Real pixel sizes of the source screenshots (read with sips). tallyfolio-dashboard is declared
// as 3454x1982 in data/projects.ts but the file is 3456x2234 (finding F-11).
const MEDIA_SIZE = {
  "ledgerguard-landing": [3456, 2234],
  "ledgerguard-login": [3456, 2234],
  "ledgerguard-dashboard": [3456, 2234],
  "alwaysgeeky-marketplace": [3456, 2234],
  "alwaysgeeky-login": [3456, 2234],
  "tallyfolio-landing": [3186, 1768],
  "tallyfolio-dashboard": [3456, 2234],
  "mapbylaw-landing": [3456, 2234],
  "mapbylaw-dashboard": [3452, 1980],
};

const SITE = "https://alipajand.com";

export const PROFILE = {
  name: "Ali Pajand",
  role: "Senior Software Engineer",
  focus: "Frontend architecture, design systems, and full-stack product work",
  stack: "React, TypeScript, Next.js, Node.js",
  // Sentences 1 and 2 come from PORTFOLIO_PAGE_INTRO paragraphs 1 and 4.
  thesis:
    "Nine-plus years of production web work, with frontend architecture as the specialization. Each case study covers the problem, what I owned, the decisions that mattered, and what I traded away to get there.",
  location: "Montreal, Canada",
  availability: "Open to remote work within Canada",
  languages: "English: professional. French: intermediate.",
  contact: [
    {
      label: "Book a call",
      host: "calendly.com/alipajand/intro",
      href: "https://calendly.com/alipajand/intro",
    },
    { label: "GitHub", host: "github.com/alipajand", href: "https://github.com/alipajand" },
    {
      label: "LinkedIn",
      host: "linkedin.com/in/alipajand",
      href: "https://linkedin.com/in/alipajand",
    },
  ],
  nav: [
    { label: "Portfolio", href: "index.html", current: true },
    { label: "Open Source", href: `${SITE}/open-source` },
    { label: "Writing", href: `${SITE}/writing` },
    { label: "Principles", href: `${SITE}/principles` },
    { label: "Contact", href: `${SITE}/contact` },
  ],
};

// Sentences that carry a figure whose source is not yet established (owner decision 5).
export const PENDING_PATTERN = /\b(80|90)%/;

const hostOf = (href) => new URL(href).host.replace(/^www\./, "");

const absolutize = (href) => (href.startsWith("/") ? `${SITE}${href}` : href);

function linksFor(project) {
  if (project.slug === "alwaysgeeky") {
    return [
      {
        label: "Voxies Marketplace",
        status: "closed",
        note: "Closed July 2026. Shown as historical work.",
      },
      ...project.liveLinks
        .filter((l) => !l.href.includes("market.voxies.io"))
        .map((l) => ({
          label: `Voxies ${l.label.toLowerCase()}`,
          href: l.href,
          host: hostOf(l.href),
          status: "live",
        })),
    ];
  }
  // ControlTech: website omitted until a working destination is verified (owner decision 4).
  if (project.slug === "controltech") return [];
  return project.liveLinks.map((l) => ({
    label: l.label,
    href: l.href,
    host: hostOf(l.href),
    status: "live",
  }));
}

function figuresFor(project) {
  return (project.caseStudy.interfaceEvidence ?? [])
    .filter((f) => f.src)
    .map((f) => {
      const key = f.src.replace("/portfolio-media/", "").replace(".png", "");
      const [w, h] = MEDIA_SIZE[key];
      return {
        ...f,
        key,
        ratio: h / w,
        historical: key === "alwaysgeeky-marketplace",
      };
    });
}

const tierOf = (slug) => Object.keys(TIERS).find((t) => TIERS[t].includes(slug));

export const projects = PORTFOLIO_CASE_STUDY_ORDER.map((slug, i) => {
  const p = PROJECTS.find((x) => x.slug === slug);
  const diagrams = p.caseStudy.diagrams ?? [];
  const pick = (type) => diagrams.find((d) => d.spec.type === type)?.spec;
  return {
    ...p,
    order: i + 1,
    tier: tierOf(slug),
    indexLine: INDEX_LINE[slug],
    links: linksFor(p),
    related: p.relatedLinks.map((l) => ({ ...l, href: absolutize(l.href) })),
    figures: figuresFor(p),
    layers: pick("layers"),
    flow: pick("flow"),
    compare: pick("compare"),
    keyDecision: p.caseStudy.technicalDecisions[0],
    capabilities: CAPABILITIES.filter((c) => c.slugs.includes(slug)).map((c) => c.id),
  };
});

export const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));

export const tierProjects = (tier) => projects.filter((p) => p.tier === tier);

export const nextProject = (slug) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
