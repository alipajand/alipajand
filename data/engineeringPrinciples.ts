export const ENGINEERING_PRINCIPLES_META_DESCRIPTION =
  "How I set technical direction: product clarity first, explicit trade-offs, standards enforced by tooling, components as APIs, AI as acceleration rather than authority, honest interfaces, and maintainable systems. Ali Pajand.";

export const ENGINEERING_PRINCIPLES_PAGE_TITLE = "Engineering Principles";

export const ENGINEERING_PRINCIPLES_HEADER_OVERLINE = "Principles";

export const ENGINEERING_PRINCIPLES_LEDE =
  "How I set technical direction and make decisions across SaaS products, enterprise dashboards, AI-assisted workflows, and startup delivery. The first half is about the systems and standards other engineers build on; the second is about the interface quality I hold those systems to. They're also a fair preview of what I'll argue for in a design review.";

export const ENGINEERING_PRINCIPLES_EVIDENCE_LABEL = "Where this shows up";

export const ENGINEERING_PRINCIPLES_TOC_ARIA_LABEL = "Principles on this page";

export interface EngineeringPrinciplesEvidenceLink {
  label: string;
  href: string;
}

export interface EngineeringPrinciplesSection {
  id: string;
  title: string;
  paragraphs: [string, string] | [string];
  evidence: EngineeringPrinciplesEvidenceLink[];
}

