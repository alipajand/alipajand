import { render, screen } from "@testing-library/react";

import { Skills } from "components/Skills/Skills";

describe("Skills", () => {
  describe("default rendering", () => {
    it("should render the section with id skills", () => {
      render(<Skills />);

      const section = document.getElementById("skills");
      expect(section).toBeInTheDocument();
    });

    it("should render the Skills heading", () => {
      render(<Skills />);

      expect(screen.getByRole("heading", { name: /skills/i })).toBeInTheDocument();
    });

    it("should render skill groups and items", () => {
      render(<Skills />);

      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Next.js")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText(/Languages & Frameworks/)).toBeInTheDocument();
    });
  });
});
