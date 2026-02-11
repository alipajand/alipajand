"use client";

import { useScrollReveal } from "utils/hooks/useScrollReveal";
import { LINKS } from "data/links";
import { CONTACT_INTRO } from "data/site";
import { ContactForm } from "components/Contact/ContactForm";

export function Contact() {
  const {
    selectors: { sectionRef },
  } = useScrollReveal({ y: 32, stagger: 0.1 });

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32 border-t border-border"
    >
      <div className="max-w-4xl mx-auto w-full">
        <h2
          id="contact-heading"
          className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-4"
          data-reveal
        >
          Get in touch
        </h2>
        <p className="text-muted text-lg mb-12" data-reveal>
          {CONTACT_INTRO}
        </p>

        <ContactForm />

        <div className="grid sm:grid-cols-2 gap-6 mt-28">
          {LINKS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={
                c.href.startsWith("http")
                  ? `${c.label}: ${c.value} (opens in new tab)`
                  : `${c.label}: ${c.value}`
              }
              className="hover-lift block p-5 rounded-lg bg-card transition-colors"
              data-reveal
            >
              <span className="text-muted font-medium text-sm uppercase tracking-wider">
                {c.label}
              </span>
              <p className="mt-1 text-foreground font-medium">{c.value}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
