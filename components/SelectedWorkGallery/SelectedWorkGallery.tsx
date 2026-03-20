"use client";

import { GalleryCard } from "components/SelectedWorkGallery/GalleryCard";
import { useSelectedWorkReveal } from "components/SelectedWorkGallery/hooks/useSelectedWorkReveal";
import { SELECTED_WORK_ITEMS } from "data/selectedWork";
import { SECTION_INNER, SECTION_LEDE_LG, SECTION_SHELL, SECTION_TITLE } from "utils/visual";

export function SelectedWorkGallery() {
  const {
    selectors: { sectionRef, listRef },
  } = useSelectedWorkReveal();

  return (
    <section
      id="selected-work-gallery"
      ref={sectionRef}
      role="region"
      aria-labelledby="selected-work-gallery-heading"
      className={SECTION_SHELL}
    >
      <div className={SECTION_INNER}>
        <h2
          id="selected-work-gallery-heading"
          className={`${SECTION_TITLE} mb-4 sm:mb-5`}
          data-reveal
        >
          Selected work
        </h2>
        <p className={`${SECTION_LEDE_LG} mb-10 sm:mb-12`} data-reveal>
          Quick visual read—real screenshots when shareable; otherwise illustrative thumbnails. Full
          writeups live under{" "}
          <a
            href="/portfolio#projects"
            className="text-foreground underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
          >
            Case studies
          </a>{" "}
          on the portfolio page.
        </p>

        <div
          ref={listRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          role="list"
        >
          {SELECTED_WORK_ITEMS.map((item) => (
            <div key={item.id} role="listitem">
              <GalleryCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
