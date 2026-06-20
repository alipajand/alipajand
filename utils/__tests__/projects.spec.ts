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
      "tallyfolio",
      "emplifi",
      "controltech",
      "agent-tooling",
      "mapbylaw",
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
      "tallyfolio",
      "emplifi",
      "controltech",
      "agent-tooling",
      "mapbylaw",
    ]);
    expect(getIndexOnlyProjects().map((project) => project.slug)).toEqual([]);
  });

  it("should return dedicated case-study slugs for static generation", () => {
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

  it("should return the next dedicated case study in order", () => {
    expect(getNextDedicatedCaseStudyProject("ledgerguard")?.slug).toBe("alwaysgeeky");
    expect(getNextDedicatedCaseStudyProject("alwaysgeeky")?.slug).toBe("tallyfolio");
    expect(getNextDedicatedCaseStudyProject("tallyfolio")?.slug).toBe("emplifi");
    expect(getNextDedicatedCaseStudyProject("emplifi")?.slug).toBe("controltech");
    expect(getNextDedicatedCaseStudyProject("controltech")?.slug).toBe("agent-tooling");
    expect(getNextDedicatedCaseStudyProject("agent-tooling")?.slug).toBe("mapbylaw");
    expect(getNextDedicatedCaseStudyProject("mapbylaw")).toBeUndefined();
  });
});
