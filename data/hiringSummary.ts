import { LOCATION } from "data/site";

/**
 * Compact recruiter-facing facts—phrased from existing positioning (tagline, about, contact).
 * No remote/hybrid/relocation line until that detail exists in site copy elsewhere.
 */
export const HIRING_SUMMARY_HEADING = "Hiring snapshot";

export const HIRING_SUMMARY_LEDE =
  "At a glance: what I’m looking for, what I lean on, and how I work best.";

export const HIRING_SUMMARY_ROWS = [
  {
    id: "roles",
    label: "Open to",
    value:
      "Senior or staff frontend, product engineering, or design systems and DX—plus contract or consulting when scope and timeline are clear.",
  },
  {
    id: "strengths",
    label: "Strongest at",
    value:
      "Accessible UIs, design-system rollouts, TypeScript/React stacks, DX tooling, and stable releases—themes you’ll see in Experience and case studies.",
  },
  {
    id: "environment",
    label: "Best environment",
    value:
      "Small teams where product ownership matters; work that sits between design and engineering.",
  },
  {
    id: "location",
    label: "Location",
    value: LOCATION,
  },
] as const;
