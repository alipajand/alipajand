"use client";

import Link from "next/link";

import { SelectedWorkCard } from "components/SelectedWork/SelectedWorkCard";
import {
  SELECTED_WORK,
  SELECTED_WORK_HEADING,
  SELECTED_WORK_LEDE,
  SELECTED_WORK_SECTION_CTA_HREF,
  SELECTED_WORK_SECTION_CTA_LABEL,
} from "data/selectedWork";
import { useScrollReveal } from "utils/hooks/useScrollReveal";
import {
  CTA_SECONDARY,
  SECTION_INNER,
  SECTION_LEDE_LG,
  SECTION_SHELL,
  SECTION_TITLE,
} from "utils/visual";

export function SelectedWork() {
  const {
    selectors: { sectionRef },
  } = useScrollReveal({ y: 32, stagger: 0.08 });

  return (
    <section
      id="selected-work"
      ref={sectionRef}
      aria-labelledby="selected-work-heading"
      className={SECTION_SHELL}
    >
      <div className={SECTION_INNER}>
        <header className="mb-10 sm:mb-12" data-reveal>
          <h2 id="selected-work-heading" className={`${SECTION_TITLE} mb-4 sm:mb-5`}>
            {SELECTED_WORK_HEADING}
          </h2>
          <p className={SECTION_LEDE_LG}>{SELECTED_WORK_LEDE}</p>
        </header>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 list-none p-0 m-0">
          {SELECTED_WORK.map((item) => (
            <li key={item.projectId} data-reveal className="h-full">
              <SelectedWorkCard item={item} />
            </li>
          ))}
        </ul>

        <div className="mt-10 sm:mt-12" data-reveal>
          <Link
            href={SELECTED_WORK_SECTION_CTA_HREF}
            className={`${CTA_SECONDARY} w-full sm:w-auto`}
          >
            {SELECTED_WORK_SECTION_CTA_LABEL}
          </Link>
        </div>
      </div>
    </section>
  );
}
