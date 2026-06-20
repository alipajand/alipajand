/** @jest-environment node */

import { HOMEPAGE_CASE_STUDIES, HOMEPAGE_HERO_PRIMARY_CTA_HREF } from "data/homepage";
import { SELECTED_WORK_SECTION_CTA_HREF } from "data/selectedWork";
import { getDedicatedCaseStudySlugs } from "utils/projects";

describe("portfolio internal links", () => {
  it("should link homepage selected case studies to dedicated portfolio routes", () => {
    expect(HOMEPAGE_CASE_STUDIES.map((caseStudy) => caseStudy.href)).toEqual([
      "/portfolio/ledgerguard",
      "/portfolio/alwaysgeeky",
    ]);
  });

  it("should keep homepage and selected-work CTAs pointed at the portfolio index", () => {
    expect(HOMEPAGE_HERO_PRIMARY_CTA_HREF).toBe("/portfolio");
    expect(SELECTED_WORK_SECTION_CTA_HREF).toBe("/portfolio");
  });

  it("should expose dedicated case-study routes for every eligible slug", () => {
    expect(getDedicatedCaseStudySlugs().every((slug) => slug.length > 0)).toBe(true);
    expect(getDedicatedCaseStudySlugs()).toEqual([
      "ledgerguard",
      "alwaysgeeky",
      "tallyfolio",
      "emplifi",
      "controltech",
      "agent-tooling",
      "mapbylaw",
    ]);
  });
});
