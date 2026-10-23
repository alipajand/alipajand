// Markup shared by the three concepts. Each concept styles these classes in its own styles.css
// and composes its own index page; case-study sections and diagrams share one semantic structure
// so the concepts can be compared on design rather than on content.

import { PENDING_PATTERN, PROFILE, nextProject } from "./content.mjs";

export const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Text that carries an unsourced figure is kept, de-emphasised, and flagged for review.
export const txt = (s) =>
  PENDING_PATTERN.test(s)
    ? `<span class="pending">${esc(s)}</span> <span class="proto-flag">Source pending</span>`
    : esc(s);

export const SHARED = "{{SHARED}}";

const MOTION_BOOT = `<script>(function(){var r=document.documentElement,s=null;try{s=localStorage.getItem("p1-motion")}catch(e){}r.dataset.motion=s||(matchMedia("(prefers-reduced-motion: reduce)").matches?"reduce":"full");r.classList.add("js");var n=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];if((n&&n.type==="back_forward")||location.hash)r.classList.add("returning")})();</script>`;

export function documentShell({ title, description, fonts, body, bodyClass = "" }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${esc(description)}">
<meta name="color-scheme" content="dark">
${MOTION_BOOT}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fonts}">
<link rel="stylesheet" href="styles.css">
</head>
<body class="${bodyClass}">
${body}
<script src="${SHARED}behaviour.js" defer></script>
<script src="concept.js" defer></script>
</body>
</html>
`;
}

export function skipLink() {
  return `<a class="skip" href="#main">Skip to content</a>`;
}

// Navigation: full list on wide screens, a native <details> disclosure on narrow ones.
export function siteNav({ brandSuffix = "" } = {}) {
  const items = PROFILE.nav
    .map(
      (n) =>
        `<li><a href="${n.href}"${n.current ? ' aria-current="page"' : ""}>${esc(n.label)}</a></li>`
    )
    .join("");
  return `<header class="site">
  <div class="site__inner">
    <a class="site__brand" href="index.html">${esc(PROFILE.name)}${brandSuffix}</a>
    <nav class="site__nav" aria-label="Primary"><ul>${items}</ul></nav>
    <details class="site__menu">
      <summary>Menu</summary>
      <nav aria-label="Primary (compact)"><ul>${items}</ul></nav>
    </details>
  </div>
</header>`;
}

export function contactList(cls = "contact") {
  return `<ul class="${cls}" aria-label="Profiles and booking">${PROFILE.contact
    .map(
      (c) =>
        `<li><a href="${c.href}" target="_blank" rel="noopener"><span class="${cls}__label">${esc(
          c.label
        )}</span> <span class="${cls}__host">${esc(c.host)}</span><span class="sr-only"> (opens in new tab)</span></a></li>`
    )
    .join("")}</ul>`;
}

export function protoFooter(conceptName) {
  return `<footer class="proto">
  <p><strong>${esc(conceptName)}</strong> is a P1 design prototype for alipajand.com/portfolio. Project text is generated from <code>data/projects.ts</code>; screenshots are the real ones in <code>public/portfolio-media</code>, resized. Items marked “Source pending” carry figures whose provenance is not yet established.</p>
</footer>`;
}

/* ---------- diagrams ---------- */

let dgCount = 0;

export function diagram(spec, { figNo } = {}) {
  dgCount += 1;
  const id = `dg-${dgCount}`;
  const kind = { layers: "System layers", compare: "Comparison", flow: "Flow" }[spec.type];
  const head = `<figcaption class="dg__head">
    <span class="dg__kind">${figNo ? `Fig. ${figNo} · ` : ""}${kind}</span>
    <strong class="dg__title" id="${id}-t">${esc(spec.title)}</strong>
  </figcaption>`;
  const caption = `<p class="dg__caption">${txt(spec.caption)}</p>`;
  if (spec.type === "layers") {
    return `<figure class="dg dg--layers" aria-labelledby="${id}-t">${head}
  <ol class="dg__layers">${spec.layers
    .map(
      (l, i) =>
        `<li class="dg__layer" style="--i:${i}"><span class="dg__label">${esc(l.label)}</span><span class="dg__detail">${txt(l.detail)}</span></li>`
    )
    .join("")}</ol>${caption}</figure>`;
  }
  if (spec.type === "compare") {
    return `<figure class="dg dg--compare" aria-labelledby="${id}-t">${head}
  <div class="dg__cols">${spec.columns
    .map(
      (c, i) =>
        `<div class="dg__col dg__col--${i === spec.columns.length - 1 ? "chosen" : "rejected"}"><p class="dg__collabel">${
          i === spec.columns.length - 1 ? `<span class="dg__taken">Approach taken</span> ` : ""
        }${esc(c.label)}</p><ul>${c.items.map((it) => `<li>${txt(it)}</li>`).join("")}</ul></div>`
    )
    .join("")}</div>${caption}</figure>`;
  }
  return `<figure class="dg dg--flow" data-flow aria-labelledby="${id}-t">${head}
  <ol class="dg__steps">${spec.steps
    .map(
      (s, i) =>
        `<li class="dg__step" data-step="${i}" style="--i:${i}"><span class="dg__n" aria-hidden="true">${i + 1}</span><span class="dg__label">${esc(s.label)}</span><span class="dg__detail">${txt(s.detail)}</span></li>`
    )
    .join(
      ""
    )}</ol>${spec.loop ? `<p class="dg__loop"><span>Loop</span> ${esc(spec.loop)}</p>` : ""}${caption}</figure>`;
}

export const resetDiagramIds = () => {
  dgCount = 0;
};

/* ---------- links and figures ---------- */

export function projectLinks(p, cls = "plinks") {
  if (!p.links.length && !p.related.length) return "";
  const live = p.links
    .map((l) =>
      l.status === "closed"
        ? `<li class="${cls}__item ${cls}__item--closed"><span class="${cls}__label">${esc(l.label)}</span> <span class="${cls}__status">${esc(l.note)}</span></li>`
        : `<li class="${cls}__item"><a href="${l.href}" target="_blank" rel="noopener"><span class="${cls}__label">${esc(l.label)}</span> <span class="${cls}__host">${esc(l.host)}</span><span class="sr-only"> (opens in new tab)</span></a></li>`
    )
    .join("");
  return live ? `<ul class="${cls}" aria-label="${esc(p.name)} links">${live}</ul>` : "";
}

export function shot(f, sizes) {
  const m = `${SHARED}media/${f.key}`;
  const h = Math.round(1280 * f.ratio);
  return `<figure class="shot">
  <img src="${m}-640.webp" srcset="${m}-640.webp 640w, ${m}-1280.webp 1280w" sizes="${sizes}" width="1280" height="${h}" loading="lazy" decoding="async" alt="${esc(f.alt)}">
  <figcaption><strong>${esc(f.captionLead)}</strong> ${esc(f.captionBody)}${
    f.historical
      ? ` <span class="shot__hist">Historical: the marketplace closed in July 2026.</span>`
      : ""
  } <a class="shot__open" href="${m}-1280.webp">Open larger image<span class="sr-only">: ${esc(f.captionLead)}</span></a></figcaption>
