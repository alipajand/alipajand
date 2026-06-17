import { renderHook } from "@testing-library/react";

import { useOpenSourcePageContent } from "features/open-source/hooks/useOpenSourcePageContent";
import { OPEN_SOURCE_PROJECTS } from "data/openSourcePage";

jest.mock("utils/hooks/usePageHeader", () => ({
  usePageHeader: jest.fn(() => ({
    selectors: {
      headerRef: { current: null },
    },
  })),
}));

jest.mock("utils/hooks/useScrollReveal", () => ({
  useScrollReveal: jest.fn(() => ({
    selectors: {
      sectionRef: { current: null },
    },
  })),
}));

describe("useOpenSourcePageContent", () => {
  it("should return header, content refs, and split project collections", () => {
    const { result } = renderHook(() => useOpenSourcePageContent());

    expect(result.current.selectors.headerRef).toBeDefined();
    expect(result.current.selectors.contentRef).toBeDefined();
    expect(result.current.selectors.featuredProjects).toEqual(
      OPEN_SOURCE_PROJECTS.filter((project) => project.featured)
    );
    expect(result.current.selectors.supportingProjects).toEqual(
      OPEN_SOURCE_PROJECTS.filter((project) => !project.featured)
    );
  });
});
