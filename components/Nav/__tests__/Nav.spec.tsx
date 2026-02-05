import { fireEvent, render, screen } from "@testing-library/react";

import { Nav } from "components/Nav/Nav";

describe("Nav", () => {
  describe("default rendering", () => {
    it("should render desktop nav links", () => {
      render(<Nav />);

      const aboutLinks = screen.getAllByRole("link", { name: /^about$/i });
      const experienceLinks = screen.getAllByRole("link", { name: /^experience$/i });
      const skillsLinks = screen.getAllByRole("link", { name: /^skills$/i });
      const contactLinks = screen.getAllByRole("link", { name: /^contact$/i });
      expect(aboutLinks.length).toBeGreaterThanOrEqual(1);
      expect(experienceLinks.length).toBeGreaterThanOrEqual(1);
      expect(skillsLinks.length).toBeGreaterThanOrEqual(1);
      expect(contactLinks.length).toBeGreaterThanOrEqual(1);
    });

    it("should render the menu toggle button", () => {
      render(<Nav />);

      expect(screen.getByRole("button", { name: /open menu/i })).toBeInTheDocument();
    });
  });

  describe("user interaction", () => {
    it("should open mobile menu when toggle button is clicked", () => {
      render(<Nav />);

      const toggle = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(toggle);

      const aboutLinks = screen.getAllByRole("link", { name: /^about$/i });
      expect(aboutLinks.length).toBeGreaterThanOrEqual(1);
    });
  });
});
