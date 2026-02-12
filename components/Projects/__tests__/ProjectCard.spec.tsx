import { render, screen } from "@testing-library/react";
import { ProjectCard } from "components/Projects/ProjectCard";
import type { Project } from "data/projects";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    const { fill, sizes, ...imgProps } = props;
    return <img src={src} alt={alt} {...imgProps} />;
  },
}));

const mockProject: Project = {
  id: "test-project",
  name: "Test Project",
  description: "Test description",
  role: "Developer",
  tech: ["React", "TypeScript"],
  outcomes: ["Outcome 1", "Outcome 2"],
};

describe("ProjectCard", () => {
  describe("basic rendering", () => {
    it("should render project name", () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    it("should render project role", () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.getByText("Developer")).toBeInTheDocument();
    });

    it("should render project description", () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.getByText("Test description")).toBeInTheDocument();
    });

    it("should render tech stack", () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
    });

    it("should render outcomes", () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.getByText("Outcome 1")).toBeInTheDocument();
      expect(screen.getByText("Outcome 2")).toBeInTheDocument();
    });

    it("should have data-project-card attribute", () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      expect(container.querySelector("[data-project-card]")).toBeInTheDocument();
    });
  });

  describe("image rendering", () => {
    it("should render image when provided", () => {
      const projectWithImage: Project = {
        ...mockProject,
        image: "/test-image.jpg",
        imageCaption: "Test caption",
      };

      render(<ProjectCard project={projectWithImage} />);
      const image = screen.getByAltText("Test caption");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "/test-image.jpg");
    });

    it("should render image caption when provided", () => {
      const projectWithImage: Project = {
        ...mockProject,
        image: "/test-image.jpg",
        imageCaption: "Test caption",
      };

      render(<ProjectCard project={projectWithImage} />);
      expect(screen.getByText("Test caption")).toBeInTheDocument();
    });

    it("should not render image when image is empty string", () => {
      const projectWithEmptyImage: Project = {
        ...mockProject,
        image: "",
      };

      render(<ProjectCard project={projectWithEmptyImage} />);
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("should not render image when image is whitespace only", () => {
      const projectWithWhitespaceImage: Project = {
        ...mockProject,
        image: "   ",
      };

      render(<ProjectCard project={projectWithWhitespaceImage} />);
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("should not render image when image is not provided", () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
  });

  describe("secondary media", () => {
    it("should render secondary media when provided", () => {
      const projectWithSecondary: Project = {
        ...mockProject,
        secondaryMedia: {
          src: "/secondary.jpg",
          caption: "Secondary caption",
        },
      };

      render(<ProjectCard project={projectWithSecondary} />);
      const image = screen.getByAltText("Secondary caption");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "/secondary.jpg");
    });

    it("should render secondary media caption", () => {
      const projectWithSecondary: Project = {
        ...mockProject,
        secondaryMedia: {
          src: "/secondary.jpg",
          caption: "Secondary caption",
        },
      };

      render(<ProjectCard project={projectWithSecondary} />);
      expect(screen.getByText("Secondary caption")).toBeInTheDocument();
    });

    it("should not render secondary media when src is empty", () => {
      const projectWithEmptySecondary: Project = {
        ...mockProject,
        secondaryMedia: {
          src: "",
          caption: "Caption",
        },
      };

      render(<ProjectCard project={projectWithEmptySecondary} />);
      expect(screen.queryByAltText("Caption")).not.toBeInTheDocument();
    });

    it("should not render secondary media when src is whitespace", () => {
      const projectWithWhitespaceSecondary: Project = {
        ...mockProject,
        secondaryMedia: {
          src: "   ",
          caption: "Caption",
        },
      };

      render(<ProjectCard project={projectWithWhitespaceSecondary} />);
      expect(screen.queryByAltText("Caption")).not.toBeInTheDocument();
    });

    it("should not render secondary media when not provided", () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.queryAllByRole("img")).toHaveLength(0);
    });
  });

  describe("case study", () => {
    it("should render case study when provided", () => {
      const projectWithCaseStudy: Project = {
        ...mockProject,
        caseStudy: {
          problem: "The problem",
          approach: "The approach",
          result: "The result",
        },
      };

      render(<ProjectCard project={projectWithCaseStudy} />);
      expect(screen.getByText("The issue")).toBeInTheDocument();
      expect(screen.getByText("The problem")).toBeInTheDocument();
      expect(screen.getByText("What we did")).toBeInTheDocument();
      expect(screen.getByText("The approach")).toBeInTheDocument();
      expect(screen.getByText("Outcome")).toBeInTheDocument();
      expect(screen.getByText("The result")).toBeInTheDocument();
    });

    it("should not render case study when not provided", () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.queryByText("The issue")).not.toBeInTheDocument();
    });
  });

  describe("before after", () => {
    it("should render before after when provided", () => {
      const projectWithBeforeAfter: Project = {
        ...mockProject,
        beforeAfter: [
          {
            label: "Metric",
            before: "10",
            after: "20",
          },
        ],
      };

      render(<ProjectCard project={projectWithBeforeAfter} />);
      expect(screen.getByText("Metric:")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("20")).toBeInTheDocument();
    });

    it("should render multiple before after items", () => {
      const projectWithBeforeAfter: Project = {
        ...mockProject,
        beforeAfter: [
          {
            label: "Metric 1",
            before: "10",
            after: "20",
          },
          {
            label: "Metric 2",
            before: "5",
            after: "15",
          },
        ],
      };

      render(<ProjectCard project={projectWithBeforeAfter} />);
      expect(screen.getByText("Metric 1:")).toBeInTheDocument();
      expect(screen.getByText("Metric 2:")).toBeInTheDocument();
    });

    it("should not render before after when empty array", () => {
      const projectWithEmptyBeforeAfter: Project = {
        ...mockProject,
        beforeAfter: [],
      };

      render(<ProjectCard project={projectWithEmptyBeforeAfter} />);
      expect(screen.queryByText(/:/)).not.toBeInTheDocument();
    });

    it("should not render before after when not provided", () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.queryByText(/:/)).not.toBeInTheDocument();
    });
  });

  describe("link", () => {
    it("should render link when provided", () => {
      const projectWithLink: Project = {
        ...mockProject,
        link: "https://example.com",
      };

      render(<ProjectCard project={projectWithLink} />);
      const link = screen.getByText("View project →");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "https://example.com");
    });

    it("should add target and rel for external links", () => {
      const projectWithLink: Project = {
        ...mockProject,
        link: "https://example.com",
      };

      render(<ProjectCard project={projectWithLink} />);
      const link = screen.getByText("View project →");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should not add target and rel for relative links", () => {
      const projectWithLink: Project = {
        ...mockProject,
        link: "/project",
      };

      render(<ProjectCard project={projectWithLink} />);
      const link = screen.getByText("View project →");
      expect(link).not.toHaveAttribute("target");
      expect(link).not.toHaveAttribute("rel");
    });

    it("should not render link when not provided", () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.queryByText("View project →")).not.toBeInTheDocument();
    });
  });
});
