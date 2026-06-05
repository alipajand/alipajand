import { render, screen } from "@testing-library/react";

import { HowIThinkCard } from "components/HowIThink/HowIThinkCard";
import type { HowIThinkCard as HowIThinkCardModel } from "data/howIThink";

const card: HowIThinkCardModel = {
  id: "test-card",
  title: "Test Card Title",
  body: "Test card body copy.",
};

describe("HowIThinkCard", () => {
  it("renders the card title and body", () => {
    render(<HowIThinkCard card={card} />);
    expect(screen.getByRole("heading", { name: card.title })).toBeInTheDocument();
    expect(screen.getByText(card.body)).toBeInTheDocument();
  });
});
