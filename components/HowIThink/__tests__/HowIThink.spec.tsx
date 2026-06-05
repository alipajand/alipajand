import { render, screen } from "@testing-library/react";

import { HowIThink } from "components/HowIThink/HowIThink";
import { HOW_I_THINK_CARDS, HOW_I_THINK_HEADING, HOW_I_THINK_LEDE } from "data/howIThink";

describe("HowIThink", () => {
  it("renders the section with the how-i-think id", () => {
    render(<HowIThink />);
    expect(document.getElementById("how-i-think")).toBeInTheDocument();
  });

  it("renders the heading and lede", () => {
    render(<HowIThink />);
    expect(screen.getByRole("heading", { name: HOW_I_THINK_HEADING })).toBeInTheDocument();
    expect(screen.getByText(HOW_I_THINK_LEDE)).toBeInTheDocument();
  });

  it("renders a card for every entry in the data", () => {
    render(<HowIThink />);
    for (const card of HOW_I_THINK_CARDS) {
      expect(screen.getByRole("heading", { name: card.title })).toBeInTheDocument();
    }
  });
});
