import { PROJECTS, type Project } from "data/projects";
import {
  buildCaseSections,
  figureHost,
  hostOf,
  legacySectionId,
  legacyTitleId,
} from "utils/caseStudySections";
import { getProjectBySlug } from "utils/projects";

const KIT_ORDER = [
  "context",
  "problem",
  "role",
  "built",
  "technical-decisions",
  "ux",
  "evidence",
  "outcome",
  "improve",
  "related",
];

describe("buildCaseSections", () => {
  it("keeps each section's anchor from before the kit's ids", () => {
    const ledgerguard = getProjectBySlug("ledgerguard")!;
    expect(
      Object.fromEntries(buildCaseSections(ledgerguard).map((s) => [s.legacyId, s.id]))
    ).toEqual({
      "ledgerguard-context": "context",
      "ledgerguard-problem": "problem",
      "ledgerguard-role": "role",
      "ledgerguard-built": "built",
      "ledgerguard-technical-decisions": "technical-decisions",
      "ledgerguard-ux-decisions": "ux",
      "ledgerguard-evidence": "evidence",
      "ledgerguard-outcome": "outcome",
      "ledgerguard-improve": "improve",
      "ledgerguard-related": "related",
    });
    expect(legacySectionId("agent-tooling", "ux")).toBe("agent-tooling-ux-decisions");
    expect(legacyTitleId("mapbylaw")).toBe("mapbylaw-heading");
  });

  it("keeps the design kit's section order for every case study", () => {
    for (const project of PROJECTS.filter((p) => p.hasDedicatedCaseStudy)) {
      const ids = buildCaseSections(project).map((section) => section.id);
      expect(ids).toEqual(KIT_ORDER.filter((id) => ids.includes(id)));
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("leaves out sections with nothing to show", () => {
    const ledgerguard = getProjectBySlug("ledgerguard")!;
    const bare = {
      ...ledgerguard,
      relatedLinks: [],
      liveLinks: [],
      caseStudy: {
        ...ledgerguard.caseStudy,
        nextImprovements: [],
        interfaceEvidence: [],
        reviewSample: undefined,
      },
    } as Project;
    const ids = buildCaseSections(bare).map((section) => section.id);
    expect(ids).not.toContain("improve");
    expect(ids).not.toContain("related");
    expect(ids).not.toContain("evidence");
  });

  it("keeps the first screenshot for the intro and the rest for evidence", () => {
    const project = getProjectBySlug("ledgerguard")!;
    const evidence = buildCaseSections(project).find((section) => section.id === "evidence")!;
    expect(evidence.body).toEqual({
      kind: "evidence",
      figures: project.caseStudy.interfaceEvidence!.slice(1),
      sample: project.caseStudy.reviewSample,
    });
  });

  it("shows evidence for an interactive sample even without extra screenshots", () => {
    const ledgerguard = getProjectBySlug("ledgerguard")!;
    const sampleOnly = {
      ...ledgerguard,
      caseStudy: {
        ...ledgerguard.caseStudy,
        interfaceEvidence: ledgerguard.caseStudy.interfaceEvidence!.slice(0, 1),
      },
    } as Project;
    const evidence = buildCaseSections(sampleOnly).find((section) => section.id === "evidence");
    expect(evidence?.body).toEqual({
      kind: "evidence",
      figures: [],
      sample: ledgerguard.caseStudy.reviewSample,
    });
  });

  it("attaches each diagram to its section: flows as bands, others inside", () => {
    for (const project of PROJECTS.filter((p) => p.hasDedicatedCaseStudy)) {
      const sections = buildCaseSections(project);
      const placed = sections.flatMap((s) => [...s.diagrams, ...(s.flow ? [s.flow] : [])]);
      const expected = (project.caseStudy.diagrams ?? []).filter(({ section }) =>
        sections.some((s) => s.id === (section === "ux-decisions" ? "ux" : section))
      );
      expect(placed).toHaveLength(expected.length);
      for (const section of sections) {
        expect(section.diagrams.map((spec) => spec.type)).not.toContain("flow");
      }
    }
  });

  it("lists related writing before live links", () => {
    const project = getProjectBySlug("ledgerguard")!;
    const related = buildCaseSections(project).find((section) => section.id === "related")!;
    expect(related.body).toEqual({
      kind: "related",
      links: [...project.relatedLinks, ...project.liveLinks],
    });
  });
});

describe("screenshot hosts", () => {
  it("strips the scheme and trailing slash", () => {
    expect(hostOf("https://ledgerguard.io/")).toBe("ledgerguard.io");
    expect(hostOf("http://example.com")).toBe("example.com");
  });

  it("prefers the figure's own host, then the first live link, then the name", () => {
    const project = getProjectBySlug("alwaysgeeky")!;
    const [hero, login] = project.caseStudy.interfaceEvidence!;
    expect(figureHost(project, login)).toBe("login.voxies.io");
    expect(figureHost(project, hero)).toBe(hostOf(project.liveLinks[0].href));
    expect(figureHost({ ...project, liveLinks: [] }, hero)).toBe(project.name);
  });
});
