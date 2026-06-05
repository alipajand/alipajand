"use client";

import Link from "next/link";

import { MainReveal } from "components/MainReveal/MainReveal";
import { EngineeringPrinciplesSectionBlock } from "features/engineering-principles/EngineeringPrinciplesSectionBlock";
import {
  ENGINEERING_PRINCIPLES_HEADER_OVERLINE,
  ENGINEERING_PRINCIPLES_LEDE,
  ENGINEERING_PRINCIPLES_PAGE_TITLE,
  ENGINEERING_PRINCIPLES_SECTIONS,
} from "data/engineeringPrinciples";
import { PAGE_LINK_BACK_TO_HOMEPAGE } from "data/pageChrome";
import { usePageHeader } from "utils/hooks/usePageHeader";
import { useScrollReveal } from "utils/hooks/useScrollReveal";
import { LABEL_OVERLINE, SECTION_INNER, SECTION_LEDE, SECTION_X } from "utils/visual";

export function EngineeringPrinciplesPageContent() {
  const {
    selectors: { headerRef },
  } = usePageHeader();

  const {
    selectors: { sectionRef: sectionsRef },
  } = useScrollReveal({ y: 36, stagger: 0.12, start: "top 90%" });

  return (
    <MainReveal>
      <header
        ref={headerRef}
        className={`${SECTION_X} border-b border-border bg-background pt-28 pb-10 sm:pb-12 sm:pt-32`}
      >
        <div className={SECTION_INNER}>
          <p data-header-overline className={`${LABEL_OVERLINE} mb-2`}>
            {ENGINEERING_PRINCIPLES_HEADER_OVERLINE}
          </p>
          <h1
            data-header-title
            className="font-display font-bold tracking-tight text-3xl sm:text-4xl text-foreground"
          >
            {ENGINEERING_PRINCIPLES_PAGE_TITLE}
          </h1>
          <p data-header-lede className={`${SECTION_LEDE} mt-4 max-w-2xl`}>
            {ENGINEERING_PRINCIPLES_LEDE}
          </p>
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

      <div className={`${SECTION_X} py-14 sm:py-16 lg:py-20 border-t border-border bg-background`}>
        <article className={SECTION_INNER}>
          <div ref={sectionsRef as React.Ref<HTMLDivElement>} className="space-y-12 sm:space-y-14">
            {ENGINEERING_PRINCIPLES_SECTIONS.map((section) => (
              <EngineeringPrinciplesSectionBlock key={section.id} section={section} />
            ))}
          </div>
        </article>
      </div>
    </MainReveal>
  );
}
