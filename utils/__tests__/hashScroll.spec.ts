import { scrollToHashElement } from "utils/hashScroll";

describe("scrollToHashElement", () => {
  const requestAnimationFrameMock = jest
    .spyOn(window, "requestAnimationFrame")
    .mockImplementation((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

  const cancelAnimationFrameMock = jest
    .spyOn(window, "cancelAnimationFrame")
    .mockImplementation(() => {});

  afterAll(() => {
    requestAnimationFrameMock.mockRestore();
    cancelAnimationFrameMock.mockRestore();
  });

  it("should scroll to the matching element", () => {
    const target = document.createElement("section");
    target.id = "project-demo";
    const scrollIntoView = jest.fn();
    target.scrollIntoView = scrollIntoView;
    document.body.appendChild(target);

    scrollToHashElement("#project-demo");

    expect(scrollIntoView).toHaveBeenCalledWith({ block: "start" });

    document.body.removeChild(target);
  });

  it("should retry until the target element exists", () => {
    const scrollIntoView = jest.fn();
    let frame = 0;

    requestAnimationFrameMock.mockImplementation((callback: FrameRequestCallback) => {
      frame += 1;
      if (frame === 2) {
        const target = document.createElement("section");
        target.id = "project-delayed";
        target.scrollIntoView = scrollIntoView;
        document.body.appendChild(target);
      }
      callback(0);
      return frame;
    });

    scrollToHashElement("#project-delayed");

    expect(scrollIntoView).toHaveBeenCalledWith({ block: "start" });

    document.body.innerHTML = "";
    requestAnimationFrameMock.mockImplementation((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
  });

  it("should no-op for empty hashes", () => {
    scrollToHashElement("#");
    scrollToHashElement("");
  });
});
