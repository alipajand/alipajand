import { act, render } from "@testing-library/react";

import { RouteChangeFocus } from "components/RouteChangeFocus/RouteChangeFocus";
import { scrollToTop } from "utils/scrollToTop";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("utils/scrollToTop", () => ({
  scrollToTop: jest.fn(),
}));

const { usePathname } = jest.requireMock("next/navigation") as {
  usePathname: jest.Mock;
};

const scrollToTopMock = scrollToTop as jest.Mock;

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
    scrollToTopMock.mockClear();
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

  it("should scroll to top and focus main content after a pathname change to /portfolio", () => {
    const main = document.createElement("main");
    main.id = "main-content";
    main.tabIndex = -1;
    document.body.appendChild(main);

    const { rerender } = render(<RouteChangeFocus />);

    usePathname.mockReturnValue("/portfolio");

    act(() => {
      rerender(<RouteChangeFocus />);
    });

    expect(scrollToTopMock).toHaveBeenCalled();
    expect(document.activeElement).toBe(main);

    document.body.removeChild(main);
  });

  it("should scroll to top after a pathname change to a non-portfolio route", () => {
    const main = document.createElement("main");
    main.id = "main-content";
    main.tabIndex = -1;
    document.body.appendChild(main);

    const { rerender } = render(<RouteChangeFocus />);

    usePathname.mockReturnValue("/writing");

    act(() => {
      rerender(<RouteChangeFocus />);
    });

    expect(scrollToTopMock).toHaveBeenCalled();
    expect(document.activeElement).toBe(main);

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

    expect(scrollToTopMock).toHaveBeenCalled();
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

    expect(scrollToTopMock).toHaveBeenCalled();
    expect(targetScrollIntoView).toHaveBeenCalledWith({ block: "start" });
    expect(document.activeElement).not.toBe(main);

    window.history.replaceState(null, "", "/");
    document.body.innerHTML = "";
  });

  it("should keep the restored scroll position after a Back or Forward step", () => {
    const main = document.createElement("main");
    main.id = "main-content";
    main.tabIndex = -1;
    document.body.appendChild(main);

    const { rerender } = render(<RouteChangeFocus />);

    act(() => {
      window.history.replaceState(null, "", "/writing");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    usePathname.mockReturnValue("/writing");

    act(() => {
      rerender(<RouteChangeFocus />);
    });

    expect(scrollToTopMock).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(main);

    window.history.replaceState(null, "", "/");
    document.body.innerHTML = "";
  });

  it("should still scroll to top on a link navigation after a Back step to another page", () => {
    const { rerender } = render(<RouteChangeFocus />);

    act(() => {
      window.history.replaceState(null, "", "/writing");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    // A link navigation updates the address before its route renders.
    window.history.replaceState(null, "", "/now");
    usePathname.mockReturnValue("/now");

    act(() => {
      rerender(<RouteChangeFocus />);
    });

    expect(scrollToTopMock).toHaveBeenCalled();

    window.history.replaceState(null, "", "/");
  });

  it("should keep the restored position when Back is pressed before the next page renders", () => {
    const main = document.createElement("main");
    main.id = "main-content";
    main.tabIndex = -1;
    document.body.appendChild(main);
    window.history.replaceState(null, "", "/writing/post");
    usePathname.mockReturnValue("/writing/post");
    const { rerender } = render(<RouteChangeFocus />);

    // A link to /writing has pushed its address; Back is pressed before /writing renders.
    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    // /writing still commits, for an address the browser has already left, then the post again.
    usePathname.mockReturnValue("/writing");
    act(() => {
      rerender(<RouteChangeFocus />);
    });
    usePathname.mockReturnValue("/writing/post");
    act(() => {
      rerender(<RouteChangeFocus />);
    });

    expect(scrollToTopMock).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(main);

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
