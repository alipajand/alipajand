import { render, screen } from "@testing-library/react";

import { Skills } from "components/Skills/Skills";

describe("Skills", () => {
  describe("default rendering", () => {
    it("should render the section with id expertises", () => {
      render(<Skills />);

      const section = document.getElementById("expertises");
      expect(section).toBeInTheDocument();
    });

    it("should render the What I do heading", () => {
      render(<Skills />);

      expect(screen.getByRole("heading", { name: /what i do/i })).toBeInTheDocument();
    });

    it("should render expertise areas and tech tags", () => {
      render(<Skills />);

      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Next.js")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText(/Frontend architecture/i)).toBeInTheDocument();
    });
  });
});
