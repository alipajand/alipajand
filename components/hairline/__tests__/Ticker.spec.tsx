import { render, screen } from "@testing-library/react";

import { Ticker } from "components/hairline/Ticker/Ticker";
import { installMatchMedia, installObservers } from "utils/motion/testEnvironment";

const ITEMS = ["React", "TypeScript", "Design systems"];

beforeEach(() => {
  installMatchMedia(false);
  installObservers();
});

describe("Ticker", () => {
  it("should expose one labelled list and hide the duplicate run and separators", () => {
    render(<Ticker items={ITEMS} icon="ring" direction={1} label="Role fit" />);

    const lists = screen.getAllByRole("list");
    expect(lists).toHaveLength(1);
    expect(lists[0]).toHaveAccessibleName("Role fit");
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual(ITEMS);
  });

  it("should be hidden from assistive technology when it has no label", () => {
    const { container } = render(<Ticker items={ITEMS} icon="spark" direction={-1} />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryAllByRole("list")).toHaveLength(0);
  });
});
