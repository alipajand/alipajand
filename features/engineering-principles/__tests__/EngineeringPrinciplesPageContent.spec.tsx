import { readdirSync } from "fs";
import { join } from "path";

import { render, screen, within } from "@testing-library/react";

import EngineeringPrinciplesPage, { metadata } from "../../../app/engineering-principles/page";
import { EngineeringPrinciplesPageContent } from "features/engineering-principles/EngineeringPrinciplesPageContent";
import { EngineeringPrinciplesSectionBlock } from "features/engineering-principles/EngineeringPrinciplesSectionBlock";
import {
  ENGINEERING_PRINCIPLES_CTAS,
  ENGINEERING_PRINCIPLES_LEDE,
  ENGINEERING_PRINCIPLES_META_DESCRIPTION,
  ENGINEERING_PRINCIPLES_PAGE_TITLE,
  ENGINEERING_PRINCIPLES_REVIEW_QUOTE,
  ENGINEERING_PRINCIPLES_SECTIONS,
  ENGINEERING_PRINCIPLES_TOC_ARIA_LABEL,
  engineeringPrinciplesEvidenceKind,
  engineeringPrinciplesSettledLabel,
} from "data/engineeringPrinciples";
import { PAGE_NEXT_LINKS, PAGE_NEXT_LINKS_ARIA_LABEL } from "data/pageChrome";
import { CANONICAL_URL } from "data/site";
import { installMatchMedia, installObservers } from "utils/motion/testEnvironment";
import { getDedicatedCaseStudySlugs } from "utils/projects";

const postSlugs = readdirSync(join(process.cwd(), "content", "posts"))
  .filter((file) => file.endsWith(".md"))
  .map((file) => file.replace(/\.md$/, ""));

beforeEach(() => {
  installMatchMedia(false);
  installObservers();
  // jsdom has no 2D context; the alignment diagram keeps its still rendering.
  jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("EngineeringPrinciplesPageContent", () => {
  it("should own the main landmark with the page title as its only h1", () => {
    render(<EngineeringPrinciplesPageContent />);

    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveAttribute("tabindex", "-1");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("heading", { level: 1, name: ENGINEERING_PRINCIPLES_PAGE_TITLE })
    ).toBeInTheDocument();
  });

  it("should keep the lede and the two ways into the page", () => {
    render(<EngineeringPrinciplesPageContent />);

    const intro = screen.getByRole("region", { name: ENGINEERING_PRINCIPLES_PAGE_TITLE });
    expect(within(intro).getByText(ENGINEERING_PRINCIPLES_LEDE)).toBeInTheDocument();
    ENGINEERING_PRINCIPLES_CTAS.forEach((cta) => {
      expect(within(intro).getByRole("link", { name: cta.label })).toHaveAttribute(
        "href",
        cta.href
      );
    });
    expect(
      within(intro).getByText(
        engineeringPrinciplesSettledLabel(0, ENGINEERING_PRINCIPLES_SECTIONS.length)
      )
    ).toBeInTheDocument();
  });

  it("should render every principle's full text with its evidence links", () => {
    render(<EngineeringPrinciplesPageContent />);

    ENGINEERING_PRINCIPLES_SECTIONS.forEach((section) => {
      const block = screen.getByRole("region", { name: section.title });
      expect(block).toHaveAttribute("id", section.id);
      section.paragraphs.forEach((paragraph) => {
        expect(within(block).getByText(paragraph)).toBeInTheDocument();
      });
      section.evidence.forEach((link) => {
        const anchor = within(block).getByRole("link", { name: new RegExp(link.label) });
        expect(anchor).toHaveAttribute("href", link.href);
        expect(anchor).toHaveTextContent(engineeringPrinciplesEvidenceKind(link.href));
      });
    });
  });

  it("should outline every principle in the on-this-page navigation", () => {
    render(<EngineeringPrinciplesPageContent />);

    const outline = screen.getByRole("navigation", { name: ENGINEERING_PRINCIPLES_TOC_ARIA_LABEL });
    const links = within(outline).getAllByRole("link");
    expect(links).toHaveLength(ENGINEERING_PRINCIPLES_SECTIONS.length);
    links.forEach((link, index) => {
      expect(link).toHaveAttribute("href", `#${ENGINEERING_PRINCIPLES_SECTIONS[index].id}`);
    });
  });

  it("should let in-page links land focus on the principle", () => {
    render(<EngineeringPrinciplesPageContent />);

    const first = document.getElementById(ENGINEERING_PRINCIPLES_SECTIONS[0].id) as HTMLElement;
    expect(first).toHaveAttribute("tabindex", "-1");
    first.focus();
    expect(first).toHaveFocus();
  });

  it("should close with the design-review band and the next links", () => {
    render(<EngineeringPrinciplesPageContent />);

    expect(screen.getByText(ENGINEERING_PRINCIPLES_REVIEW_QUOTE)).toBeInTheDocument();
    const next = screen.getByRole("navigation", { name: PAGE_NEXT_LINKS_ARIA_LABEL });
    PAGE_NEXT_LINKS.forEach((link) => {
      expect(within(next).getByRole("link", { name: new RegExp(link.title) })).toHaveAttribute(
        "href",
        link.href
      );
    });
  });

  it("should only link to case studies and posts that exist", () => {
    const caseStudies = new Set(getDedicatedCaseStudySlugs());
    const posts = new Set(postSlugs);

    ENGINEERING_PRINCIPLES_SECTIONS.flatMap((section) => section.evidence).forEach(({ href }) => {
      const [, area, slug] = href.split("/");
      expect(area === "portfolio" ? caseStudies.has(slug) : posts.has(slug)).toBe(true);
    });
  });

  it("should omit the evidence row when a principle has no links", () => {
    render(
      <EngineeringPrinciplesSectionBlock
        section={{ id: "plain", title: "Plain", paragraphs: ["Text"], evidence: [] }}
        number={1}
      />
    );

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.getByText("01")).toBeInTheDocument();
  });

  it("should leave nothing lit with reduced motion", () => {
    installMatchMedia(true);
    const { container } = render(<EngineeringPrinciplesPageContent />);

    expect(container.querySelectorAll("[data-on]")).toHaveLength(0);
    expect(container.querySelectorAll("[aria-current]")).toHaveLength(0);
  });
});

describe("app/engineering-principles/page", () => {
  it("should keep the canonical metadata", () => {
    expect(metadata.alternates?.canonical).toBe(`${CANONICAL_URL}/engineering-principles`);
    expect(metadata.description).toBe(ENGINEERING_PRINCIPLES_META_DESCRIPTION);
    expect(metadata.openGraph).toEqual(
      expect.objectContaining({ url: `${CANONICAL_URL}/engineering-principles` })
    );
  });

  it("should keep the breadcrumb structured data", () => {
    const { container } = render(<EngineeringPrinciplesPage />);

    const block = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? "{}"
    );
    expect(block["@type"]).toBe("BreadcrumbList");
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
