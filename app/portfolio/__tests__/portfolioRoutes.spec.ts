/** @jest-environment node */

import { generateStaticParams } from "../[slug]/page";
import { CANONICAL_URL } from "data/site";
import { getDedicatedCaseStudySlugs, getProjectBySlug } from "utils/projects";
import { buildPortfolioCaseStudyMetadata } from "utils/metadata";

describe("portfolio case-study routes", () => {
  it("should include every eligible project in static params", async () => {
    const params = await generateStaticParams();
    expect(params.map((entry) => entry.slug).sort()).toEqual(getDedicatedCaseStudySlugs().sort());
  });

  it("should resolve each dedicated case-study slug", () => {
    for (const slug of getDedicatedCaseStudySlugs()) {
      const project = getProjectBySlug(slug);
      expect(project).toBeDefined();
      expect(project?.hasDedicatedCaseStudy).toBe(true);
    }
  });

  it("should treat invalid slugs as missing projects", () => {
    expect(getProjectBySlug("invalid-slug")).toBeUndefined();
    expect(getProjectBySlug("controltech")?.hasDedicatedCaseStudy).toBe(true);
  });

  it("should generate unique metadata per case study", () => {
    const ledgerguard = buildPortfolioCaseStudyMetadata(getProjectBySlug("ledgerguard")!);
    const tallyfolio = buildPortfolioCaseStudyMetadata(getProjectBySlug("tallyfolio")!);

    expect(ledgerguard.title).toEqual({
      absolute: "LedgerGuard — AI Contract Intelligence SaaS · Ali Pajand",
    });
    expect(ledgerguard.description).toBe(
      "Case study: Multi-tenant SaaS for AI contract intelligence. Next.js App Router, TypeScript, human-in-the-loop review UI, async AI extraction states, and document ingestion. Ali Pajand, Senior Product Engineer."
    );
    expect(ledgerguard.alternates?.canonical).toBe(`${CANONICAL_URL}/portfolio/ledgerguard`);
    expect(tallyfolio.title).toEqual({
      absolute: "TallyFolio — Privacy-first Personal Finance Tracker · Ali Pajand",
    });
    expect(tallyfolio.description).not.toEqual(ledgerguard.description);
  });

  it("should expose dedicated case-study URLs for sitemap generation", () => {
    for (const slug of getDedicatedCaseStudySlugs()) {
      expect(`${CANONICAL_URL}/portfolio/${slug}`).toContain(`/portfolio/${slug}`);
    }
  });
});
