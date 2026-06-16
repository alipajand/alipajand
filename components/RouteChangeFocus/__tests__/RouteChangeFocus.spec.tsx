import { act, render } from "@testing-library/react";

import { RouteChangeFocus } from "components/RouteChangeFocus/RouteChangeFocus";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const { usePathname } = jest.requireMock("next/navigation") as {
  usePathname: jest.Mock;
};

describe("RouteChangeFocus", () => {
  const requestAnimationFrameMock = jest
    .spyOn(window, "requestAnimationFrame")
    .mockImplementation((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

  const cancelAnimationFrameMock = jest
    .spyOn(window, "cancelAnimationFrame")
    .mockImplementation(() => {});

  beforeEach(() => {
    usePathname.mockReturnValue("/");
  });

  afterAll(() => {
    requestAnimationFrameMock.mockRestore();
    cancelAnimationFrameMock.mockRestore();
  });

  it("does not focus main content on the initial render", () => {
    const main = document.createElement("main");
    main.id = "main-content";
    main.tabIndex = -1;
    document.body.appendChild(main);

    render(<RouteChangeFocus />);

    expect(document.activeElement).not.toBe(main);

    document.body.removeChild(main);
  });

  it("focuses main content after a pathname change", () => {
    const main = document.createElement("main");
    main.id = "main-content";
    main.tabIndex = -1;
    document.body.appendChild(main);
    const scrollIntoView = jest.fn();
    main.scrollIntoView = scrollIntoView;

    const { rerender } = render(<RouteChangeFocus />);

    usePathname.mockReturnValue("/portfolio");

    act(() => {
      rerender(<RouteChangeFocus />);
    });

    expect(document.activeElement).toBe(main);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: "start" });

    document.body.removeChild(main);
  });
});
