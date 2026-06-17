import { fireEvent, render, screen } from "@testing-library/react";

import { SkipLink } from "components/SkipLink/SkipLink";

describe("SkipLink", () => {
  it("should focus the main-content target when clicked", () => {
    const requestAnimationFrameMock = jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      });

    const main = document.createElement("main");
    main.id = "main-content";
    main.tabIndex = -1;
    const scrollIntoView = jest.fn();
    main.scrollIntoView = scrollIntoView;
    document.body.appendChild(main);

    render(<SkipLink href="#main-content" label="Skip to content" />);

    fireEvent.click(screen.getByRole("link", { name: "Skip to content" }));

    expect(document.activeElement).toBe(main);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: "start" });

    requestAnimationFrameMock.mockRestore();
    document.body.removeChild(main);
  });
});
