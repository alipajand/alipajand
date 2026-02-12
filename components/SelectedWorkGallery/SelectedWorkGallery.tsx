"use client";

import { GalleryCard } from "components/SelectedWorkGallery/GalleryCard";
import { useSelectedWorkReveal } from "components/SelectedWorkGallery/hooks/useSelectedWorkReveal";
import { SELECTED_WORK_ITEMS } from "data/selectedWork";

export function SelectedWorkGallery() {
  const {
    selectors: { sectionRef, listRef },
  } = useSelectedWorkReveal();

  return (
    <section
      id="selected-work-gallery"
      ref={sectionRef}
      aria-labelledby="selected-work-gallery-heading"
      className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32 border-t border-border"
    >
      <div className="max-w-4xl mx-auto">
        <h2
          id="selected-work-gallery-heading"
          className="font-display font-bold text-3xl sm:text-4xl gradient-text-animated mb-4"
          data-reveal
        >
          Selected Work
        </h2>
        <p className="text-muted text-lg mb-12" data-reveal>
          Screenshots and diagrams from real work, UI components, dashboards, and automation flows.
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
