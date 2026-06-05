import { render, renderHook } from "@testing-library/react";

import { useCountUp } from "utils/hooks/useCountUp";

jest.mock("utils/gsap", () => ({
  __esModule: true,
  gsap: {
    to: jest.fn(),
  },
  ScrollTrigger: {
    create: jest.fn(() => ({ kill: jest.fn() })),
  },
  prefersReducedMotion: jest.fn(() => false),
  registerGSAPPlugins: jest.fn(),
}));

type GsapMock = {
  gsap: { to: jest.Mock };
  ScrollTrigger: { create: jest.Mock };
  prefersReducedMotion: jest.Mock;
  registerGSAPPlugins: jest.Mock;
};

function getMock(): GsapMock {
  return jest.requireMock("utils/gsap") as GsapMock;
}

function Harness({ value }: { value: string }) {
  const { ref } = useCountUp(value);
  return <span ref={ref as React.RefObject<HTMLSpanElement>}>{value}</span>;
}

describe("useCountUp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("reports hasParsed=false for non-numeric values", () => {
    const { result } = renderHook(() => useCountUp("Design systems"));
    expect(result.current.hasParsed).toBe(false);
  });

  it("reports hasParsed=true for numeric values with prefix and suffix", () => {
    const { result } = renderHook(() => useCountUp("$2M"));
    expect(result.current.hasParsed).toBe(true);
  });

  it("parses plain numeric values without prefix or suffix", () => {
    const { result } = renderHook(() => useCountUp("42"));
    expect(result.current.hasParsed).toBe(true);
  });

  it("does not create a ScrollTrigger for non-numeric values", () => {
    const mock = getMock();
    render(<Harness value="Accessibility" />);
    expect(mock.ScrollTrigger.create).not.toHaveBeenCalled();
  });

  it("does not animate when reduced motion is preferred", () => {
    const mock = getMock();
    mock.prefersReducedMotion.mockReturnValueOnce(true);
    render(<Harness value="9+" />);
    expect(mock.ScrollTrigger.create).not.toHaveBeenCalled();
  });

  it("animates the counter and writes intermediate then final text on enter", () => {
    const mock = getMock();
    mock.prefersReducedMotion.mockReturnValue(false);

    render(<Harness value="$9+" />);

    expect(mock.registerGSAPPlugins).toHaveBeenCalled();
    expect(mock.ScrollTrigger.create).toHaveBeenCalled();

    const triggerConfig = mock.ScrollTrigger.create.mock.calls[0][0];
    const el = triggerConfig.trigger as HTMLElement;

    triggerConfig.onEnter();
    expect(mock.gsap.to).toHaveBeenCalled();

    const tween = mock.gsap.to.mock.calls[0];
    const counter = tween[0] as { val: number };
    const vars = tween[1] as {
      val: number;
      onUpdate: () => void;
      onComplete: () => void;
    };

    expect(vars.val).toBe(9);

    counter.val = 4.6;
    vars.onUpdate();
    expect(el.textContent).toBe("$5+");

    vars.onComplete();
    expect(el.textContent).toBe("$9+");
  });
});
