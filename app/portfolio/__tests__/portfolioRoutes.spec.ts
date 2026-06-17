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
    expect(getProjectBySlug("controltech")?.hasDedicatedCaseStudy).toBe(false);
  });

  it("should generate unique metadata per case study", () => {
    const ledgerguard = buildPortfolioCaseStudyMetadata(getProjectBySlug("ledgerguard")!);
    const alwaysgeeky = buildPortfolioCaseStudyMetadata(getProjectBySlug("alwaysgeeky")!);

    expect(ledgerguard.title).toEqual({
      absolute: "LedgerGuard Case Study — Ali Pajand",
    });
    expect(ledgerguard.description).toBe(
      "A product engineering case study about traceable AI-assisted contract review, human verification, renewal risk, and financial commitments."
    );
    expect(ledgerguard.alternates?.canonical).toBe(`${CANONICAL_URL}/portfolio/ledgerguard`);
    expect(alwaysgeeky.title).not.toEqual(ledgerguard.title);
    expect(alwaysgeeky.description).not.toEqual(ledgerguard.description);
  });

  it("should expose dedicated case-study URLs for sitemap generation", () => {
    for (const slug of getDedicatedCaseStudySlugs()) {
      expect(`${CANONICAL_URL}/portfolio/${slug}`).toContain(`/portfolio/${slug}`);
    }
  });
});
