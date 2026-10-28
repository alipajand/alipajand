export interface SuppressedClaim {
  projectId: string;
  figure: string;
  reason: string;
}

export const SUPPRESSED_CLAIMS: readonly SuppressedClaim[] = [
  {
    projectId: "ledgerguard",
    figure: "90%",
    reason: "Unit-test coverage figure without a published report.",
  },
];

export interface PublicProjectOverrides {
  cardProblem?: string;
  caseStudyMetaDescription?: string;
}

export const PUBLIC_PROJECT_OVERRIDES: Readonly<Record<string, PublicProjectOverrides>> = {};
