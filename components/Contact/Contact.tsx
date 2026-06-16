"use client";

import { useScrollReveal } from "utils/hooks/useScrollReveal";
import { LINKS } from "data/links";
import {
  CONTACT_DIRECT_LABEL,
  CONTACT_FORM_SECTION_HEADING,
  CONTACT_SECTION_BODY,
  CONTACT_SECTION_HEADING,
} from "data/contact";
import { CONTACT_FORM_LEDE } from "data/site";
import { ContactChannelCard } from "components/Contact/ContactChannelCard";
import { ContactForm } from "components/Contact/ContactForm";
import {
  LABEL_OVERLINE,
  SECTION_INNER,
  SECTION_LEDE,
  SECTION_SHELL,
  SECTION_TITLE,
} from "utils/visual";

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
          {CONTACT_SECTION_HEADING}
        </h2>
        <p className={`${SECTION_LEDE} mb-8 sm:mb-10`} data-reveal>
          {CONTACT_SECTION_BODY}
        </p>

        <div className="mb-10" data-reveal>
          <p className={`${LABEL_OVERLINE} mb-3`}>{CONTACT_DIRECT_LABEL}</p>
          <ul className="grid sm:grid-cols-3 gap-3 sm:gap-4 list-none p-0 m-0">
            {LINKS.map((c) => (
              <ContactChannelCard key={c.label} channel={c} />
            ))}
          </ul>
        </div>

        <div className="pt-10 mt-10 border-t border-border" data-reveal>
          <h3
            id="contact-form-heading"
            className="font-display font-semibold tracking-tight text-xl sm:text-2xl text-foreground mb-2"
          >
            {CONTACT_FORM_SECTION_HEADING}
          </h3>
          <p className="text-muted text-sm mb-8  leading-relaxed">{CONTACT_FORM_LEDE}</p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
