export interface CaseStudyDisplay {
  words: readonly [string, string];
  fit: number;
}

export const CASE_STUDY_DISPLAY: Readonly<Record<string, CaseStudyDisplay>> = {
  ledgerguard: { words: ["Ledger", "Guard"], fit: 0.0912 },
  alwaysgeeky: { words: ["AlwaysGeeky", "Games"], fit: 0.0643 },
  emplifi: { words: ["Emplifi", "Case study"], fit: 0.0694 },
  "agent-tooling": { words: ["Agent", "Engineering Tools"], fit: 0.0511 },
  tallyfolio: { words: ["Tally", "Folio"], fit: 0.1159 },
  controltech: { words: ["Control", "Tech"], fit: 0.0911 },
  mapbylaw: { words: ["Map", "Bylaw"], fit: 0.1191 },
};

export const caseStudyDisplayFor = (slug: string, name: string): CaseStudyDisplay => {
  const known = CASE_STUDY_DISPLAY[slug];
  if (known) return known;
  const space = name.indexOf(" ");
  if (space > 0) return { words: [name.slice(0, space), name.slice(space + 1)], fit: 0.06 };
  const camel = name.match(/^([A-Z][a-z]+)([A-Z].*)$/);
  return { words: camel ? [camel[1], camel[2]] : [name, "Case study"], fit: 0.06 };
};
