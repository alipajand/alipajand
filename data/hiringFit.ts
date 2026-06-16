export interface HiringFitCard {
  id: string;
  title: string;
  body: string;
}

export const HIRING_FIT_HEADING = "Core capabilities";

export const HIRING_FIT_CARDS: HiringFitCard[] = [
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
