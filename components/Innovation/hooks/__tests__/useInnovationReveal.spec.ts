import { renderHook } from "@testing-library/react";

import { useInnovationReveal } from "components/Innovation/hooks/useInnovationReveal";

describe("useInnovationReveal", () => {
  it("returns sectionRef and listRef", () => {
    const { result } = renderHook(() => useInnovationReveal());
    expect(result.current.selectors.sectionRef).toBeDefined();
    expect(result.current.selectors.listRef).toBeDefined();
    expect(result.current.selectors.sectionRef.current).toBeNull();
    expect(result.current.selectors.listRef.current).toBeNull();
  });
});
