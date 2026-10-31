/** @jest-environment node */

import { renderToStaticMarkup } from "react-dom/server";

import { generateMetadata, generateStaticParams } from "../[slug]/page";
import { ProjectCaseStudyJsonLd } from "components/ProjectCaseStudyJsonLd/ProjectCaseStudyJsonLd";
import { PORTFOLIO_CASE_STUDY_ORDER } from "data/projects";
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
      absolute: "LedgerGuard — Independent Full-Stack Engineering · Ali Pajand",
    });
    expect(ledgerguard.description).toBe(
      "Case study: An independently developed multi-tenant contract-intelligence application across Next.js, Node.js/Fastify, PostgreSQL, Redis/BullMQ jobs, and a Python extraction worker, with human review before any AI-extracted value becomes a confirmed record."
    );
    expect(ledgerguard.alternates?.canonical).toBe(`${CANONICAL_URL}/portfolio/ledgerguard`);
    expect(tallyfolio.title).toEqual({
      absolute: "TallyFolio — Independent Personal Finance Product · Ali Pajand",
    });
    expect(tallyfolio.description).not.toEqual(ledgerguard.description);
  });

  it("should expose dedicated case-study URLs for sitemap generation", () => {
    for (const slug of getDedicatedCaseStudySlugs()) {
      expect(`${CANONICAL_URL}/portfolio/${slug}`).toContain(`/portfolio/${slug}`);
    }
  });
});

describe.each(PORTFOLIO_CASE_STUDY_ORDER.map((slug) => [slug]))(
  "/portfolio/%s metadata",
  (slug) => {
    const project = getProjectBySlug(slug)!;
    const url = `${CANONICAL_URL}/portfolio/${slug}`;

    it("sets the title, description, canonical URL and Open Graph article", async () => {
      const metadata = await generateMetadata({ params: Promise.resolve({ slug }) });
      expect(metadata.title).toEqual({ absolute: project.caseStudyMetaTitle });
      expect(metadata.title).toEqual({ absolute: expect.stringContaining(project.name) });
      expect(metadata.description).toBe(project.caseStudyMetaDescription);
      expect(metadata.alternates?.canonical).toBe(url);
      expect(metadata.openGraph).toEqual(
        expect.objectContaining({
          type: "article",
          url,
          title: project.caseStudyMetaTitle,
          description: project.caseStudyMetaDescription,
        })
      );
    });

    it("describes the case study as a schema.org Article", () => {
      const markup = renderToStaticMarkup(<ProjectCaseStudyJsonLd project={project} />);
      expect(markup.startsWith('<script type="application/ld+json">')).toBe(true);
      const schema = JSON.parse(markup.slice(markup.indexOf(">") + 1, markup.lastIndexOf("<")));
      expect(schema).toEqual(
        expect.objectContaining({
          "@type": "Article",
          headline: project.caseStudyTitle,
          description: project.caseStudyMetaDescription,
          url,
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
        })
      );
    });
  }
);

it("returns not-found metadata for an unknown slug", async () => {
  expect(await generateMetadata({ params: Promise.resolve({ slug: "nope" }) })).toEqual({
    title: "Not found",
  });
});
