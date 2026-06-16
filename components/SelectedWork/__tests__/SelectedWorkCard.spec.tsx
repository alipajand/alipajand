import { render, screen, within } from "@testing-library/react";

import { SelectedWorkCard } from "components/SelectedWork/SelectedWorkCard";
import type { HomepageCaseStudy } from "data/homepage";

const caseStudy: HomepageCaseStudy = {
  id: "demo-project",
  label: "Independent product",
  title: "Demo case study",
  summary: "A tight homepage summary.",
  tags: ["AI workflows", "Next.js", "DX"],
  href: "/portfolio#project-demo-project",
  image: {
    src: "/portfolio-media/ledgerguard.png",
    alt: "Demo screenshot alt",
    caption: "Real product screenshot",
  },
};

describe("SelectedWorkCard", () => {
  it("renders the case study label, title, summary, and screenshot", () => {
    render(<SelectedWorkCard caseStudy={caseStudy} />);
    expect(screen.getByText(caseStudy.label)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: caseStudy.title })).toBeInTheDocument();
    expect(screen.getByText(caseStudy.summary)).toBeInTheDocument();
    expect(screen.getByAltText(caseStudy.image!.alt)).toBeInTheDocument();
  });

  it("renders each theme badge", () => {
    render(<SelectedWorkCard caseStudy={caseStudy} />);
    const themesList = screen.getByRole("list", { name: `${caseStudy.title} tags` });
    for (const theme of caseStudy.tags) {
      expect(within(themesList).getByText(theme)).toBeInTheDocument();
    }
  });

  it("links to the deep-linked case study on the portfolio page", () => {
    render(<SelectedWorkCard caseStudy={caseStudy} />);
    const cta = screen.getByRole("link", { name: /read case study/i });
    expect(cta).toHaveAttribute("href", caseStudy.href);
  });

  it("renders the illustrative reconstruction label when no screenshot is available", () => {
    render(
      <SelectedWorkCard
        caseStudy={{
          ...caseStudy,
          image: undefined,
          illustrativeLabel: "Illustrative reconstruction",
        }}
      />
    );
    expect(screen.getAllByText("Illustrative reconstruction").length).toBeGreaterThan(0);
  });
});
