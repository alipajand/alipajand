"use client";

import { Breadcrumbs } from "components/Breadcrumbs/Breadcrumbs";
import { MainReveal } from "components/MainReveal/MainReveal";
import { ProjectIndex } from "components/Projects/ProjectIndex";
import { portfolioIndexBreadcrumbs } from "data/breadcrumbs";
import { PORTFOLIO_PAGE_HEADER_TITLE, PORTFOLIO_PAGE_INTRO } from "data/projects";
import { PAGE_HEADER_SHELL, SECTION_INNER } from "utils/visual";

export const PortfolioPageContent = () => {
  return (
    <MainReveal>
      <header className={PAGE_HEADER_SHELL}>
        <div className={SECTION_INNER}>
          <Breadcrumbs items={portfolioIndexBreadcrumbs()} className="mb-6" />
          <h1
            data-header-title
            className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {PORTFOLIO_PAGE_HEADER_TITLE}
          </h1>
          <p
            data-header-lede
            className="mt-4 max-w-4xl text-[15px] leading-relaxed text-muted sm:text-base"
          >
            {PORTFOLIO_PAGE_INTRO}
          </p>
        </div>
      </header>
      <ProjectIndex />
    </MainReveal>
  );
};
