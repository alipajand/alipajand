/** @jest-environment node */

import { GET as getFeed } from "../../app/feed.xml/route";
import { GET as getLlmsFullTxt } from "../../app/llms-full.txt/route";
import { GET as getLlmsTxt } from "../../app/llms.txt/route";
import { generateMetadata, generateStaticParams } from "../../app/portfolio/[slug]/page";
import { PROJECTS, type Project } from "data/projects";
import { SUPPRESSED_CLAIMS } from "data/projectsPublication";
import {
  getDedicatedCaseStudyProjects,
  getOrderedProjects,
  getProjectBySlug,
  toPublicProject,
} from "utils/projects";

// Post bodies are not under test here; the real Markdown parser is ESM-only under Jest.
jest.mock("marked", () => ({
  marked: { parse: (content: string) => `<p>${content}</p>`, use: jest.fn() },
}));

const HELD_BACK = /(^|[^\d.])[89]0%/;

const raw = (id: string) => PROJECTS.find((project) => project.id === id)!;

describe("published project data", () => {
  it("keeps the held-back figure in the stored data and no Emplifi figure at all", () => {
    expect(JSON.stringify(raw("ledgerguard"))).toMatch(/90%/);
    expect(JSON.stringify(raw("emplifi"))).not.toMatch(HELD_BACK);
    expect(SUPPRESSED_CLAIMS.map((claim) => claim.figure)).toEqual(["90%"]);
  });

  it("publishes no held-back figure from any project accessor", () => {
    for (const project of [
      ...getOrderedProjects(),
      ...getDedicatedCaseStudyProjects(),
      ...getDedicatedCaseStudyProjects().map((p) => getProjectBySlug(p.slug)!),
    ]) {
      expect(JSON.stringify(project)).not.toMatch(HELD_BACK);
    }
  });

  it("drops figure lines but keeps the rest of the case study", () => {
    const ledgerguard = getProjectBySlug("ledgerguard")!;
    expect(ledgerguard.caseStudy.outcome).toEqual(
      raw("ledgerguard").caseStudy.outcome.filter((line) => !line.includes("90%"))
    );
  });

  it("passes projects without a held-back figure through untouched", () => {
    expect(getProjectBySlug("emplifi")).toBe(raw("emplifi"));
    expect(getProjectBySlug("tallyfolio")).toBe(raw("tallyfolio"));
  });

  it("matches whole figures only", () => {
    const project = {
      ...raw("ledgerguard"),
      caseStudy: { ...raw("ledgerguard").caseStudy, outcome: ["Grew 190% in a year.", "Hit 90%."] },
    } as Project;
    expect(toPublicProject(project).caseStudy.outcome).toEqual(["Grew 190% in a year."]);
  });

  it("refuses to publish a figure left in a field without an override", () => {
    const leaky = {
      ...raw("ledgerguard"),
      caseStudy: { ...raw("ledgerguard").caseStudy, context: "Coverage reached 90% overall." },
    } as Project;
    expect(() => toPublicProject(leaky)).toThrow(/ledgerguard\.caseStudy\.context/);
  });
});

describe("published outputs", () => {
  it("leaves the figures out of every case-study route's metadata", async () => {
    for (const { slug } of await generateStaticParams()) {
      const metadata = await generateMetadata({ params: Promise.resolve({ slug }) });
      expect(JSON.stringify(metadata)).not.toMatch(HELD_BACK);
    }
  });

  it("leaves the figures out of llms.txt, llms-full.txt and the feed", async () => {
    for (const response of [getLlmsTxt(), getLlmsFullTxt(), await getFeed()]) {
      const text = await response.text();
      expect(text.length).toBeGreaterThan(100);
      expect(text).not.toMatch(HELD_BACK);
    }
  });
});
