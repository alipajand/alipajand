"use client";

import Link from "next/link";

import { About } from "components/About/About";
import { Education } from "components/Education/Education";
import { Experience } from "components/Experience/Experience";
import { Innovation } from "components/Innovation/Innovation";
import { MainReveal } from "components/MainReveal/MainReveal";
import { Projects } from "components/Projects/Projects";
import { Skills } from "components/Skills/Skills";
import { PORTFOLIO_POSITIONING_PARAGRAPH } from "data/portfolioFit";
import {
  PAGE_LINK_BACK_TO_HOMEPAGE,
  PORTFOLIO_PAGE_HEADER_OVERLINE,
  PORTFOLIO_PAGE_HEADER_TITLE,
} from "data/pageChrome";
import { PortfolioRoleFitStrip } from "features/portfolio/PortfolioRoleFitStrip";
import { PortfolioWhatToLookFor } from "features/portfolio/PortfolioWhatToLookFor";
import { PORTFOLIO_PAGE_LEDE } from "data/site";
import { usePageHeader } from "utils/hooks/usePageHeader";
import { SECTION_INNER, SECTION_X } from "utils/visual";

export function PortfolioPageContent() {
  const {
    selectors: { headerRef },
  } = usePageHeader();

  return (
    <MainReveal>
      <header
        ref={headerRef}
        className={`${SECTION_X} border-b border-border bg-background pt-28 pb-10 sm:pb-12 sm:pt-32`}
      >
        <div className={SECTION_INNER}>
          <p
            data-header-overline
            className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-2"
          >
            {PORTFOLIO_PAGE_HEADER_OVERLINE}
          </p>
          <h1
            data-header-title
            className="font-display font-bold tracking-tight text-3xl sm:text-4xl text-foreground"
          >
            {PORTFOLIO_PAGE_HEADER_TITLE}
          </h1>
          <p data-header-lede className="text-muted text-[15px] sm:text-base leading-relaxed mt-4">
            {PORTFOLIO_PAGE_LEDE}
          </p>
          <p className="mt-5 max-w-4xl text-foreground/90 text-[15px] sm:text-base leading-relaxed">
            {PORTFOLIO_POSITIONING_PARAGRAPH}
          </p>
          <PortfolioRoleFitStrip />
          <p data-header-back className="mt-8">
            <Link
              href="/"
              className="text-sm font-medium text-foreground underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
            >
              {PAGE_LINK_BACK_TO_HOMEPAGE}
            </Link>
          </p>
        </div>
      </header>
      <About />
      <Experience />
      <PortfolioWhatToLookFor />
      <Projects />
      <Innovation />
      <Skills />
      <Education />
    </MainReveal>
  );
}
