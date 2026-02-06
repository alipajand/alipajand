import { render, screen } from "@testing-library/react";

import { About } from "components/About/About";

describe("About", () => {
  describe("default rendering", () => {
    it("should render the section with id about", () => {
      render(<About />);

      const section = document.getElementById("about");
      expect(section).toBeInTheDocument();
    });

    it("should render the About heading", () => {
      render(<About />);

      expect(screen.getByRole("heading", { name: /about/i })).toBeInTheDocument();
    });

    it("should render the summary text", () => {
      render(<About />);

      expect(screen.getByText(/Senior Product Engineer with 9\+ years/i)).toBeInTheDocument();
    });
  });
});
