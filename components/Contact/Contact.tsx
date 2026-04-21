"use client";

import { useScrollReveal } from "utils/hooks/useScrollReveal";
import { trackGtagEvent } from "utils/analytics";
import { LINKS } from "data/links";
import { CONTACT_FORM_LEDE, CONTACT_INTRO } from "data/site";
import { ContactForm } from "components/Contact/ContactForm";
import {
  CARD_SURFACE_HOVER,
  LABEL_OVERLINE,
  SECTION_INNER,
  SECTION_LEDE,
  SECTION_SHELL,
  SECTION_TITLE,
} from "utils/visual";

const ICON_SRC = {
  Email: "/icons/email.svg",
  LinkedIn: "/icons/linkedin.svg",
  GitHub: "/icons/github.svg",
} as const;

type IconLabel = keyof typeof ICON_SRC;

function trackLinkClick(label: string) {
  trackGtagEvent("contact_link_click", { link_label: label });
}

export function Contact() {
  const {
    selectors: { sectionRef },
  } = useScrollReveal({ y: 32, stagger: 0.08 });

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className={SECTION_SHELL}
    >
      <div className={SECTION_INNER}>
        <h2 id="contact-heading" className={`${SECTION_TITLE} mb-5 sm:mb-6`} data-reveal>
          Get in touch
        </h2>
        <p className={`${SECTION_LEDE} mb-8 sm:mb-10`} data-reveal>
          {CONTACT_INTRO}
        </p>

        <div className="mb-10" data-reveal>
          <p className={`${LABEL_OVERLINE} mb-3`}>Direct</p>
          <ul className="grid sm:grid-cols-3 gap-3 sm:gap-4 list-none p-0 m-0">
            {LINKS.map((c) => {
              const isEmail = c.label === "Email";
              const iconSrc = ICON_SRC[c.label as IconLabel];
              return (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    data-analytics-event={`contact_link_${c.label.toLowerCase()}`}
                    aria-label={
                      c.href.startsWith("http")
                        ? `${c.label}: ${c.value} (opens in new tab)`
                        : `${c.label}: ${c.value}`
                    }
                    onClick={() => trackLinkClick(c.label)}
                    className={
                      isEmail
                        ? "hover-lift flex flex-col sm:flex-row sm:items-center gap-3 p-4 sm:p-5 rounded-xl bg-foreground text-background border border-transparent transition-colors hover:bg-accent-muted hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        : `hover-lift flex flex-col sm:flex-row sm:items-center gap-3 p-4 sm:p-5 ${CARD_SURFACE_HOVER} text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background`
                    }
                  >
                    <span
                      className={
                        isEmail
                          ? "inline-block size-6 bg-background shrink-0"
                          : "inline-block size-6 bg-current text-foreground shrink-0"
                      }
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
                    <span className="min-w-0 text-left">
                      <span
                        className={
                          isEmail
                            ? "block text-xs font-semibold uppercase tracking-wider text-background/80"
                            : "block text-xs font-semibold uppercase tracking-wider text-muted"
                        }
                      >
                        {c.label}
                      </span>
                      <span
                        className={`mt-0.5 block text-sm font-medium truncate ${
                          isEmail ? "text-background" : "text-foreground"
                        }`}
                      >
                        {c.value}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="pt-10 mt-10 border-t border-border" data-reveal>
          <h3
            id="contact-form-heading"
            className="font-display font-semibold tracking-tight text-xl sm:text-2xl text-foreground mb-2"
          >
            Contact form
          </h3>
          <p className="text-muted text-sm mb-8  leading-relaxed">{CONTACT_FORM_LEDE}</p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