</figure>`;
}

/* ---------- case-study sections ---------- */

export const SECTION_LABEL = {
  context: "Context",
  problem: "Problem",
  role: "My role",
  built: "What I built",
  "technical-decisions": "Technical decisions",
  "ux-decisions": "UX and detail decisions",
  evidence: "Interface evidence",
  outcome: "Outcome",
  improve: "What I would improve",
  related: "Related work",
};

const list = (items, cls = "plist") =>
  `<ul class="${cls}">${items.map((i) => `<li>${txt(i)}</li>`).join("")}</ul>`;

export function defaultDecision(d, i) {
  return `<article class="decision">
  <h3 class="decision__title"><span class="decision__n">Decision ${i + 1}</span> ${esc(d.decision)}</h3>
  <dl class="decision__dl">
    <div><dt>Why</dt><dd>${txt(d.why)}</dd></div>
    <div><dt>Trade-off</dt><dd>${txt(d.tradeOff)}</dd></div>
    <div><dt>Result</dt><dd>${txt(d.result)}</dd></div>
  </dl>
</article>`;
}

/**
 * Returns the ordered case-study sections for a project.
 * opts.decision renders one decision; opts.skipDiagram(spec) lets a concept lift a diagram out.
 * opts.shotSizes is the `sizes` attribute for evidence screenshots.
 */
export function caseSections(p, opts = {}) {
  resetDiagramIds();
  const cs = p.caseStudy;
  const decision = opts.decision ?? defaultDecision;
  let fig = 0;
  const diagramsFor = (key) =>
    (cs.diagrams ?? [])
      .filter((d) => d.section === key && !(opts.skipDiagram && opts.skipDiagram(d.spec)))
      .map((d) => diagram(d.spec, { figNo: ++fig }))
      .join("");
  const sections = [
    ["context", `<p>${txt(cs.context)}</p>`],
    ["problem", `<p>${txt(cs.problem)}</p>`],
    ["role", list(cs.myRole)],
    ["built", list(cs.whatIBuilt)],
    ["technical-decisions", cs.technicalDecisions.map(decision).join("")],
    ["ux-decisions", list(cs.uxDecisions)],
    ["evidence", p.figures.map((f) => shot(f, opts.shotSizes ?? "100vw")).join("")],
    ["outcome", list(cs.outcome)],
    ["improve", list(cs.nextImprovements)],
  ];
  const out = sections
    .filter(([, html]) => html)
    .map(([key, html]) => ({
      id: key,
      label: SECTION_LABEL[key],
      html: html + diagramsFor(key),
    }));
  if (p.related.length) {
    out.push({
      id: "related",
      label: SECTION_LABEL.related,
      html: `<ul class="related">${p.related
        .map(
          (l) =>
            `<li><a href="${l.href}" target="_blank" rel="noopener">${esc(l.label)}<span class="sr-only"> (opens in new tab)</span></a></li>`
        )
        .join("")}</ul>`,
    });
  }
  return out;
}

export function sectionsHTML(sections) {
  return sections
    .map(
      (s) => `<section class="cs-sec" id="${s.id}" aria-labelledby="${s.id}-h">
  <h2 class="cs-sec__h" id="${s.id}-h">${esc(s.label)}</h2>
  <div class="cs-sec__body">${s.html}</div>
</section>`
    )
    .join("\n");
}

export function outline(p, sections, cls = "outline") {
  return `<details class="${cls}" data-open-wide>
  <summary class="${cls}__h">On this page</summary>
  <nav aria-label="Sections in the ${esc(p.name)} case study" data-outline>
    <ol>${sections.map((s) => `<li><a href="#${s.id}">${esc(s.label)}</a></li>`).join("")}</ol>
  </nav>
</details>`;
}

export function caseFooterNav(p, cls = "casenav") {
  const n = nextProject(p.slug);
  return `<nav class="${cls}" aria-label="Case study navigation">
  <a class="${cls}__back" href="index.html#project-${p.slug}">Back to all case studies</a>
  <a class="${cls}__next" href="${n.slug}.html"><span class="${cls}__k">Next case study</span> <span class="${cls}__name">${esc(n.name)}</span></a>
</nav>`;
}

export const vtName = (slug) => `style="view-transition-name: name-${slug}"`;