export const ENGINEERING_PRINCIPLES_SECTIONS: EngineeringPrinciplesSection[] = [
  {
    id: "product-clarity",
    title: "Start from product clarity, not code volume",
    paragraphs: [
      "Before choosing an architecture, I want to know what decision the user is making and what the product must never get wrong. In LedgerGuard, that was whether a contract date came from a model or from a person confirming it against the document. That one distinction shaped the data model, the API, and the UI.",
      "Code written before that question is answered tends to be confident in the wrong places.",
    ],
    evidence: [
      { label: "LedgerGuard case study", href: "/portfolio/ledgerguard" },
      {
        label: "Truth between extraction and finance",
        href: "/writing/ledgerguard-truth-between-extraction-and-finance",
      },
    ],
  },
  {
    id: "explicit-trade-offs",
    title: "Make trade-offs explicit and write them down",
    paragraphs: [
      "Every meaningful decision costs something. I name the decision, why it was made, what it gives up, and what result I expect, so the people building on it can disagree with the reasoning instead of guessing at it.",
      "For library and convention changes that affect several product surfaces, that means a design doc before the change and driving its adoption afterwards, not announcing a rule and hoping it sticks.",
    ],
    evidence: [
      { label: "AlwaysGeeky case study", href: "/portfolio/alwaysgeeky" },
      {
        label: "How I approach senior frontend architecture",
        href: "/writing/how-i-approach-senior-frontend-architecture",
      },
    ],
  },
  {
    id: "enforced-standards",
    title: "Enforce standards with tooling, not memory",
    paragraphs: [
      "Conventions that only live in people's heads decay as soon as the team is busy. I put the baseline behind CI gates and run the same lint, type, and test scripts in the editor, so the feedback an engineer sees locally matches what will actually block the pull request.",
      "That keeps review attention, the scarcest resource on a team, on design decisions and product risk instead of on drift a machine could have caught.",
    ],
    evidence: [
      { label: "AlwaysGeeky case study", href: "/portfolio/alwaysgeeky" },
      {
        label: "Moving deterministic checks into the editor with MCP",
        href: "/writing/why-i-automate-code-review-with-mcp",
      },
    ],
  },
  {
    id: "components-as-apis",
    title: "Treat shared components as APIs",
    paragraphs: [
      "A component used across four product surfaces is an interface other engineers depend on. Its states, semantics, and escape hatches belong in the contract, documented where people already look, so each surface doesn't fill the gaps differently.",
      "Adoption comes from making the shared path easier than the local workaround and migrating incrementally, not from an all-at-once rewrite.",
    ],
    evidence: [
      { label: "AlwaysGeeky case study", href: "/portfolio/alwaysgeeky" },
      { label: "Design systems that stick", href: "/writing/design-systems-that-stick" },
    ],
  },
  {
    id: "ai-as-acceleration",
    title: "AI accelerates the work; it doesn't own the decisions",
    paragraphs: [
      "I use AI coding agents for planning, implementation, testing, and investigation, in structured stages and anchored to the project's real checks. Architecture, security, product judgment, and final review stay with me, because AI can generate options but it cannot own the consequences.",
      "The same rule shapes the tooling I build: deterministic checks that make weak agent context and risky changes visible, rather than claims of autonomous review.",
    ],
    evidence: [
      {
        label: "How I use AI in my frontend workflow",
        href: "/writing/how-i-use-ai-in-my-frontend-engineering-workflow",
      },
      { label: "Agent tooling case study", href: "/portfolio/agent-tooling" },
    ],
  },
  {
    id: "honest-interfaces",
    title: "Build honest interfaces, especially around AI",
    paragraphs: [
      "The UI should make the state of the system legible instead of smoothing over uncertainty. When data is partial, stale, or inferred, the interface should say so plainly rather than borrowing confidence from the design.",
      "AI-assisted features need an explicit boundary between suggested output and confirmed truth: review flows where people can inspect the source, correct the result, and see what remains uncertain.",
    ],
    evidence: [
      { label: "LedgerGuard case study", href: "/portfolio/ledgerguard" },
      { label: "MapBylaw recommendations", href: "/writing/mapbylaw-ai-recommendations" },
    ],
  },
  {
    id: "visible-states",
    title: "Design the async and edge-case states first",
    paragraphs: [
      "Loading, retrying, partial success, failure, missing data, and long-running jobs are part of the product, not temporary engineering details. I want to know where they will surface before polishing the happy path.",
      "When those states are invisible, users guess what the system is doing, and the result is duplicate actions and fragile workflows.",
    ],
    evidence: [
      { label: "LedgerGuard case study", href: "/portfolio/ledgerguard" },
      {
        label: "Designing a document review workspace",
        href: "/writing/how-i-would-design-a-document-review-workspace",
      },
    ],
  },
  {
    id: "typed-contracts",
    title: "Prefer typed contracts and deterministic boundaries",
    paragraphs: [
      "Typed API contracts reduce accidental ambiguity between frontend, backend, and tooling. I keep deterministic logic explicit so the product stays testable even when the surrounding workflow includes probabilistic systems.",
      "That separation makes failures easier to explain and easier to recover from.",
    ],
    evidence: [
      {
        label: "How I approach senior frontend architecture",
        href: "/writing/how-i-approach-senior-frontend-architecture",
      },
      { label: "TallyFolio case study", href: "/portfolio/tallyfolio" },
    ],
  },
  {
    id: "accessibility-quality",
    title: "Accessibility is product quality",
    paragraphs: [
      "Semantic HTML, keyboard behavior, focus management, and motion preferences are not polish passes. They decide whether the product works reliably for real people, so they belong in the shared components and their defaults rather than in each screen.",
      "Teams that defer accessibility usually end up with weaker abstractions and more expensive rework.",
    ],
    evidence: [
      { label: "AlwaysGeeky case study", href: "/portfolio/alwaysgeeky" },
      {
        label: "How I approach senior frontend architecture",
        href: "/writing/how-i-approach-senior-frontend-architecture",
      },
    ],
  },
  {
    id: "next-engineer",
    title: "Optimize for the next engineer, not for cleverness",
    paragraphs: [
      "I would rather leave behind a system another engineer can reason about than one that looks impressive in isolation. Clear naming, bounded responsibilities, and predictable patterns outlast dense abstractions.",
      "The same goes for how I work with people: pairing and code review on component API design, accessibility, and TypeScript patterns, so the standards live in the team and not only in me.",
    ],
    evidence: [
      { label: "AlwaysGeeky case study", href: "/portfolio/alwaysgeeky" },
      {
        label: "A frontend that owns almost no truth",
        href: "/writing/how-i-structure-a-frontend-that-owns-almost-no-truth",
      },
    ],
  },
];
