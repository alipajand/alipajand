import { render, screen } from "@testing-library/react";

import { Contact } from "components/Contact/Contact";

describe("Contact", () => {
  describe("default rendering", () => {
    it("should render the section with id contact", () => {
      render(<Contact />);

      const section = document.getElementById("contact");
      expect(section).toBeInTheDocument();
    });

    it("should render the contact heading", () => {
      render(<Contact />);

      expect(screen.getByRole("heading", { name: /open to new work/i })).toBeInTheDocument();
    });

    it("should render contact links for Email, LinkedIn, and GitHub", () => {
      render(<Contact />);

      expect(screen.getByText("alipajand@gmail.com")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /email/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
    });

    it("should render reasons list and form jump CTA", () => {
      render(<Contact />);
      expect(screen.getByRole("heading", { name: /send context/i })).toBeInTheDocument();
    });

    it("should render the updated hiring paragraph", () => {
      render(<Contact />);
      expect(
        screen.getByText(
          /I’m open to senior frontend, product engineering, design system, and developer experience roles/i
        )
      ).toBeInTheDocument();
    });
  });
});
