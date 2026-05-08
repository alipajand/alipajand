export const ENGINEERING_PRINCIPLES_META_DESCRIPTION =
  "How I approach engineering: systems first, reliability as product, AI trust boundaries, accessibility, fast feedback loops, and product thinking over ticket thinking.";

export const ENGINEERING_PRINCIPLES_PAGE_TITLE = "Engineering principles";

export const ENGINEERING_PRINCIPLES_HEADER_OVERLINE = "Philosophy";

export const ENGINEERING_PRINCIPLES_LEDE =
  "Philosophy and architectural habits that help me ship software that stays understandable as it scales.";

export interface EngineeringPrinciplesSection {
  id: string;
  title: string;
  paragraphs: [string, string] | [string];
}

export const ENGINEERING_PRINCIPLES_SECTIONS: EngineeringPrinciplesSection[] = [
  {
    id: "systems-first",
    title: "Systems First",
    paragraphs: [
      "I start from boundaries, contracts, and failure modes, not from the trendiest framework. Structure follows what the product must guarantee: isolation between domains, clear ownership of data flow, and fewer clever shortcuts that only work on demo day.",
      "That mindset scales teams: when the system model is honest, onboarding is faster and refactors stop feeling like archaeology.",
    ],
  },
  {
    id: "reliability-is-product",
    title: "Reliability Is Product",
    paragraphs: [
      "Users experience outages, flaky flows, and silent bugs as product failures, not infra tickets. Observability, rollback discipline, and CI that catches regressions early are how you earn trust at release cadence.",
      "Velocity without reliability is theater; reliability without empathy for operators is brittle. I optimize for both sides of that balance.",
    ],
  },
  {
    id: "ai-needs-trust-boundaries",
    title: "AI Needs Trust Boundaries",
    paragraphs: [
      "Models are powerful and non-deterministic; products still need predictable outcomes. I separate probabilistic surfaces from deterministic cores, surface confidence where it matters, and keep humans in the loop when stakes are high.",
      "Traceability wins over magic: show provenance, allow correction, and measure drift instead of guessing.",
    ],
  },
  {
    id: "accessibility-is-non-negotiable",
    title: "Accessibility Is Non-Negotiable",
    paragraphs: [
      "Accessibility is architectural: semantics, focus order, motion preferences, and keyboard paths shape the same contracts your automated tests should enforce. Retrofitting after launch is expensive and exclusionary.",
      "Inclusive defaults raise quality for everyone, not only screen reader users.",
    ],
  },
  {
    id: "fast-feedback-loops",
    title: "Fast Feedback Loops",
    paragraphs: [
      "Short loops beat big bets: typecheck and lint in the editor, tests in CI, previews for review, metrics after deploy. The goal is to catch wrong assumptions before they become tribal knowledge.",
      "When feedback is slow, teams compensate with process weight. When it is fast, process can stay thin.",
    ],
  },
  {
    id: "product-thinking-over-ticket-thinking",
    title: "Product Thinking Over Ticket Thinking",
    paragraphs: [
      "Tickets describe tasks; products describe outcomes. I ask what behavior should change for users and operators, what risks we accept, and what we will measure when we ship.",
      "That lens keeps architecture aligned with value instead of with backlog churn.",
    ],
  },
];
