import { render, screen } from "@testing-library/react";

import { Contact } from "components/Contact/Contact";

describe("Contact", () => {
  describe("default rendering", () => {
    it("should render the section with id contact", () => {
      render(<Contact />);

      const section = document.getElementById("contact");
      expect(section).toBeInTheDocument();
    });

    it("should render the Get in touch heading", () => {
      render(<Contact />);

      expect(screen.getByRole("heading", { name: /get in touch/i })).toBeInTheDocument();
    });

    it("should render contact links for Email, LinkedIn, GitHub", () => {
      render(<Contact />);

      expect(screen.getByText("ali.pajand[AT]gmail.com")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /email/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
    });
  });
});
