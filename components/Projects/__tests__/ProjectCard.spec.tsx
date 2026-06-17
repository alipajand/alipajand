import { render, screen } from "@testing-library/react";

import { ProjectCard } from "components/Projects/ProjectCard";
import type { Project } from "data/projects";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; sizes?: string }) => {
    const { fill: _fill, sizes: _sizes, ...imgProps } = props;
    return <img src={src} alt={alt} {...imgProps} />;
  },
}));

jest.mock("next/link", () => {
  return function MockLink({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

const mockProject: Project = {
  id: "test-project",
  name: "Test Project",
  caseStudyTitle: "A short case-study title",
  employerContext: "Employer context",
  cardProblem: "One-sentence problem",
  role: "Developer · Acme",
  capabilityTags: ["Typed APIs", "Design systems", "Delivery"],
  heroFigure: {
    type: "image",
    src: "/test-image.jpg",
    width: 1600,
    height: 1035,
    alt: "Representative product interface",
    captionLead: "Representative interface.",
    captionBody: "The interface highlights a workflow decision that matters.",
  },
  caseStudy: {
    title: "A short case-study title",
    overview: "Overview",
    contextAndConstraints: "Context",
    responsibility: {
      owned: ["Owned"],
      collaborative: ["Collaborative"],
      outside: ["Outside"],
    },
    problem: "Problem",
    decisions: [
      {
        decision: "Decision",
        why: "Why",
        tradeOff: "Trade-off",
        result: "Result",
      },
    ],
    workflow: ["Step one"],
    interfaceEvidence: [],
    difficultStates: ["State"],
    outcome: ["Outcome"],
    nextImprovements: ["Improve"],
  },
  relatedLinks: [{ label: "Live product", href: "https://example.com" }],
};

describe("ProjectCard", () => {
  it("renders the required card content and case-study anchor", () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText("Employer context")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Test Project" })).toBeInTheDocument();
    expect(screen.getByText("Developer · Acme")).toBeInTheDocument();
    expect(screen.getByText("One-sentence problem")).toBeInTheDocument();
    expect(screen.getByAltText("Representative product interface")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read case study" })).toHaveAttribute(
      "href",
      "#project-test-project"
    );
  });

  it("renders at most three capability tags", () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText("Typed APIs")).toBeInTheDocument();
    expect(screen.getByText("Design systems")).toBeInTheDocument();
    expect(screen.getByText("Delivery")).toBeInTheDocument();
  });
});
