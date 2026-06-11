"use client";

import { useHero } from "components/Hero/hooks/useHero";
import { HeroContactNavLink } from "components/Hero/HeroContactNavLink";
import { HeroDisplayChar } from "components/Hero/HeroDisplayChar";
import { LINKS } from "data/links";
import {
  HERO_CONTACT_NAV_ARIA_LABEL,
  HERO_CTA_DISCUSS_ROLE,
  HERO_CTA_DOWNLOAD_RESUME,
  HERO_CTA_VIEW_CASE_STUDIES,
  HERO_EYEBROW,
  HERO_SCROLL_INDICATOR,
  HERO_SECTION_ARIA_LABEL,
  HERO_SUB,
  HERO_VALUE_LINE,
  RESUME_URL,
  SITE_NAME,
} from "data/site";
import { HeroBackground } from "components/Hero/HeroBackground";
import { CTA_PRIMARY, CTA_SECONDARY, CTA_TERTIARY } from "utils/visual";

export function Hero() {
  const {
    selectors: { containerRef, nameCharsRef, line2Ref, subRef, ctaRef, scrollIndicatorRef },
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
          {HERO_EYEBROW}
        </p>
        <h1 className="font-display font-bold text-5xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
          <span ref={nameCharsRef} className="block text-foreground hero-lcp">
            {SITE_NAME.split("").map((char, i) => (
              <HeroDisplayChar key={`${char}-${i}`} char={char} />
            ))}
          </span>
          <span
            ref={line2Ref}
            className="block mt-3 sm:mt-4 max-w-3xl text-lg sm:text-xl md:text-2xl font-normal text-white/85 leading-snug hero-lcp opacity-0"
          >
            {HERO_VALUE_LINE}
          </span>
        </h1>
        <p
          ref={subRef}
          className="mt-6 sm:mt-7  text-muted text-[15px] sm:text-base leading-relaxed opacity-0 translate-y-15"
        >
          {HERO_SUB}
        </p>

        <div
          ref={ctaRef}
          className="mt-8 sm:mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-3"
        >
          <a
            href="/portfolio#projects"
            className={`hover-scale ${CTA_PRIMARY} w-full sm:w-auto opacity-0 translate-y-15`}
          >
            {HERO_CTA_VIEW_CASE_STUDIES}
          </a>
          <a
            href="#contact"
            className={`hover-scale ${CTA_SECONDARY} w-full sm:w-auto opacity-0 translate-y-15`}
          >
            {HERO_CTA_DISCUSS_ROLE}
          </a>
          {RESUME_URL ? (
            <a
              href={RESUME_URL}
              className={`hover-scale ${CTA_TERTIARY} w-full sm:w-auto opacity-0 translate-y-15 sm:ml-1`}
              download
            >
              {HERO_CTA_DOWNLOAD_RESUME}
            </a>
          ) : null}
          <nav
            className="flex items-center justify-center sm:justify-start gap-4 pt-1 sm:pt-0 sm:ml-auto opacity-0 translate-y-15"
            aria-label={HERO_CONTACT_NAV_ARIA_LABEL}
          >
            {LINKS.map(({ label, href }) => (
              <HeroContactNavLink key={label} label={label} href={href} />
            ))}
          </nav>
        </div>
      </div>
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted text-sm opacity-0"
        aria-hidden
      >
        {HERO_SCROLL_INDICATOR}
      </div>
    </section>
  );
}
