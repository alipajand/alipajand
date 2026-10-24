// Concept C, "Systems in Motion": each featured project is introduced by its own flow, the real
// step sequence from its case study, drawn as a trace that a signal runs along on hover or focus.
// Case studies keep that flow beside the reading column as a step-through walkthrough.

import { PROFILE, TIER_LABEL, tierProjects } from "../shared/content.mjs";
import {
  caseFooterNav,
  caseSections,
  contactList,
  diagram,
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

export const dir = "concept-c-systems-in-motion";
export const name = "Concept C · Systems in Motion";
const fonts =
  "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&family=JetBrains+Mono:wght@400;500&display=swap";

function trace(p) {
  const steps = p.flow.steps;
  return `<div class="trace" style="--n:${steps.length}">
    <p class="trace__k">${esc(p.flow.title)}</p>
    <ol class="trace__steps">${steps
      .map(
        (s, i) =>
          `<li style="--i:${i}"><span class="trace__dot" aria-hidden="true"></span>${esc(s.label)}</li>`
      )
      .join("")}</ol>
  </div>`;
}

function card(p, i) {
  return `<li class="sys" id="project-${p.slug}" tabindex="-1" style="--i:${i}">
  <p class="sys__meta"><span>${esc(p.timeframe ?? "")}</span> <span>${esc(p.role)}</span></p>
  <h4 class="sys__name"><a class="sys__link" href="${p.slug}.html"><span ${vtName(p.slug)}>${esc(p.name)}</span><span class="sr-only"> case study</span></a></h4>
  <p class="sys__title">${esc(p.caseStudyTitle)}</p>
  <p class="sys__line">${esc(p.indexLine)}</p>
  ${trace(p)}
</li>`;
}

function line(p, i) {
  return `<li class="line" id="project-${p.slug}" tabindex="-1" style="--i:${i}">
  <h4 class="line__name"><a class="sys__link" href="${p.slug}.html"><span ${vtName(p.slug)}>${esc(p.name)}</span><span class="sr-only"> case study</span></a></h4>
  <p class="line__meta">${esc(p.role)}${p.timeframe ? ` · ${esc(p.timeframe)}` : ""}</p>
  <p class="line__text">${esc(p.indexLine)}</p>
  <p class="line__steps" aria-label="${p.flow.steps.length}-step flow">${p.flow.steps.map((s) => esc(s.label)).join('<span aria-hidden="true"> → </span>')}</p>
</li>`;
}

export function indexPage() {
  const body = `${skipLink()}
${siteNav()}
<main id="main" tabindex="-1">
  <div class="wrap">
    <header class="intro">
      <div class="intro__id">
        <h1 class="intro__h"><span class="intro__page">Portfolio</span> <span class="intro__name">${esc(PROFILE.name)}</span></h1>
        <p class="intro__role">${esc(PROFILE.role)} · ${esc(PROFILE.focus)}</p>
        <p class="intro__thesis">${esc(PROFILE.thesis)}</p>
      </div>
      <div class="intro__aside">
        ${contactList("contact")}
        <p class="intro__meta">${esc(PROFILE.location)} · ${esc(PROFILE.availability)}</p>
        <button type="button" class="motion-toggle" data-motion-toggle aria-pressed="true"><span class="motion-toggle__dot" aria-hidden="true"></span><span data-motion-label>Motion on</span></button>
      </div>
    </header>
    <section class="work" id="case-studies" aria-labelledby="work-h">
      <h2 class="sr-only" id="work-h">Case studies</h2>
      <section aria-labelledby="t-featured">
        <h3 class="tier-h" id="t-featured">${TIER_LABEL.featured} <span>3 systems, each shown as the flow its case study explains</span></h3>
        <ol class="systems" role="list">${tierProjects("featured").map(card).join("")}</ol>
      </section>
      <div class="lower">
        <section aria-labelledby="t-supporting">
          <h3 class="tier-h" id="t-supporting">${TIER_LABEL.supporting}</h3>
          <ol class="lines" role="list">${tierProjects("supporting").map(line).join("")}</ol>
        </section>
        <section aria-labelledby="t-experiment">
          <h3 class="tier-h" id="t-experiment">${TIER_LABEL.experiment}</h3>
          <ol class="lines" role="list">${tierProjects("experiment").map(line).join("")}</ol>
        </section>
      </div>
    </section>
  </div>
</main>
${protoFooter(name)}`;
  return documentShell({
    title: "Systems in Motion Portfolio",
    description:
      "Ali Pajand portfolio, concept C: featured projects introduced by their own system flows.",
    fonts,
    body,
  });
}

function decision(d, i) {
  return `<article class="decision">
  <h3 class="decision__title"><span class="decision__n">Decision ${i + 1}</span> ${esc(d.decision)}</h3>
  <ol class="decision__chain">
    <li><span class="decision__k">Why</span> ${txt(d.why)}</li>
    <li><span class="decision__k">Trade-off</span> ${txt(d.tradeOff)}</li>
    <li><span class="decision__k">Result</span> ${txt(d.result)}</li>
  </ol>
</article>`;
}

export function casePage(p) {
  const sections = caseSections(p, {
    decision,
    skipDiagram: (spec) => spec === p.flow,
    shotSizes: "(min-width: 1200px) 672px, calc(100vw - 32px)",
  });
  const flowSection = (p.caseStudy.diagrams ?? []).find((d) => d.spec === p.flow)?.section;
  const body = `${skipLink()}
${siteNav()}
<main id="main" tabindex="-1">
  <div class="wrap case">
    <header class="case__head">
      <a class="case__back" href="index.html#project-${p.slug}"><span aria-hidden="true">←</span> All case studies</a>
      <p class="case__kicker">${TIER_LABEL[p.tier]}${p.timeframe ? ` · ${esc(p.timeframe)}` : ""} · ${esc(p.role)}</p>
      <h1 class="case__title"><span ${vtName(p.slug)}>${esc(p.name)}</span></h1>
      <p class="case__sub">${esc(p.caseStudyTitle)}</p>
      <p class="case__lede">${esc(p.caseStudy.overview)}</p>
      <p class="case__stack">${p.capabilityTags.map((t) => `<span>${esc(t)}</span>`).join("")}</p>
      ${projectLinks(p)}
      <button type="button" class="motion-toggle" data-motion-toggle aria-pressed="true"><span class="motion-toggle__dot" aria-hidden="true"></span><span data-motion-label>Motion on</span></button>
    </header>
    <aside class="rail" aria-label="${esc(p.name)} system flow">
      ${diagram(p.flow).replace("data-flow", 'data-flow data-tempo="1800"')}
      <p class="rail__note">From the ${esc(flowSection === "technical-decisions" ? "Technical decisions" : flowSection === "built" ? "What I built" : "case study")} section. Step through it with the buttons, or read the steps as a list.</p>
    </aside>
    <nav class="chips" aria-label="Sections in the ${esc(p.name)} case study" data-outline>
      <ol>${sections.map((s) => `<li><a href="#${s.id}">${esc(s.label)}</a></li>`).join("")}</ol>
    </nav>
    <article class="case__body" aria-label="${esc(p.name)} case study">
      ${sectionsHTML(sections)}
    </article>
    ${caseFooterNav(p)}
  </div>
</main>
${protoFooter(name)}`;
  return documentShell({
    title: `${p.name} · Systems in Motion`,
    description: p.caseStudyMetaDescription,
    fonts,
    body,
  });
}
