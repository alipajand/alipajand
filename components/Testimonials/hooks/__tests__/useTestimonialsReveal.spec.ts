import { renderHook } from "@testing-library/react";

import { useTestimonialsReveal } from "components/Testimonials/hooks/useTestimonialsReveal";

describe("useTestimonialsReveal", () => {
  it("returns sectionRef and listRef", () => {
    const { result } = renderHook(() => useTestimonialsReveal());
    expect(result.current.selectors.sectionRef).toBeDefined();
    expect(result.current.selectors.listRef).toBeDefined();
    expect(result.current.selectors.sectionRef.current).toBeNull();
    expect(result.current.selectors.listRef.current).toBeNull();
  });
});
