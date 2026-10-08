"use client";

import { OPEN_SOURCE_PROJECTS, type OpenSourceProject } from "data/openSourcePage";
import { usePageHeader } from "utils/hooks/usePageHeader";
import { useScrollReveal } from "utils/hooks/useScrollReveal";

export interface OpenSourcePageContentSelectors {
  headerRef: ReturnType<typeof usePageHeader>["selectors"]["headerRef"];
  contentRef: ReturnType<typeof useScrollReveal>["selectors"]["sectionRef"];
  projects: OpenSourceProject[];
}

export const useOpenSourcePageContent = (): {
  selectors: OpenSourcePageContentSelectors;
} => {
  const {
    selectors: { headerRef },
  } = usePageHeader();

  const {
    selectors: { sectionRef: contentRef },
  } = useScrollReveal({ y: 36, stagger: 0.1 });

  return {
    selectors: {
      headerRef,
      contentRef,
      projects: OPEN_SOURCE_PROJECTS,
    },
  };
};
