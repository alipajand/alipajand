"use client";

import { useHero } from "components/Hero/hooks/useHero";
import { LINKS } from "data/links";
import { HERO_SUB, SITE_NAME, TAGLINE } from "data/site";

const ICON_SRC = {
  Email: "/icons/email.svg",
  LinkedIn: "/icons/linkedin.svg",
  GitHub: "/icons/github.svg",
} as const;

type IconLabel = keyof typeof ICON_SRC;

export function Hero() {
  const {
    selectors: { containerRef, nameCharsRef, line2Ref, subRef, ctaRef, scrollIndicatorRef },
  } = useHero();

  return (
    <section
      ref={containerRef}
      aria-label="Introduction"
      className="relative min-h-screen flex flex-col justify-center px-6 sm:px-10 lg:px-20 pt-24 pb-32 overflow-hidden bg-background bg-grid"
    >
      <div className="relative z-10 max-w-4xl">
        <h1 className="font-display font-bold text-5xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1]">
          <span ref={nameCharsRef} className="block text-foreground">
            {SITE_NAME.split("").map((char, i) => (
              <span
                key={`${char}-${i}`}
                className="inline-block opacity-0 translate-y-15"
                data-char
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <span
            ref={line2Ref}
            className="block text-muted opacity-0 translate-y-15 mt-2 text-xl sm:text-2xl font-normal"
          >
            {TAGLINE}
          </span>
        </h1>
        <p ref={subRef} className="mt-8 max-w-xl text-muted opacity-0 translate-y-15 tracking-wide">
          {HERO_SUB}
        </p>
        <div ref={ctaRef} className="mt-12 flex flex-wrap items-center gap-4">
          <a
            href="#contact"
            className="hover-scale inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-foreground text-background text-sm font-medium hover:bg-accent-muted hover:text-background opacity-0 translate-y-15 transition-colors"
          >
            Get in touch
          </a>
          <nav
            className="flex items-center gap-4 opacity-0 translate-y-15"
            aria-label="Contact links"
          >
            {LINKS.map(({ label, href }) => {
              const iconSrc = ICON_SRC[label as IconLabel];
              return (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-muted hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded h-5"
                  aria-label={label}
                >
                  <span
                    className="inline-block size-5 bg-current shrink-0"
                    style={{
                      maskImage: iconSrc ? `url(${iconSrc})` : undefined,
                      maskSize: "contain",
                      maskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskImage: iconSrc ? `url(${iconSrc})` : undefined,
                      WebkitMaskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                    }}
                    aria-hidden
                  />
                </a>
              );
            })}
          </nav>
        </div>
      </div>
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted text-sm"
        aria-hidden
      >
        ↓
      </div>
    </section>
  );
}
