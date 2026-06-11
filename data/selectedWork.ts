import type { ProjectBadge } from "data/projects";

export const SELECTED_WORK_HEADING = "Selected case studies";

export const SELECTED_WORK_LEDE =
  "Four projects covering design-system leadership, complex SaaS product work, AI-assisted workflows, and data-heavy UI. Full write-ups are on the work page.";

export const SELECTED_WORK_PROBLEM_LABEL = "Problem";
export const SELECTED_WORK_ROLE_LABEL = "Role";
export const SELECTED_WORK_OWNED_LABEL = "What I owned";
export const SELECTED_WORK_EVIDENCE_LABEL = "Evidence";
export const SELECTED_WORK_THEMES_LABEL = "Project themes";

export const SELECTED_WORK_CARD_CTA = "Read case study";
export const SELECTED_WORK_CARD_CTA_SR = " — full write-up on the work page";

export const SELECTED_WORK_SECTION_CTA_LABEL = "View all case studies";
export const SELECTED_WORK_SECTION_CTA_HREF = "/portfolio#projects";

export interface SelectedWorkItem {
  projectId: string;
  name: string;
  problem: string;
  role: string;
  owned: [string, string];
  evidence: string;
  themes: ProjectBadge[];
}

export const SELECTED_WORK: SelectedWorkItem[] = [
  {
    projectId: "ledgerguard-deterministic-commitments-ledger",
    name: "LedgerGuard — AI contract intelligence",
    problem:
      "Renewal and spend-risk readouts must stay trustworthy even when async extraction, synthesis, and persisted rows disagree.",
    role: "Senior Product Engineer · independent product",
    owned: [
      "Separated probabilistic document extraction from a deterministic financial read model.",
      "Designed typed tenant/admin API contracts (Zod/OpenAPI) and renewal-truth precedence rules.",
    ],
    evidence:
      "Renewal drivers trace to explainable sources with explicit warnings when the ledger is partial or skewed, instead of overstating certainty.",
    themes: ["AI", "DX"],
  },
  {
    projectId: "mapbylaw-platform-ui-ai-reports",
    name: "MapBylaw — shared UI & typed AI recommendations",
    problem:
      "Web and admin had to evolve in parallel while bilingual PDF reports and AI recommendations stayed aligned with zoning and feasibility rules.",
    role: "Senior Product Engineer · MapBylaw",
    owned: [
      "Built the shared @mapbylaw/ui foundation used across web and admin.",
      "Constrained AI recommendations to typed, policy-aligned scenario inputs.",
    ],
    evidence:
      "One design language and scenario-level recommendations stay consistent between dashboard and PDF, enforced by shared types and audits.",
    themes: ["Design systems", "AI"],
  },
  {
    projectId: "design-system-marketplace-login-web3",
    name: "AlwaysGeeky — design system & product surfaces",
    problem:
      "Teams were shipping one-off UI while marketplace and login needed consistent, accessible components that survived production traffic.",
    role: "Lead Frontend Engineer · Design Systems (collaborated with design)",
    owned: [
      "Established the shared component architecture with Storybook documentation.",
      "Added CI gates for visual and accessibility regressions before merge.",
    ],
    evidence:
      "A consistent accessible baseline across products; marketplace and login stayed stable in production with regressions caught pre-merge.",
    themes: ["Design systems", "Accessibility"],
  },
  {
    projectId: "data-dashboards-emplifi",
    name: "Emplifi — data-heavy dashboards",
    problem:
      "Dashboards had to stay legible and smooth inside embedded hosts and mobile webviews with tight CPU and layout budgets.",
    role: "Senior Frontend Engineer · Emplifi (team delivery)",
    owned: [
      "Built D3.js dashboards with bounded, profiled GSAP motion.",
      "Tuned embed and mobile-webview performance paths.",
    ],
    evidence:
      "Dashboards stayed usable in embedded and mobile webview contexts, with motion that remained controlled rather than chaotic.",
    themes: ["Data viz", "Performance"],
  },
];
