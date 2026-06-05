import { render, screen } from "@testing-library/react";

import { HowIThinkGridItem } from "components/HowIThink/HowIThinkGridItem";
import type { HowIThinkCard as HowIThinkCardModel } from "data/howIThink";

const card: HowIThinkCardModel = {
  id: "grid-card",
  title: "Grid Card Title",
  body: "Grid card body copy.",
};

describe("HowIThinkGridItem", () => {
  it("renders a list item carrying the reveal data attribute", () => {
    const { container } = render(
      <ul>
        <HowIThinkGridItem card={card} />
      </ul>
    );

    const item = container.querySelector("li[data-howitink-card]");
    expect(item).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: card.title })).toBeInTheDocument();
  });
});
