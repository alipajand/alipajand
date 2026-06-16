"use client";

import Link from "next/link";

import { MainReveal } from "components/MainReveal/MainReveal";
import { Projects } from "components/Projects/Projects";
import { PORTFOLIO_PAGE_HEADER_TITLE, PORTFOLIO_PAGE_INTRO } from "data/projects";
import { PAGE_LINK_BACK_TO_HOMEPAGE } from "data/pageChrome";
import { usePageHeader } from "utils/hooks/usePageHeader";
import { PAGE_HEADER_SHELL, SECTION_INNER } from "utils/visual";

export function PortfolioPageContent() {
  const {
    selectors: { headerRef },
  } = usePageHeader();

  return (
    <MainReveal>
      <header ref={headerRef} className={PAGE_HEADER_SHELL}>
        <div className={SECTION_INNER}>
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
          <p data-header-back className="mt-8">
            <Link
              href="/"
              className="rounded-sm text-sm font-medium text-foreground underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {PAGE_LINK_BACK_TO_HOMEPAGE}
            </Link>
          </p>
        </div>
      </header>
      <Projects />
    </MainReveal>
  );
}
