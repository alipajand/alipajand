"use client";

import { ProofStripMetric } from "components/ProofStrip/ProofStripMetric";
import { HERO_PROOF_ROW, PROOF_STRIP_SR_HEADING } from "data/site";
import { useScrollReveal } from "utils/hooks/useScrollReveal";
import { SECTION_INNER, SECTION_X } from "utils/visual";

export function ProofStrip() {
  const {
    selectors: { sectionRef },
  } = useScrollReveal({ y: 20, stagger: 0.05 });

  return (
    <section
      id="proof-strip"
      ref={sectionRef}
      aria-labelledby="proof-strip-heading"
      className={`${SECTION_X} border-t border-border bg-background py-10 sm:py-12`}
    >
      <div className={SECTION_INNER}>
        <h2 id="proof-strip-heading" className="sr-only">
          {PROOF_STRIP_SR_HEADING}
        </h2>
        <dl className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 sm:gap-x-8">
          {HERO_PROOF_ROW.map(({ value, label }) => (
            <ProofStripMetric key={label} value={value} label={label} />
          ))}
        </dl>
      </div>
    </section>
  );
}
