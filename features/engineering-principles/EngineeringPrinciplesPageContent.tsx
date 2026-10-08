"use client";

import { Breadcrumbs } from "components/Breadcrumbs/Breadcrumbs";
import { MainReveal } from "components/MainReveal/MainReveal";
import {
  TableOfContents,
  TableOfContentsDisclosure,
} from "components/TableOfContents/TableOfContents";
import { EngineeringPrinciplesSectionBlock } from "features/engineering-principles/EngineeringPrinciplesSectionBlock";
import { engineeringPrinciplesBreadcrumbs } from "data/breadcrumbs";
import {
  ENGINEERING_PRINCIPLES_HEADER_OVERLINE,
  ENGINEERING_PRINCIPLES_LEDE,
  ENGINEERING_PRINCIPLES_PAGE_TITLE,
  ENGINEERING_PRINCIPLES_SECTIONS,
  ENGINEERING_PRINCIPLES_TOC_ARIA_LABEL,
} from "data/engineeringPrinciples";
import type { PostHeading } from "utils/headings";
import { usePageHeader } from "utils/hooks/usePageHeader";
import { useScrollReveal } from "utils/hooks/useScrollReveal";
import {
  ARTICLE_TOC_ASIDE,
  ARTICLE_TOC_GRID,
  LABEL_OVERLINE,
  PAGE_HEADER_SHELL,
  SECTION_INNER,
  SECTION_LEDE,
  SECTION_SHELL_BRIDGE,
} from "utils/visual";

const PRINCIPLE_HEADINGS: PostHeading[] = ENGINEERING_PRINCIPLES_SECTIONS.map((section) => ({
  id: section.id,
  text: section.title,
  level: 2,
}));

export const EngineeringPrinciplesPageContent = () => {
  const {
    selectors: { headerRef },
  } = usePageHeader();

  const {
    selectors: { sectionRef: sectionsRef },
  } = useScrollReveal({ y: 36, stagger: 0.12 });

  return (
    <MainReveal>
      <header ref={headerRef} className={PAGE_HEADER_SHELL}>
        <div className={SECTION_INNER}>
          <Breadcrumbs items={engineeringPrinciplesBreadcrumbs()} className="mb-6" />
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
        </div>
      </header>

      <div className={SECTION_SHELL_BRIDGE}>
        <article className={`${SECTION_INNER} ${ARTICLE_TOC_GRID}`}>
          <div className="min-w-0">
            <TableOfContentsDisclosure
              headings={PRINCIPLE_HEADINGS}
              ariaLabel={ENGINEERING_PRINCIPLES_TOC_ARIA_LABEL}
              className="mb-10 lg:hidden"
            />
            <div
              ref={sectionsRef as React.Ref<HTMLDivElement>}
              className="space-y-12 sm:space-y-14"
            >
              {ENGINEERING_PRINCIPLES_SECTIONS.map((section, index) => (
                <EngineeringPrinciplesSectionBlock
                  key={section.id}
                  section={section}
                  number={index + 1}
                />
              ))}
            </div>
          </div>
          <aside className="hidden lg:block">
            <TableOfContents
              headings={PRINCIPLE_HEADINGS}
              ariaLabel={ENGINEERING_PRINCIPLES_TOC_ARIA_LABEL}
              className={ARTICLE_TOC_ASIDE}
            />
          </aside>
        </article>
      </div>
    </MainReveal>
  );
};
