import { render, screen } from "@testing-library/react";

import { Footer } from "components/Footer/Footer";

describe("Footer", () => {
  describe("default rendering", () => {
    it("should render the footer element", () => {
      render(<Footer />);

      const footer = document.querySelector("footer");
      expect(footer).toBeInTheDocument();
    });

    it("should render the current year and name", () => {
      render(<Footer />);

      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
      expect(screen.getByText(/Ali Pajand/)).toBeInTheDocument();
    });

    it("should render Get in touch link to contact section", () => {
      render(<Footer />);

      const link = screen.getByRole("link", { name: /get in touch/i });
      expect(link).toHaveAttribute("href", "#contact");
    });
  });
});
