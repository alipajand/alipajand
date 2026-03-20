"use client";

import { useHero } from "components/Hero/hooks/useHero";
import { LINKS } from "data/links";
import {
  HERO_SUB,
  HERO_VALUE_LINE,
  LOCATION,
  RESUME_URL,
  SITE_NAME,
} from "data/site";
import { HeroBackground } from "components/Hero/HeroBackground";
import { ContactLink } from "components/Hero/ContactLink";
import { CTA_PRIMARY, CTA_SECONDARY, CTA_TERTIARY } from "utils/visual";

const ICON_SRC = {
  Email: "/icons/email.svg",
  LinkedIn: "/icons/linkedin.svg",
  GitHub: "/icons/github.svg",
} as const;

type IconLabel = keyof typeof ICON_SRC;

export function Hero() {
  const {
    selectors: {
      containerRef,
      nameCharsRef,
      line2Ref,
      subRef,
      ctaRef,
      locationRef,
      scrollIndicatorRef,
    },
  } = useHero();

  return (
    <section
      ref={containerRef}
      aria-label="Introduction"
      className="relative min-h-screen flex flex-col justify-center px-6 sm:px-10 lg:px-20 pt-24 pb-32 overflow-hidden bg-background"
    >
      <HeroBackground />
      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <h1 className="font-display font-bold text-5xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1]">
          <span ref={nameCharsRef} className="block text-foreground hero-lcp">
            {SITE_NAME.split("").map((char, i) => (
              <span key={`${char}-${i}`} className="inline-block hero-char" data-char>
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <span
            ref={line2Ref}
            className="block mt-3 sm:mt-4 max-w-3xl text-lg sm:text-xl md:text-2xl font-normal text-white/85 leading-snug hero-lcp"
          >
            {HERO_VALUE_LINE}
          </span>
        </h1>
        <p
          ref={subRef}
          className="mt-6 sm:mt-7 max-w-2xl text-muted text-[15px] sm:text-base leading-relaxed opacity-0 translate-y-15"
        >
          {HERO_SUB}
        </p>

        <div
          ref={ctaRef}
          className="mt-8 sm:mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-3"
        >
          <a
            href="#contact"
            className={`hover-scale ${CTA_PRIMARY} w-full sm:w-auto opacity-0 translate-y-15`}
          >
            Discuss a role
          </a>
          <a
            href="/portfolio#projects"
            className={`hover-scale ${CTA_SECONDARY} w-full sm:w-auto opacity-0 translate-y-15`}
          >
            View case studies
          </a>
          <a
            href="#writing"
            className={`hover-scale ${CTA_SECONDARY} w-full sm:w-auto opacity-0 translate-y-15`}
          >
            Read writing
          </a>
          {RESUME_URL ? (
            <a
              href={RESUME_URL}
              className={`hover-scale ${CTA_TERTIARY} w-full sm:w-auto opacity-0 translate-y-15 sm:ml-1`}
              download
            >
              Download resume
            </a>
          ) : null}
          <nav
            className="flex items-center justify-center sm:justify-start gap-4 pt-1 sm:pt-0 sm:ml-auto opacity-0 translate-y-15"
            aria-label="Contact links"
          >
            {LINKS.map(({ label, href }) => (
              <ContactLink
                key={label}
                label={label}
                href={href}
                iconSrc={ICON_SRC[label as IconLabel]}
              />
            ))}
          </nav>
        </div>
        <p ref={locationRef} className="mt-6 flex items-center gap-2 text-muted text-sm opacity-0">
          <span
            className="shrink-0 size-4 bg-current"
            style={{
              maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3C/svg%3E")`,
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3C/svg%3E")`,
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
            }}
            aria-hidden
          />
          {LOCATION}
        </p>
      </div>
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted text-sm opacity-0"
        aria-hidden
      >
        ↓
      </div>
    </section>
  );
}
