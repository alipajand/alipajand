"use client";

import { EDUCATION_CREDENTIAL_LINE } from "data/education";
import { SECTION_INNER, SECTION_SHELL_BRIDGE } from "utils/visual";

export function Education() {
  return (
    <section className={SECTION_SHELL_BRIDGE}>
      <div className={SECTION_INNER}>
        <p className="text-muted text-sm leading-relaxed">{EDUCATION_CREDENTIAL_LINE}</p>
      </div>
    </section>
  );
}
