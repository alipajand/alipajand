import { render, renderHook } from "@testing-library/react";

import { useCountUp } from "utils/hooks/useCountUp";

jest.mock("utils/gsap", () => ({
  __esModule: true,
  gsap: {
    to: jest.fn(),
  },
  prefersReducedMotion: jest.fn(() => false),
}));

type GsapMock = {
  gsap: { to: jest.Mock };
  prefersReducedMotion: jest.Mock;
};

const getMock = (): GsapMock => {
  return jest.requireMock("utils/gsap") as GsapMock;
};

const Harness = ({ value }: { value: string }) => {
  const { ref } = useCountUp(value);
  return <span ref={ref as React.RefObject<HTMLSpanElement>}>{value}</span>;
};

describe("useCountUp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should report hasParsed=false for non-numeric values", () => {
    const { result } = renderHook(() => useCountUp("Design systems"));
    expect(result.current.hasParsed).toBe(false);
  });

  it("should report hasParsed=true for numeric values with prefix and suffix", () => {
    const { result } = renderHook(() => useCountUp("$2M"));
    expect(result.current.hasParsed).toBe(true);
  });

  it("should parse plain numeric values without prefix or suffix", () => {
    const { result } = renderHook(() => useCountUp("42"));
    expect(result.current.hasParsed).toBe(true);
  });

  it("should not animate non-numeric values", () => {
    const mock = getMock();
    render(<Harness value="Accessibility" />);
    expect(mock.gsap.to).not.toHaveBeenCalled();
  });

  it("should not animate when reduced motion is preferred", () => {
    const mock = getMock();
    mock.prefersReducedMotion.mockReturnValueOnce(true);
    render(<Harness value="9+" />);
    expect(mock.gsap.to).not.toHaveBeenCalled();
  });

  it("should animate the counter and write intermediate then final text on enter", () => {
    const mock = getMock();
    mock.prefersReducedMotion.mockReturnValue(false);

    const { container } = render(<Harness value="$9+" />);
    const el = container.querySelector("span") as HTMLElement;

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
