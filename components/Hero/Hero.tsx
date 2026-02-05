"use client";

import { useHero } from "components/Hero/hooks/useHero";
import { LINKS } from "data/links";

const HERO_NAME = "Ali Pajand";

const ICON_SRC: Record<(typeof LINKS)[number]["label"], string> = {
  Email: "/icons/email.svg",
  LinkedIn: "/icons/linkedin.svg",
  GitHub: "/icons/github.svg",
};

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
        <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1]">
          <span ref={nameCharsRef} className="block text-foreground">
            {HERO_NAME.split("").map((char, i) => (
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
            Senior Product Engineer | Design-Systems Architect
          </span>
        </h1>
        <p
          ref={subRef}
          className="mt-8 max-w-xl text-muted leading-relaxed opacity-0 translate-y-15"
        >
          React, TypeScript, Next.js & Node.js. Design systems, GSAP animations, and
          high-performance interfaces. Building the web that feels right.
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
            {LINKS.map(({ label, href }) => (
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
                    maskImage: `url(${ICON_SRC[label]})`,
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskImage: `url(${ICON_SRC[label]})`,
                    WebkitMaskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                  }}
                  aria-hidden
                />
              </a>
            ))}
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
