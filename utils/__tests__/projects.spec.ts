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
      "agent-tooling",
      "tallyfolio",
      "controltech",
      "mapbylaw",
    ]);
  });

  it("should resolve projects by slug", () => {
    const project = getProjectBySlug("ledgerguard");
    expect(project?.name).toBe("LedgerGuard");
    expect(getProjectBySlug("missing-slug")).toBeUndefined();
  });

  it("should lead with LedgerGuard as the strongest full-stack proof", () => {
    const firstProject = getOrderedProjects()[0];

    expect(firstProject.slug).toBe("ledgerguard");
    expect(firstProject.caseStudyTitle).toBe("Full-Stack AI Contract Intelligence");
    expect(firstProject.cardProblem).toContain("Node.js/Fastify API");
    expect(firstProject.cardProblem).toContain("background workers");
    expect(
      firstProject.caseStudy.technicalDecisions.some(
        (decision) =>
          decision.decision.includes("Node.js/Fastify") &&
          decision.decision.includes("Python worker")
      )
    ).toBe(true);
  });

  it("should preserve official historical employment titles", () => {
    expect(getProjectBySlug("ledgerguard")?.role).toBe("Senior Product Engineer");
    expect(getProjectBySlug("alwaysgeeky")?.role).toBe("Senior Frontend Engineer");
    expect(getProjectBySlug("emplifi")?.role).toBe("Senior Frontend Engineer");
    expect(getProjectBySlug("controltech")?.role).toBe("Frontend Engineer");
  });

  it("should separate dedicated and index-only projects", () => {
    expect(getDedicatedCaseStudyProjects().map((project) => project.slug)).toEqual([
      "ledgerguard",
      "alwaysgeeky",
      "emplifi",
      "agent-tooling",
      "tallyfolio",
      "controltech",
      "mapbylaw",
    ]);
    expect(getIndexOnlyProjects().map((project) => project.slug)).toEqual([]);
  });

  it("should return dedicated case-study slugs for static generation", () => {
    expect(getDedicatedCaseStudySlugs()).toEqual([
      "ledgerguard",
      "alwaysgeeky",
      "emplifi",
      "agent-tooling",
      "tallyfolio",
      "controltech",
      "mapbylaw",
    ]);
  });

  it("should return the next dedicated case study in order", () => {
    expect(getNextDedicatedCaseStudyProject("ledgerguard")?.slug).toBe("alwaysgeeky");
    expect(getNextDedicatedCaseStudyProject("alwaysgeeky")?.slug).toBe("emplifi");
    expect(getNextDedicatedCaseStudyProject("emplifi")?.slug).toBe("agent-tooling");
    expect(getNextDedicatedCaseStudyProject("agent-tooling")?.slug).toBe("tallyfolio");
    expect(getNextDedicatedCaseStudyProject("tallyfolio")?.slug).toBe("controltech");
    expect(getNextDedicatedCaseStudyProject("controltech")?.slug).toBe("mapbylaw");
    expect(getNextDedicatedCaseStudyProject("mapbylaw")).toBeUndefined();
  });
});
