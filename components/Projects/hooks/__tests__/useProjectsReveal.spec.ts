import { renderHook } from "@testing-library/react";

import { useProjectsReveal } from "components/Projects/hooks/useProjectsReveal";

describe("useProjectsReveal", () => {
  it("returns sectionRef and listRef", () => {
    const { result } = renderHook(() => useProjectsReveal());
    expect(result.current.selectors.sectionRef).toBeDefined();
    expect(result.current.selectors.listRef).toBeDefined();
    expect(result.current.selectors.sectionRef.current).toBeNull();
    expect(result.current.selectors.listRef.current).toBeNull();
  });
});
