import { readdirSync } from "fs";
import { join } from "path";

import { render, screen, within } from "@testing-library/react";

import { EngineeringPrinciplesPageContent } from "features/engineering-principles/EngineeringPrinciplesPageContent";
import { EngineeringPrinciplesSectionBlock } from "features/engineering-principles/EngineeringPrinciplesSectionBlock";
import {
  ENGINEERING_PRINCIPLES_PAGE_TITLE,
  ENGINEERING_PRINCIPLES_SECTIONS,
  ENGINEERING_PRINCIPLES_TOC_ARIA_LABEL,
} from "data/engineeringPrinciples";
import { getDedicatedCaseStudySlugs } from "utils/projects";

const postSlugs = readdirSync(join(process.cwd(), "content", "posts"))
  .filter((file) => file.endsWith(".md"))
  .map((file) => file.replace(/\.md$/, ""));

describe("EngineeringPrinciplesPageContent", () => {
  it("should render every principle with its evidence links", () => {
    render(<EngineeringPrinciplesPageContent />);

    expect(
      screen.getByRole("heading", { level: 1, name: ENGINEERING_PRINCIPLES_PAGE_TITLE })
    ).toBeInTheDocument();

    ENGINEERING_PRINCIPLES_SECTIONS.forEach((section) => {
      const heading = screen.getByRole("heading", { level: 2, name: section.title });
      const block = heading.closest("section") as HTMLElement;
      section.evidence.forEach((link) => {
        expect(within(block).getByRole("link", { name: link.label })).toHaveAttribute(
          "href",
          link.href
        );
      });
    });
  });

  it("should outline every principle in the on-this-page navigation", () => {
    render(<EngineeringPrinciplesPageContent />);

    const [outline] = screen.getAllByRole("navigation", {
      name: ENGINEERING_PRINCIPLES_TOC_ARIA_LABEL,
    });
    const links = within(outline).getAllByRole("link");
    expect(links).toHaveLength(ENGINEERING_PRINCIPLES_SECTIONS.length);
    expect(links[0]).toHaveAttribute("href", `#${ENGINEERING_PRINCIPLES_SECTIONS[0].id}`);
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
      />
    );

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});
