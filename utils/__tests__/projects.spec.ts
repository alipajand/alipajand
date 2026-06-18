/** @jest-environment node */

import {
  getDedicatedCaseStudyProjects,
  getDedicatedCaseStudySlugs,
  getIndexOnlyProjects,
  getNextDedicatedCaseStudyProject,
  getOrderedProjects,
  getProjectBySlug,
} from "utils/projects";

describe("utils/projects", () => {
  it("should return projects in portfolio order", () => {
    expect(getOrderedProjects().map((project) => project.slug)).toEqual([
      "ledgerguard",
      "tallyfolio",
      "alwaysgeeky",
      "mapbylaw",
      "emplifi",
      "controltech",
    ]);
  });

  it("should resolve projects by slug", () => {
    const project = getProjectBySlug("ledgerguard");
    expect(project?.name).toBe("LedgerGuard");
    expect(getProjectBySlug("missing-slug")).toBeUndefined();
  });

  it("should separate dedicated and index-only projects", () => {
    expect(getDedicatedCaseStudyProjects().map((project) => project.slug)).toEqual([
      "ledgerguard",
      "tallyfolio",
      "alwaysgeeky",
      "mapbylaw",
      "emplifi",
    ]);
    expect(getIndexOnlyProjects().map((project) => project.slug)).toEqual(["controltech"]);
  });

  it("should return dedicated case-study slugs for static generation", () => {
    expect(getDedicatedCaseStudySlugs()).toEqual([
      "ledgerguard",
      "tallyfolio",
      "alwaysgeeky",
      "mapbylaw",
      "emplifi",
    ]);
  });

  it("should return the next dedicated case study in order", () => {
    expect(getNextDedicatedCaseStudyProject("ledgerguard")?.slug).toBe("tallyfolio");
    expect(getNextDedicatedCaseStudyProject("tallyfolio")?.slug).toBe("alwaysgeeky");
    expect(getNextDedicatedCaseStudyProject("alwaysgeeky")?.slug).toBe("mapbylaw");
    expect(getNextDedicatedCaseStudyProject("mapbylaw")?.slug).toBe("emplifi");
    expect(getNextDedicatedCaseStudyProject("emplifi")).toBeUndefined();
    expect(getNextDedicatedCaseStudyProject("controltech")).toBeUndefined();
  });
});
