import { render, screen } from "@testing-library/react";

import { Experience } from "components/Experience/Experience";

describe("Experience", () => {
  describe("default rendering", () => {
    it("should render the section with id experience", () => {
      render(<Experience />);

      const section = document.getElementById("experience");
      expect(section).toBeInTheDocument();
    });

    it("should render the Experience heading", () => {
      render(<Experience />);

      expect(screen.getByRole("heading", { name: /experience/i })).toBeInTheDocument();
    });

    it("should render job entries with company names", () => {
      render(<Experience />);

      expect(screen.getByText("AlwaysGeeky Games")).toBeInTheDocument();
      expect(screen.getByText("Emplifi")).toBeInTheDocument();
      expect(screen.getByText("ControlTech Startup Studio")).toBeInTheDocument();
      expect(screen.getByText("Rayvarz Inc.")).toBeInTheDocument();
    });
  });
});
