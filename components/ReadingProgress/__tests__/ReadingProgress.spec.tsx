import { render } from "@testing-library/react";

import { ReadingProgress } from "components/ReadingProgress/ReadingProgress";

jest.mock("utils/gsap", () => ({
  __esModule: true,
  gsap: {
    set: jest.fn(),
  },
  ScrollTrigger: {
    create: jest.fn(() => ({ kill: jest.fn() })),
  },
  registerGSAPPlugins: jest.fn(),
}));

type GsapMock = {
  gsap: { set: jest.Mock };
  ScrollTrigger: { create: jest.Mock };
  registerGSAPPlugins: jest.Mock;
};

function getMock(): GsapMock {
  return jest.requireMock("utils/gsap") as GsapMock;
}

describe("ReadingProgress", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a decorative progress bar", () => {
    const { container } = render(<ReadingProgress />);
    const bar = container.querySelector('div[aria-hidden="true"]');
    expect(bar).toBeInTheDocument();
  });

  it("initializes the bar and updates its scale on scroll progress", () => {
    const mock = getMock();
    render(<ReadingProgress />);

    expect(mock.registerGSAPPlugins).toHaveBeenCalled();
    expect(mock.gsap.set).toHaveBeenCalledWith(expect.anything(), { scaleX: 0 });
    expect(mock.ScrollTrigger.create).toHaveBeenCalled();

    const config = mock.ScrollTrigger.create.mock.calls[0][0];
    config.onUpdate({ progress: 0.5 });

    expect(mock.gsap.set).toHaveBeenCalledWith(expect.anything(), {
      scaleX: 0.5,
      overwrite: true,
    });
  });
});
