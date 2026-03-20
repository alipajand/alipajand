"use client";

import { useScrollReveal } from "utils/hooks/useScrollReveal";
import { trackGtagEvent } from "utils/analytics";
import { LINKS } from "data/links";
import { HIRING_SUMMARY_HEADING, HIRING_SUMMARY_LEDE, HIRING_SUMMARY_ROWS } from "data/hiringSummary";
import { RESUME_URL } from "data/site";
import {
  CARD_SURFACE,
  SECTION_INNER,
  SECTION_LEDE,
  SECTION_SHELL_BRIDGE,
  SECTION_TITLE_COMPACT,
  SURFACE_BAND,
} from "utils/visual";

function trackQuickLink(label: string) {
  trackGtagEvent("hiring_summary_link_click", { link_label: label });
}

export function HiringSummary() {
  const {
    selectors: { sectionRef },
  } = useScrollReveal({ y: 28, stagger: 0.06 });

  return (
    <section
      id="hiring-summary"
      ref={sectionRef}
      aria-labelledby="hiring-summary-heading"
      className={`${SECTION_SHELL_BRIDGE} ${SURFACE_BAND}`}
    >
      <div className={SECTION_INNER}>
        <h2
          id="hiring-summary-heading"
          className={`${SECTION_TITLE_COMPACT} mb-3 sm:mb-4`}
          data-reveal
        >
          {HIRING_SUMMARY_HEADING}
        </h2>
        <p className={`${SECTION_LEDE} mb-6`} data-reveal>
          {HIRING_SUMMARY_LEDE}
        </p>

        <div
          className={`${CARD_SURFACE} bg-background/60 p-4 sm:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]`}
          data-reveal
        >
          <dl className="divide-y divide-border/80 sm:divide-y-0 sm:space-y-4">
            {HIRING_SUMMARY_ROWS.map((row) => (
              <div
                key={row.id}
                className="sm:grid sm:grid-cols-[minmax(0,9.5rem)_1fr] sm:gap-x-6 py-4 first:pt-0 last:pb-0"
              >
                <dt className="font-semibold text-foreground leading-snug mb-1.5 sm:mb-0">{row.label}</dt>
                <dd className="text-muted leading-relaxed m-0">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <nav
          className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-2 text-sm"
          aria-label="Hiring snapshot links"
          data-reveal
        >
          <span className="text-muted font-medium">Quick links</span>
          <a
            href="#contact"
            className="font-medium text-foreground underline-offset-4 hover:underline"
            data-analytics-event="hiring_summary_contact"
            onClick={() => trackQuickLink("Contact")}
          >
            Contact
          </a>
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="font-medium text-foreground underline-offset-4 hover:underline"
              data-analytics-event={`hiring_summary_${l.label.toLowerCase()}`}
              onClick={() => trackQuickLink(l.label)}
            >
              {l.label}
            </a>
          ))}
          {RESUME_URL ? (
            <a
              href={RESUME_URL}
              className="font-medium text-foreground underline-offset-4 hover:underline"
              download
              data-analytics-event="hiring_summary_resume"
              onClick={() => trackQuickLink("Resume")}
            >
              Résumé
            </a>
          ) : null}
        </nav>
      </div>
    </section>
  );
}
