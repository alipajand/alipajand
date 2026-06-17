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
      "alwaysgeeky",
      "emplifi",
      "mapbylaw",
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
      "alwaysgeeky",
      "emplifi",
      "mapbylaw",
    ]);
    expect(getIndexOnlyProjects().map((project) => project.slug)).toEqual(["controltech"]);
  });

  it("should return dedicated case-study slugs for static generation", () => {
    expect(getDedicatedCaseStudySlugs()).toEqual([
      "ledgerguard",
      "alwaysgeeky",
      "emplifi",
      "mapbylaw",
    ]);
  });

  it("should return the next dedicated case study in order", () => {
    expect(getNextDedicatedCaseStudyProject("ledgerguard")?.slug).toBe("alwaysgeeky");
    expect(getNextDedicatedCaseStudyProject("mapbylaw")).toBeUndefined();
    expect(getNextDedicatedCaseStudyProject("controltech")).toBeUndefined();
  });
});
