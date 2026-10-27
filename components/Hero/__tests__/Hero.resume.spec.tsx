import { render, screen } from "@testing-library/react";

import { Hero } from "components/Hero/Hero";

describe("Hero", () => {
  it("should not render a résumé CTA in the homepage hero", () => {
    render(<Hero />);

    expect(screen.queryByRole("link", { name: /download résumé/i })).not.toBeInTheDocument();
  });
});
