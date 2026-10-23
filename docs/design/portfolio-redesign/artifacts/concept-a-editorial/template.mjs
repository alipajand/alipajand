// Concept A, "Engineering Editorial": the portfolio set like an engineering journal.
// Serif project names, a masthead column, and decisions treated as editor's notes in the margin.

import { PROFILE, TIER_LABEL, tierProjects } from "../shared/content.mjs";
import {
  caseFooterNav,
  caseSections,
  contactList,
  documentShell,
  esc,
  outline,
  projectLinks,
  protoFooter,
  sectionsHTML,
  siteNav,
  txt,
  skipLink,
  vtName,
} from "../shared/render.mjs";

export const dir = "concept-a-editorial";
export const name = "Concept A · Engineering Editorial";
const fonts =
  "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap";

const TIER_NOTE = {
  featured: "The three case studies with the most evidence behind them.",
  supporting: "Independent tooling, a second product, and four years of studio delivery.",
  experiment: "An independent product experiment, scoped as one.",
};

function featured(p, i) {
  return `<li class="entry" id="project-${p.slug}" tabindex="-1" style="--i:${i}">
  <div class="entry__meta">
    <span class="entry__years">${esc(p.timeframe ?? "")}</span>
    <span class="entry__role">${esc(p.role)}</span>
  </div>
  <div class="entry__main">
    <h4 class="entry__name"><a class="entry__link" href="${p.slug}.html"><span ${vtName(p.slug)}>${esc(p.name)}</span><span class="sr-only"> case study</span></a></h4>
    <p class="entry__title">${esc(p.caseStudyTitle)}</p>
    <p class="entry__line">${esc(p.indexLine)}</p>
  </div>
  <div class="entry__note">
    <p class="entry__notek">Key decision</p>
    <p>${esc(p.keyDecision.decision)}</p>
  </div>
</li>`;
}

function compact(p, i) {
  return `<li class="brief" id="project-${p.slug}" tabindex="-1" style="--i:${i}">
  <p class="brief__meta"><span>${esc(p.timeframe ?? p.role)}</span>${p.timeframe ? ` <span>${esc(p.role)}</span>` : ""}</p>
  <h4 class="brief__name"><a class="entry__link" href="${p.slug}.html"><span ${vtName(p.slug)}>${esc(p.name)}</span><span class="sr-only"> case study</span></a></h4>
  <p class="brief__line">${esc(p.indexLine)}</p>
</li>`;
}

function tier(key, render) {
  const items = tierProjects(key);
  return `<section class="tier tier--${key}" aria-labelledby="tier-${key}">
  <header class="tier__head">
    <h3 class="tier__h" id="tier-${key}">${TIER_LABEL[key]}</h3>
    <p class="tier__note">${TIER_NOTE[key]}</p>
  </header>
  <ol class="tier__list" role="list">${items.map(render).join("")}</ol>
</section>`;
}

export function indexPage() {
  const body = `${skipLink()}
${siteNav()}
<main id="main" tabindex="-1">
  <div class="wrap index">
    <header class="mast">
      <h1 class="mast__h"><span class="mast__name">${esc(PROFILE.name)}</span> <span class="mast__page">Portfolio</span></h1>
      <p class="mast__role">${esc(PROFILE.role)}</p>
      <p class="mast__focus">${esc(PROFILE.focus)}<span class="mast__stack"> · ${esc(PROFILE.stack)}</span></p>
      <p class="mast__thesis">${esc(PROFILE.thesis)}</p>
      ${contactList("contact")}
      <p class="mast__meta">${esc(PROFILE.location)} · ${esc(PROFILE.availability)}. ${esc(PROFILE.languages)}</p>
    </header>
    <section class="work" id="case-studies" aria-labelledby="work-h">
      <h2 class="work__h" id="work-h">Case studies <span class="work__count">7</span></h2>
      ${tier("featured", featured)}
      ${tier("supporting", compact)}
      ${tier("experiment", compact)}
    </section>
  </div>
</main>
${protoFooter(name)}`;
  return documentShell({
    title: "Engineering Editorial Portfolio",
    description:
      "Ali Pajand portfolio, concept A: an engineering-journal index of seven case studies.",
    fonts,
    body,
  });
}

function decision(d, i) {
  return `<article class="decision">
  <p class="decision__n">Decision ${i + 1}</p>
  <h3 class="decision__title">${esc(d.decision)}</h3>
  <dl class="decision__dl">
    <div><dt>Why</dt><dd>${txt(d.why)}</dd></div>
    <div><dt>Trade-off</dt><dd>${txt(d.tradeOff)}</dd></div>
    <div><dt>Result</dt><dd>${txt(d.result)}</dd></div>
  </dl>
</article>`;
}

export function casePage(p) {
  const sections = caseSections(p, {
    decision,
    shotSizes: "(min-width: 1024px) 704px, calc(100vw - 32px)",
  });
  const body = `${skipLink()}
${siteNav()}
<main id="main" tabindex="-1">
  <div class="wrap case">
    <header class="case__head">
      <a class="case__back" href="index.html#project-${p.slug}"><span aria-hidden="true">←</span> All case studies</a>
      <p class="case__kicker">${TIER_LABEL[p.tier]} case study${p.timeframe ? ` · ${esc(p.timeframe)}` : ""}</p>
      <h1 class="case__title"><span ${vtName(p.slug)}>${esc(p.name)}</span></h1>
      <p class="case__sub">${esc(p.caseStudyTitle)}</p>
      <p class="case__lede">${esc(p.caseStudy.overview)}</p>
      <dl class="facts">
        <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
        ${p.timeframe ? `<div><dt>Timeframe</dt><dd>${esc(p.timeframe)}</dd></div>` : ""}
        <div><dt>Stack and focus</dt><dd>${p.capabilityTags.map(esc).join(", ")}</dd></div>
      </dl>
      ${projectLinks(p)}
    </header>
    ${outline(p, sections)}
    <article class="case__body" aria-label="${esc(p.name)} case study">
      ${sectionsHTML(sections)}
    </article>
    ${caseFooterNav(p)}
  </div>
</main>
${protoFooter(name)}`;
  return documentShell({
    title: `${p.name} · Engineering Editorial`,
    description: p.caseStudyMetaDescription,
    fonts,
    body,
  });
}
