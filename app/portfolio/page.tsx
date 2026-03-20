import type { Metadata } from "next";
import Link from "next/link";

import { About } from "components/About/About";
import { Education } from "components/Education/Education";
import { Experience } from "components/Experience/Experience";
import { Innovation } from "components/Innovation/Innovation";
import { MainReveal } from "components/MainReveal/MainReveal";
import { Projects } from "components/Projects/Projects";
import { Skills } from "components/Skills/Skills";
import { PORTFOLIO_PAGE_LEDE } from "data/site";
import { buildPortfolioMetadata } from "utils/metadata";
import { SECTION_INNER, SECTION_X } from "utils/visual";

export const metadata: Metadata = buildPortfolioMetadata();

export default function PortfolioPage() {
  return (
    <MainReveal>
      <main id="main-content" tabIndex={-1}>
        <header
          className={`${SECTION_X} border-b border-border bg-background pt-28 pb-10 sm:pb-12 sm:pt-32`}
        >
          <div className={SECTION_INNER}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-2">
              Full portfolio
            </p>
            <h1 className="font-display font-bold tracking-tight text-3xl sm:text-4xl text-foreground">
              Background & case studies
            </h1>
            <p className="text-muted text-[15px] sm:text-base leading-relaxed mt-4 max-w-2xl">
              {PORTFOLIO_PAGE_LEDE}
            </p>
            <p className="mt-8">
              <Link
                href="/"
                className="text-sm font-medium text-foreground underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
              >
                ← Back to homepage
              </Link>
            </p>
          </div>
        </header>
        <About />
        <Experience />
        <Projects />
        <Innovation />
        <Skills />
        <Education />
      </main>
    </MainReveal>
  );
}
