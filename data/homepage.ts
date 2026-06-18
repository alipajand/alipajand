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
  illustrativeBody?: string;
}

export const HOMEPAGE_HERO_NAME = "Ali Pajand";
export const HOMEPAGE_HERO_EYEBROW = "Senior Product Engineer · Montreal";
export const HOMEPAGE_HERO_TITLE = "I design and ship frontend systems for complex products.";
export const HOMEPAGE_HERO_BODY =
  "I work across product decisions, interface design, design systems, frontend architecture, and developer tooling, turning ambiguous requirements into accessible, reliable production workflows.";
export const HOMEPAGE_HERO_PRIMARY_CTA_LABEL = "View case studies";
export const HOMEPAGE_HERO_PRIMARY_CTA_HREF = "/portfolio";
export const HOMEPAGE_HERO_SECONDARY_CTA_LABEL = "Read my engineering principles";
export const HOMEPAGE_HERO_SECONDARY_CTA_HREF = "/engineering-principles";

export const HOMEPAGE_CASE_STUDIES_HEADING = "Selected case studies";
export const HOMEPAGE_CASE_STUDIES_LEDE =
  "A sample of product and engineering work across AI-assisted workflows, shared frontend systems, and high-constraint interfaces.";
export const HOMEPAGE_CASE_STUDIES: HomepageCaseStudy[] = [
  {
    id: "ledgerguard",
    label: "Independent SaaS product",
    title: "Making AI-assisted contract review traceable and recoverable",
    summary:
      "A human-in-the-loop workflow for document extraction, source evidence, renewal risk, and financial commitments.",
    tags: ["Product ownership", "AI workflows", "Next.js"],
    href: "/portfolio/ledgerguard",
    image: {
      src: "/portfolio-media/ledgerguard-dashboard.png",
      alt: "LedgerGuard contract review workflow with source evidence and renewal risk states.",
      caption: "Real product screenshot",
    },
  },
  {
    id: "mapbylaw",
    label: "Independent product",
    title: "Turning zoning evidence into explainable recommendations",
    summary:
      "A product workflow that keeps AI recommendations grounded in source evidence and explicit feasibility constraints.",
    tags: ["Product engineering", "AI reliability", "UX"],
    href: "/portfolio/mapbylaw",
    image: {
      src: "/portfolio-media/mapbylaw-dashboard.png",
      alt: "MapBylaw property analysis workflow with feasibility details and recommendation context.",
      caption: "Real product screenshot",
    },
  },
];

export const HOMEPAGE_WRITING_HEADING = "Featured writing";
