import { fireEvent, render, screen } from "@testing-library/react";

import { Nav } from "components/Nav/Nav";
import { SITE_NAME } from "data/site";

describe("Nav", () => {
  describe("default rendering", () => {
    it("should render desktop nav links", () => {
      render(<Nav />);

      expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: SITE_NAME })).toHaveAttribute("href", "/");
      expect(screen.getAllByRole("link", { name: /^proof$/i }).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByRole("link", { name: /^portfolio$/i }).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByRole("link", { name: /^contact$/i }).length).toBeGreaterThanOrEqual(1);
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

      expect(screen.getAllByRole("link", { name: /^why hire$/i }).length).toBeGreaterThanOrEqual(1);
    });
  });
});
