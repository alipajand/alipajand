"use client";

import { Breadcrumbs } from "components/Breadcrumbs/Breadcrumbs";
import { MainReveal } from "components/MainReveal/MainReveal";
import { NowSectionBlock } from "features/now/NowSectionBlock";
import { nowBreadcrumbs } from "data/breadcrumbs";
import { NOW_LEDE, NOW_PAGE_TITLE, NOW_SECTIONS } from "data/now";
import { NOW_PAGE_HEADER_OVERLINE } from "data/pageChrome";
import { usePageHeader } from "utils/hooks/usePageHeader";
import { useScrollReveal } from "utils/hooks/useScrollReveal";
import { LABEL_OVERLINE, SECTION_INNER, SECTION_LEDE, SECTION_X } from "utils/visual";

export const NowPageContent = () => {
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
          <Breadcrumbs items={nowBreadcrumbs()} className="mb-6" />
          <p data-header-overline className={`${LABEL_OVERLINE} mb-2`}>
            {NOW_PAGE_HEADER_OVERLINE}
          </p>
          <h1
            data-header-title
            className="font-display font-bold tracking-tight text-3xl sm:text-4xl text-foreground"
          >
            {NOW_PAGE_TITLE}
          </h1>
          <p data-header-lede className={`${SECTION_LEDE} mt-4 max-w-2xl`}>
            {NOW_LEDE}
          </p>
        </div>
      </header>

      <div className={`${SECTION_X} py-14 sm:py-16 lg:py-20 border-t border-border bg-background`}>
        <div className={SECTION_INNER}>
          <div ref={sectionsRef as React.Ref<HTMLDivElement>} className="space-y-12 sm:space-y-14">
            {NOW_SECTIONS.map((section) => (
              <NowSectionBlock key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>
    </MainReveal>
  );
};
