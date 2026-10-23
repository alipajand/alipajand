// Concept B, "Interface Atlas": the portfolio as a survey sheet of systems.
// Each project has a reference code (tier letter + position), featured rows carry a plate drawn
// from that project's real system-layers diagram, and a highlight filter maps capabilities
// across the index without hiding anything.

import { CAPABILITIES, PROFILE, TIER_LABEL, tierProjects } from "../shared/content.mjs";
import {
  caseFooterNav,
  caseSections,
  contactList,
  documentShell,
  esc,
  projectLinks,
  protoFooter,
  sectionsHTML,
  siteNav,
  skipLink,
  txt,
  vtName,
} from "../shared/render.mjs";

export const dir = "concept-b-interface-atlas";
export const name = "Concept B · Interface Atlas";
const fonts =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+Condensed:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap";

const LETTER = { featured: "F", supporting: "S", experiment: "E" };
const refFor = (p) => {
  const list = tierProjects(p.tier);
  return `${LETTER[p.tier]}${list.indexOf(p) + 1}`;
};

function plate(p) {
  if (!p.layers) return "";
  return `<div class="plate">
    <p class="plate__k">System · ${p.layers.layers.length} layers</p>
    <ol>${p.layers.layers.map((l, i) => `<li style="--i:${i}"><span aria-hidden="true">L${i + 1}</span>${esc(l.label)}</li>`).join("")}</ol>
  </div>`;
}

function row(p, i) {
  const featured = p.tier === "featured";
  return `<article class="row row--${p.tier}" id="project-${p.slug}" tabindex="-1" data-caps="${p.capabilities.join(" ")}" style="--i:${i}">
  <p class="row__ref"><span class="sr-only">Reference </span>${refFor(p)}</p>
  <div class="row__main">
    <h4 class="row__name"><a class="row__link" href="${p.slug}.html"><span ${vtName(p.slug)}>${esc(p.name)}</span><span class="sr-only"> case study</span></a></h4>
    <p class="row__title">${esc(p.caseStudyTitle)}</p>
    ${featured ? `<p class="row__line">${esc(p.indexLine)}</p>` : `<p class="row__line row__line--short">${esc(p.indexLine)}</p>`}
  </div>
  <dl class="row__facts">
    <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
    ${p.timeframe ? `<div><dt>Years</dt><dd>${esc(p.timeframe)}</dd></div>` : ""}
  </dl>
  ${featured ? plate(p) : ""}
</article>`;
}

function tier(key) {
  const items = tierProjects(key);
  return `<section class="band band--${key}" aria-labelledby="band-${key}">
  <h3 class="band__h" id="band-${key}"><span class="band__letter" aria-hidden="true">${LETTER[key]}</span> ${TIER_LABEL[key]} <span class="band__n">${items.length}</span></h3>
  ${items.map(row).join("")}
</section>`;
}

export function indexPage() {
  const filters = CAPABILITIES.map(
    (c) =>
      `<button type="button" class="hl__btn" aria-pressed="false" data-cap="${c.id}" data-count="${c.slugs.length}">${esc(c.label)}</button>`
  ).join("");
  const body = `${skipLink()}
${siteNav()}
<main id="main" tabindex="-1">
  <div class="wrap">
    <header class="sheet">
      <div class="sheet__id">
        <h1 class="sheet__h"><span class="sheet__page">Portfolio</span> <span class="sheet__name">${esc(PROFILE.name)}</span></h1>
        <p class="sheet__role">${esc(PROFILE.role)} <span>· ${esc(PROFILE.focus)}</span></p>
        <p class="sheet__thesis">${esc(PROFILE.thesis)}</p>
      </div>
      <div class="sheet__aside">
        ${contactList("contact")}
        <p class="sheet__meta">${esc(PROFILE.location)} · ${esc(PROFILE.availability)}</p>
      </div>
    </header>
    <section class="atlas" id="case-studies" aria-labelledby="atlas-h">
      <div class="atlas__bar">
        <h2 class="atlas__h" id="atlas-h">Case studies <span class="atlas__count">7 entries · F featured · S supporting · E experiment</span></h2>
        <div class="hl" role="group" aria-labelledby="hl-label" hidden>
          <span class="hl__label" id="hl-label">Highlight</span>
          ${filters}
        </div>
        <p class="hl__status" aria-live="polite"></p>
      </div>
      <div class="atlas__cols" aria-hidden="true"><span>Ref</span><span>Project</span><span>Role · Years</span><span>System</span></div>
      ${tier("featured")}
      ${tier("supporting")}
      ${tier("experiment")}
    </section>
  </div>
</main>
${protoFooter(name)}`;
  return documentShell({
    title: "Interface Atlas Portfolio",
    description:
      "Ali Pajand portfolio, concept B: a survey-sheet index of seven case studies with system plates.",
    fonts,
    body,
  });
}

function decision(d, i) {
  return `<article class="decision">
  <h3 class="decision__title"><span class="decision__n">D${i + 1}</span> ${esc(d.decision)}</h3>
  <dl class="decision__grid">
    <div><dt>Why</dt><dd>${txt(d.why)}</dd></div>
    <div><dt>Trade-off</dt><dd>${txt(d.tradeOff)}</dd></div>
    <div><dt>Result</dt><dd>${txt(d.result)}</dd></div>
  </dl>
</article>`;
}

export function casePage(p) {
  const sections = caseSections(p, {
    decision,
    shotSizes: "(min-width: 1024px) 760px, calc(100vw - 32px)",
  });
  const diagrams = (p.caseStudy.diagrams ?? []).length;
  const body = `${skipLink()}
${siteNav()}
<main id="main" tabindex="-1">
  <div class="wrap case">
    <header class="spec">
      <div class="spec__id">
        <a class="spec__back" href="index.html#project-${p.slug}"><span aria-hidden="true">←</span> Atlas index</a>
        <p class="spec__ref"><span>${refFor(p)}</span> ${TIER_LABEL[p.tier]} case study</p>
        <h1 class="spec__h"><span ${vtName(p.slug)}>${esc(p.name)}</span></h1>
        <p class="spec__sub">${esc(p.caseStudyTitle)}</p>
        <p class="spec__lede">${esc(p.caseStudy.overview)}</p>
      </div>
      <dl class="spec__sheet">
        <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
        ${p.timeframe ? `<div><dt>Timeframe</dt><dd>${esc(p.timeframe)}</dd></div>` : ""}
        <div><dt>Stack</dt><dd>${p.capabilityTags.map(esc).join(" · ")}</dd></div>
        <div><dt>On this sheet</dt><dd>${p.caseStudy.technicalDecisions.length} decisions · ${diagrams} diagrams · ${p.figures.length} screenshots</dd></div>
        ${p.links.length ? `<div class="spec__links"><dt>Links</dt><dd>${projectLinks(p)}</dd></div>` : ""}
      </dl>
    </header>
    <nav class="tabs" aria-label="Sections in the ${esc(p.name)} case study" data-outline>
      <ol>${sections.map((s, i) => `<li><a href="#${s.id}"><span aria-hidden="true">${String(i + 1).padStart(2, "0")}</span> ${esc(s.label)}</a></li>`).join("")}</ol>
    </nav>
    <article class="case__body" aria-label="${esc(p.name)} case study">
      ${sectionsHTML(sections)}
    </article>
    ${caseFooterNav(p)}
  </div>
</main>
${protoFooter(name)}`;
  return documentShell({
    title: `${p.name} · Interface Atlas`,
    description: p.caseStudyMetaDescription,
    fonts,
    body,
  });
}
