"use client";

import Link from "next/link";
import { useHero } from "components/Hero/hooks/useHero";
import { HERO_SCROLL_INDICATOR, HERO_SECTION_ARIA_LABEL } from "data/site";
import {
  HOMEPAGE_HERO_BODY,
  HOMEPAGE_HERO_EYEBROW,
  HOMEPAGE_HERO_NAME,
  HOMEPAGE_HERO_PRIMARY_CTA_HREF,
  HOMEPAGE_HERO_PRIMARY_CTA_LABEL,
  HOMEPAGE_HERO_SECONDARY_CTA_HREF,
  HOMEPAGE_HERO_SECONDARY_CTA_LABEL,
  HOMEPAGE_HERO_TITLE,
} from "data/homepage";
import { HeroBackground } from "components/Hero/HeroBackground";
import { CTA_PRIMARY, CTA_SECONDARY } from "utils/visual";

export const Hero = () => {
  const {
    selectors: { containerRef, line2Ref, subRef, ctaRef, scrollIndicatorRef },
  } = useHero();

  return (
    <section
      id="hero"
      ref={containerRef}
      aria-label={HERO_SECTION_ARIA_LABEL}
      className="relative min-h-screen flex flex-col justify-center px-6 sm:px-10 lg:px-20 pt-24 pb-32 overflow-hidden bg-background"
    >
      <HeroBackground />
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <p className="mb-4 sm:mb-5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          {HOMEPAGE_HERO_EYEBROW}
        </p>
        <p className="mb-3 text-base sm:text-lg font-medium text-foreground">
          <span className="sr-only">{HOMEPAGE_HERO_NAME}</span>
        </p>
        <h1
          ref={line2Ref}
          data-hero-animate
          className="max-w-4xl font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-foreground hero-lcp"
        >
          {HOMEPAGE_HERO_TITLE}
        </h1>
        <p
          ref={subRef}
          data-hero-animate="slide-up"
          className="mt-6 sm:mt-7 max-w-3xl text-muted text-[15px] sm:text-lg leading-relaxed"
        >
          {HOMEPAGE_HERO_BODY}
        </p>

        <div ref={ctaRef} className="mt-8 sm:mt-10 flex flex-col gap-4 sm:items-start">
          <div
            data-hero-animate="slide-up"
            className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center"
          >
            <Link
              href={HOMEPAGE_HERO_PRIMARY_CTA_HREF}
              className={`hover-scale ${CTA_PRIMARY} w-full sm:w-auto`}
            >
              {HOMEPAGE_HERO_PRIMARY_CTA_LABEL}
            </Link>
            <Link
              href={HOMEPAGE_HERO_SECONDARY_CTA_HREF}
              className={`hover-scale ${CTA_SECONDARY} w-full sm:w-auto`}
            >
              {HOMEPAGE_HERO_SECONDARY_CTA_LABEL}
            </Link>
          </div>
        </div>
      </div>
      <div
        ref={scrollIndicatorRef}
        data-hero-animate
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted text-sm"
        aria-hidden
      >
        {HERO_SCROLL_INDICATOR}
      </div>
    </section>
  );
};
