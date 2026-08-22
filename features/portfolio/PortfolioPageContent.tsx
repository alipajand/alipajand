"use client";

import type React from "react";

import { Breadcrumbs } from "components/Breadcrumbs/Breadcrumbs";
import { MainReveal } from "components/MainReveal/MainReveal";
import { ProjectIndex } from "components/Projects/ProjectIndex";
import { PortfolioRoleFitStrip } from "features/portfolio/PortfolioRoleFitStrip";
import { PortfolioWhatToLookFor } from "features/portfolio/PortfolioWhatToLookFor";
import { portfolioIndexBreadcrumbs } from "data/breadcrumbs";
import {
  PORTFOLIO_PAGE_HEADER_TITLE,
  PORTFOLIO_PAGE_INTRO,
  PORTFOLIO_PROFILE_DETAILS,
} from "data/projects";
import { usePageHeader } from "utils/hooks/usePageHeader";
import { PAGE_HEADER_SHELL, SECTION_INNER } from "utils/visual";

export const PortfolioPageContent = () => {
  const {
    selectors: { headerRef },
  } = usePageHeader();

  return (
    <MainReveal>
      <header ref={headerRef as React.RefObject<HTMLElement>} className={PAGE_HEADER_SHELL}>
        <div className={SECTION_INNER}>
          <Breadcrumbs items={portfolioIndexBreadcrumbs()} className="mb-6" />
          <h1
            data-header-title
            className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {PORTFOLIO_PAGE_HEADER_TITLE}
          </h1>
          <div data-header-lede className="mt-4 max-w-4xl space-y-4">
            {PORTFOLIO_PAGE_INTRO.map((paragraph) => (
              <p key={paragraph} className="text-[15px] leading-relaxed text-muted sm:text-base">
                {paragraph}
              </p>
            ))}
            <p className="text-[15px] font-medium leading-relaxed text-foreground/85 sm:text-base">
              {PORTFOLIO_PROFILE_DETAILS}
            </p>
          </div>
          <PortfolioRoleFitStrip />
        </div>
      </header>
      <PortfolioWhatToLookFor />
      <ProjectIndex />
    </MainReveal>
  );
};
