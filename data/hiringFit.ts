export interface HiringFitCard {
  id: string;
  title: string;
  depth: string;
  body: string;
}

export const HIRING_FIT_HEADING = "Engineering Capabilities";

export const HIRING_FIT_CARDS: HiringFitCard[] = [
  {
    id: "frontend-engineering",
    title: "Frontend Engineering",
    depth: "Primary specialization, across every professional role since 2015.",
    body: "React, TypeScript, Next.js, Component architecture, Accessibility, Performance, State management, Design systems",
  },
  {
    id: "full-stack-product-development",
    title: "Full-Stack Product Development",
    depth:
      "Built hands-on in independent products (LedgerGuard, TallyFolio) and through API contract work at ControlTech. AWS appears as Textract OCR in LedgerGuard, not as a platform specialization.",
    body: "Node.js, Fastify, API development, PostgreSQL, Supabase, Authentication, Background processing, Redis/BullMQ, Python workers",
  },
  {
    id: "engineering-quality",
    title: "Engineering Quality",
    depth: "Practised in production teams and enforced in CI in my own products.",
    body: "Testing, Code review, CI/CD, Observability, Git workflows, Security-conscious implementation, Release verification",
  },
  {
    id: "technical-leadership",
    title: "Technical Leadership",
    depth:
      "Senior individual-contributor leadership: design docs, standards, and mentoring, not people management.",
    body: "Architecture decisions, Design documentation, Engineering standards, Code review, Mentoring, Adoption of shared systems",
  },
];
