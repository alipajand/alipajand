"use client";

import { useMemo } from "react";

import { OPEN_SOURCE_PROJECTS, type OpenSourceProject } from "data/openSourcePage";
import { usePageHeader } from "utils/hooks/usePageHeader";
import { useScrollReveal } from "utils/hooks/useScrollReveal";

export interface OpenSourcePageContentSelectors {
  headerRef: ReturnType<typeof usePageHeader>["selectors"]["headerRef"];
  contentRef: ReturnType<typeof useScrollReveal>["selectors"]["sectionRef"];
  featuredProjects: OpenSourceProject[];
  supportingProjects: OpenSourceProject[];
}

export const useOpenSourcePageContent = (): {
  selectors: OpenSourcePageContentSelectors;
} => {
  const {
    selectors: { headerRef },
  } = usePageHeader();

  const {
    selectors: { sectionRef: contentRef },
  } = useScrollReveal({ y: 36, stagger: 0.1, start: "top 90%" });

  const featuredProjects = useMemo(
    () => OPEN_SOURCE_PROJECTS.filter((project) => project.featured),
    []
  );

  const supportingProjects = useMemo(
    () => OPEN_SOURCE_PROJECTS.filter((project) => !project.featured),
    []
  );

  return {
    selectors: {
      headerRef,
      contentRef,
      featuredProjects,
      supportingProjects,
    },
  };
};
