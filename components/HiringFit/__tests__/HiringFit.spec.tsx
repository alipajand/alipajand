import { render, screen } from "@testing-library/react";

import { HiringFit } from "components/HiringFit/HiringFit";
import { HIRING_FIT_CARDS, HIRING_FIT_HEADING } from "data/hiringFit";

describe("HiringFit", () => {
  it("renders section heading", () => {
    render(<HiringFit />);
    expect(screen.getByRole("heading", { name: HIRING_FIT_HEADING })).toBeInTheDocument();
  });

  it("renders all four card titles", () => {
    render(<HiringFit />);
    for (const card of HIRING_FIT_CARDS) {
      expect(screen.getByRole("heading", { name: card.title, level: 3 })).toBeInTheDocument();
    }
  });
});
