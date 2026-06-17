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

  it("should not focus main content on the initial render", () => {
    const main = document.createElement("main");
    main.id = "main-content";
    main.tabIndex = -1;
    document.body.appendChild(main);

    render(<RouteChangeFocus />);

    expect(document.activeElement).not.toBe(main);

    document.body.removeChild(main);
  });

  it("should focus main content without scrolling after a pathname change to /portfolio", () => {
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
    expect(scrollIntoView).not.toHaveBeenCalled();

    document.body.removeChild(main);
  });

  it("should not scroll to hash targets on the portfolio index", () => {
    const main = document.createElement("main");
    main.id = "main-content";
    main.tabIndex = -1;
    document.body.appendChild(main);

    const target = document.createElement("section");
    target.id = "project-mapbylaw-platform-ui-ai-reports";
    const targetScrollIntoView = jest.fn();
    target.scrollIntoView = targetScrollIntoView;
    document.body.appendChild(target);

    window.history.replaceState(null, "", "/portfolio#project-mapbylaw-platform-ui-ai-reports");

    const { rerender } = render(<RouteChangeFocus />);

    usePathname.mockReturnValue("/portfolio");

    act(() => {
      rerender(<RouteChangeFocus />);
    });

    expect(targetScrollIntoView).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(main);

    window.history.replaceState(null, "", "/");
    document.body.innerHTML = "";
  });

  it("should scroll to a hash target after a pathname change when the URL has a fragment", () => {
    const main = document.createElement("main");
    main.id = "main-content";
    main.tabIndex = -1;
    document.body.appendChild(main);

    const target = document.createElement("section");
    target.id = "writing-section";
    const targetScrollIntoView = jest.fn();
    target.scrollIntoView = targetScrollIntoView;
    document.body.appendChild(target);

    window.history.replaceState(null, "", "/writing#writing-section");

    const { rerender } = render(<RouteChangeFocus />);

    usePathname.mockReturnValue("/writing");

    act(() => {
      rerender(<RouteChangeFocus />);
    });

    expect(targetScrollIntoView).toHaveBeenCalledWith({ block: "start" });
    expect(document.activeElement).not.toBe(main);

    window.history.replaceState(null, "", "/");
    document.body.innerHTML = "";
  });

  it("should scroll to a hash target when only the fragment changes outside /portfolio", () => {
    const target = document.createElement("section");
    target.id = "writing-section";
    const targetScrollIntoView = jest.fn();
    target.scrollIntoView = targetScrollIntoView;
    document.body.appendChild(target);

    window.history.replaceState(null, "", "/writing");

    render(<RouteChangeFocus />);

    act(() => {
      window.history.replaceState(null, "", "/writing#writing-section");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    expect(targetScrollIntoView).toHaveBeenCalledWith({ block: "start" });

    window.history.replaceState(null, "", "/");
    document.body.innerHTML = "";
  });

  it("should ignore hash changes on the portfolio index", () => {
    const target = document.createElement("section");
    target.id = "project-demo-project";
    const targetScrollIntoView = jest.fn();
    target.scrollIntoView = targetScrollIntoView;
    document.body.appendChild(target);

    window.history.replaceState(null, "", "/portfolio#project-demo-project");

    render(<RouteChangeFocus />);

    act(() => {
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    expect(targetScrollIntoView).not.toHaveBeenCalled();

    window.history.replaceState(null, "", "/");
    document.body.innerHTML = "";
  });
});
