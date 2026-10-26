// Builds the P2 portability prototype from data/projects.ts.
//
//   node docs/design/portfolio-redesign/p2-portability/prototype/build.mjs [--publish <dir>]
//
// Writes index.html (the portfolio register), alwaysgeeky.html and emplifi.html (a cinematic
// scene, then the readable case study) next to this file. Every project fact is read from
// data/projects.ts; the only new copy is marked NEW below and needs owner approval.
// --publish writes a copy for the Artifact host, with the P1 LedgerGuard pages under lg/.
import { mkdirSync, readFileSync, writeFileSync, cpSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PROJECTS, PORTFOLIO_CASE_STUDY_ORDER } from "../../../../../data/projects.ts";
import * as draw from "./drawings.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const P1 = "../../cinematic-exploration/prototype";
const SITE = "https://alipajand.com";
const bySlug = (s) => PROJECTS.find((p) => p.slug === s);

const PROFILE = {
  name: "Ali Pajand",
  role: "Senior Software Engineer",
  focus: "Frontend architecture, design systems, and full-stack product work",
  stack: ["React", "TypeScript", "Next.js", "Node.js"],
  location: "Montreal, Canada",
  experience: "9+ years",
  availability: "Open to remote work within Canada",
};
const CONTACT = [
  {
    label: "Book a call",
    href: "https://calendly.com/alipajand/intro",
    host: "calendly.com/alipajand/intro",
  },
  { label: "GitHub", href: "https://github.com/alipajand", host: "github.com/alipajand" },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/alipajand",
    host: "linkedin.com/in/alipajand",
  },
];

// Approved in the P1 review.
const THESIS = "The interface, and the work behind it.";
const LG_ROLE = "Independent product";

// NEW copy, for owner approval. Lines marked "review" are the PR #216 design review's own
// suggestions.
const COPY = {
  workH: "Selected work",
  workIntro: "Seven projects; three explored in depth.", // review
  capsH: "By discipline",
  capsIntro: "Explore the work by technical discipline.", // review
  scheduleNote:
    "Every mark cites the project's own tag or case-study text. Pick a discipline to mark its projects above.",
  supportingNote: "Case studies on alipajand.com.",
  experimentNote: "A self-directed experiment, kept apart from client and product work.",
  agNote: "Four beats. Scroll, or go straight to the case study.",
  agVoxies:
    "AlwaysGeeky Games makes Voxies; the marketplace and login shown here are Voxies surfaces. The marketplace closed in July 2026, so these screenshots are a historical record, not a live product.",
  agClosed: "The marketplace closed in July 2026.",
  agLinks:
    "The Voxies marketplace closed in July 2026, so neither the marketplace nor the login address is linked from this prototype.",
  agDetail: "From interface to shared system", // review
  agGates: "Storybook contracts. CI enforcement.", // review
  emNote:
    "No interface screenshots included. Diagrams illustrate the approach with fictional, unmeasured data.", // review
  emChart: "A dense chart in an embedded webview", // review
  emPath: "Investigating the render path", // review
  emBudget: "Designing within the frame budget", // review
};

// The register. Codes are sheet prefixes; "case" goes straight to the readable case study,
// "scene" to the cinematic one. Supporting work and the experiment link to the production site.
const SHEETS = {
  ledgerguard: {
    code: "LG",
    tier: "Featured",
    role: LG_ROLE,
    time: "2026–present",
    case: `${P1}/ledgerguard.html`,
    scene: `${P1}/index.html`,
    evidence: "Shipped screenshots · editorial diagrams · design prototypes (fictional data)",
  },
  alwaysgeeky: {
    code: "AG",
    tier: "Featured",
    case: "alwaysgeeky.html#case",
    scene: "alwaysgeeky.html",
    evidence: "Shipped screenshots (historical) · editorial diagrams",
  },
  emplifi: {
    code: "EM",
    tier: "Featured",
    case: "emplifi.html#case",
    scene: "emplifi.html",
    evidence: "Editorial diagrams only · illustrative data · no screenshots",
  },
  "agent-tooling": {
    code: "AT",
    tier: "Supporting",
    evidence: "Text and diagrams · no screenshot",
  },
  tallyfolio: { code: "TF", tier: "Supporting", evidence: "Shipped screenshots" },
  controltech: { code: "CT", tier: "Supporting", evidence: "Text and diagrams · no screenshot" },
  mapbylaw: { code: "MB", tier: "Experiment", evidence: "Shipped screenshots" },
};

// The capability schedule. Each mark names its evidence: a capability tag from the project's
// data, or (marked "case study") a phrase from its case-study text.
const CAPS = [
  { key: "frontend", label: "Frontend architecture" },
  { key: "systems", label: "Design systems" },
  { key: "dataviz", label: "Data viz and rendering performance" },
  { key: "fullstack", label: "APIs, data and jobs" },
  { key: "ai", label: "AI product workflows" },
  { key: "a11y", label: "Accessibility" },
  { key: "dx", label: "Testing, CI and DX" },
];
const EVIDENCE = {
  ledgerguard: { frontend: "Next.js", fullstack: "Fastify, PostgreSQL, Redis/BullMQ", ai: "AI" },
  alwaysgeeky: {
    frontend: "React, Next.js",
    systems: "Storybook",
    a11y: "Accessibility",
    dx: "CI quality gates (case study)",
  },
  emplifi: {
    frontend: "React",
    systems: "Design systems",
    dataviz: "D3.js, Performance",
    a11y: "Accessibility",
  },
  "agent-tooling": { ai: "AI Agents", dx: "GitHub Actions, Developer Experience" },
  tallyfolio: { fullstack: "Full-stack product" },
  controltech: { frontend: "React", dx: "Testing, CI/CD" },
  mapbylaw: { fullstack: "Typed API contracts", ai: "AI product UI" },
};

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Unsupported percentage figures (LedgerGuard 90%, Emplifi 80%) are never shown.
const unsupported = (s) => /\b\d+(\.\d+)?%/.test(s);
const safe = (list) => list.filter((s) => !unsupported(s));
// Sentences end at . ! or ? followed by a capital letter or the end, so "Next.js" stays whole.
const firstSentence = (text) =>
  safe(String(text).match(/.+?[.!?](?=\s+[A-Z]|\s*$)/g) ?? [String(text)])[0].trim();

const FONTS =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400;500;600&family=Martian+Mono:wght@400;500&display=swap";
const GSAP = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5";

// Resolves the motion mode before first paint (same rules and storage key as P1). On a page
// with a scene it also lays out the animated version before first paint, provisionally:
// motion.js confirms it with .motion-ready, and if that has not happened by the load event
// the static layout comes back. It also picks the depth mode: 3D only where it was verified.
const PROVISIONAL = `if(m==="full"){r.classList.add("motion-live");addEventListener("load",function(){if(r.classList.contains("motion-ready"))return;r.classList.remove("motion-live");var t=location.hash&&document.getElementById(decodeURIComponent(location.hash.slice(1)));if(t)t.scrollIntoView()})}`;
const boot = (live) =>
  `<script>(function(){var r=document.documentElement,q=matchMedia("(prefers-reduced-motion: reduce)"),s=null;try{s=JSON.parse(localStorage.getItem("aa-motion2")||"null")}catch(e){}var os=q.matches?"reduce":"full",m=os;if(s&&(s.m==="full"||s.m==="reduce")){if(os==="full")m=s.m;else if(s.os==="reduce")m=s.m}r.dataset.motion=m;r.classList.add("js");var n=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];if((n&&n.type==="back_forward")||location.hash)r.classList.add("returning");${live ? PROVISIONAL : ""}})();</script>`;

const shell = ({
  title,
  description,
  body,
  scripts = "",
  live = false,
  css = [],
}) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="color-scheme" content="dark">
<link rel="icon" href="data:,">
${boot(live)}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="grammar.css">
<link rel="stylesheet" href="projects.css">
${css.map((c) => `<link rel="stylesheet" href="${c}">`).join("\n")}
</head>
<body>
${body}
${scripts}
</body>
</html>
`;

const img = (base, alt, sizes, { eager = false, only960 = false, cls = "" } = {}) =>
  only960
    ? `<img class="${cls}" src="${base}-960.webp" width="960" height="600" alt="${esc(alt)}" ${eager ? "" : 'loading="lazy"'} decoding="async">`
    : `<img class="${cls}" src="${base}-960.webp" srcset="${base}-960.webp 960w, ${base}-1600.webp 1600w" sizes="${sizes}" width="1600" height="1003" alt="${esc(alt)}" ${eager ? "" : 'loading="lazy"'} decoding="async">`;

// A step's figure: the wide drawing, and its phone sheet. Exactly one is displayed, so the
// other is out of the accessibility tree too.
const fig = (wide, phone, cls = "") =>
  `<figure class="step__fig ${cls}"><div class="fig-w scroll-x">${wide}</div><div class="fig-p">${phone}</div></figure>`;

// A phone sheet in its drawing plate, with an HTML strip that wraps on any width.
const pplate = (svg, code, title, kind) =>
  `<div class="plate plate--draw pplate">${svg}${strip(code, title, kind, "strip--draw")}</div>`;

// The provenance strip under every plate and drawing: sheet number, title, material.
const strip = (code, title, kind, cls = "") =>
  `<figcaption class="strip ${cls}"><span class="strip__code">${esc(code)}</span><span class="strip__title">${esc(title)}</span><span class="strip__kind">${esc(kind)}</span></figcaption>`;

const bar = (links, { sceneToggle = true } = {}) => `
<header class="bar">
  <a class="bar__mark" href="index.html" aria-label="Ali Pajand, portfolio register"><span class="bar__ap" aria-hidden="true">A–A</span><span class="bar__name">Ali Pajand</span></a>
  <nav class="bar__nav" aria-label="Primary">
    ${links.map((l) => `<a href="${l.href}">${esc(l.label)}</a>`).join("")}
    ${sceneToggle ? `<button type="button" class="bar__motion" data-motion-toggle aria-pressed="true"><span class="bar__dot" aria-hidden="true"></span><span data-motion-label>Motion on</span></button>` : ""}
  </nav>
</header>`;

const contact = `
<footer class="contact" id="contact" data-tone="void">
  <div class="contact__in">
    <p class="contact__k">Contact</p>
    <h2 class="contact__h">${esc(PROFILE.role)}, ${esc(PROFILE.location)}</h2>
    <ul class="contact__list" role="list">
      ${CONTACT.map((c) => `<li><a href="${c.href}">${esc(c.label)}<span>${esc(c.host)}</span></a></li>`).join("")}
    </ul>
    <p class="contact__note">${esc(PROFILE.availability)}. Design prototype for review; not the production site.</p>
  </div>
</footer>`;

/* =============================================================================== index */

// The opening's three bays: what stands above the A–A cut (the interface) and what is drawn
// below it (the work behind it).
const LG_LAYERS = bySlug("ledgerguard").caseStudy.diagrams.find((d) => d.spec.type === "layers")
  .spec.layers;
const AG_LAYERS = bySlug("alwaysgeeky").caseStudy.diagrams.find((d) => d.spec.type === "layers")
  .spec.layers;
const AG_SURFACES = ["Marketplace", "Authentication", "Product", "Account"];
const BAYS = {
  ledgerguard: {
    face: {
      img: "media/ledgerguard-dashboard",
      pos: "38% 78%",
      kind: "Screenshot · shipped product",
      tag: "Shipped screenshot",
      what: "the LedgerGuard dashboard, a shipped screenshot",
    },
    interior: () => draw.lgInterior(LG_LAYERS),
    behind: "five layers, one review boundary",
  },
  alwaysgeeky: {
    face: {
      img: "media/ag-marketplace",
      pos: "42% 88%",
      kind: "Screenshot · shipped product, historical",
      tag: "Historical screenshot",
      what: "the Voxies marketplace, a shipped screenshot, now historical",
    },
    interior: () => draw.agInterior(AG_SURFACES, AG_LAYERS),
    behind: "four surfaces on one library",
    vt: "sheet-ag",
  },
  emplifi: {
    face: {
      svg: () => draw.emWebview({ crop: 560 }),
      kind: "Editorial diagram · illustrative data",
      tag: "Illustrative diagram",
      what: "an editorial diagram of a chart in a webview, with illustrative data",
    },
    interior: () => draw.emInterior(),
    behind: "React around D3, inside one frame",
    vt: "sheet-em",
  },
};

function indexPage() {
  const order = [...PORTFOLIO_CASE_STUDY_ORDER];
  const featured = order.filter((s) => SHEETS[s].tier === "Featured");
  const caps = (slug) => Object.keys(EVIDENCE[slug] ?? {}).join(" ");

  const bay = (slug) => {
    const p = bySlug(slug);
    const s = SHEETS[slug];
    const b = BAYS[slug];
    const face = b.face.img
      ? img(b.face.img, "", "(max-width: 899px) 30vw, 28vw", {
          eager: true,
          cls: "bay__img",
        }).replace("<img ", `<img style="object-position: ${b.face.pos}" `)
      : b.face.svg();
    // The case study is the main way in: the name and the picture both open it. The picture's
    // link is a pointer convenience, so it is kept out of the tab order and the accessibility
    // tree. The scene is the optional, smaller link.
    return `
      <li class="bay bay--${s.code.toLowerCase()}" id="project-${slug}" data-row="${slug}" data-caps="${caps(slug)}"${b.vt ? ` data-vt="${b.vt}"` : ""}>
        <a class="bay__sect" href="${s.case}" tabindex="-1" aria-hidden="true">
          <span class="bay__above">${face}</span>
          <span class="bay__cut"><span class="bay__tag"><b>${s.code}-01</b><i> ${esc(b.face.tag)}</i></span><span class="bay__tag bay__tag--v"><b>${s.code}-02</b><i> Diagram</i></span></span>
          <span class="bay__below">${b.interior()}</span>
        </a>
        <div class="bay__title">
          <p class="bay__bubble" aria-hidden="true">${s.code}</p>
          <h3 class="bay__name"><a href="${s.case}"><span class="bay__nm">${esc(p.name)}</span><span class="bay__cs">Read the case study<span class="sr-only">: ${esc(p.caseStudyTitle)}</span></span></a></h3>
          <p class="bay__sub">${esc(p.caseStudyTitle)}</p>
        </div>
        <a class="bay__go" href="${s.scene}" aria-label="${esc(p.name)}: open the scene">Scene</a>
      </li>`;
  };

  const brief = (slug) => {
    const p = bySlug(slug);
    const s = SHEETS[slug];
    return `
      <li class="brief" data-row="${slug}">
        <p class="brief__k"><span class="brief__code">${s.code}</span><span class="brief__nm">${esc(p.name)}</span> ${esc(s.role ?? p.role)} · ${esc(s.time ?? p.timeframe)}</p>
        <p class="brief__line">${esc(firstSentence(p.cardProblem))}</p>
        <p class="brief__mat"><b>${s.code}-01</b> above the cut: ${esc(BAYS[slug].face.what)}. <b>${s.code}-02</b> below: editorial diagram, ${esc(BAYS[slug].behind)}.</p>
      </li>`;
  };

  const entry = (slug, mod = "") => {
    const p = bySlug(slug);
    const s = SHEETS[slug];
    const cls = "srow";
    return `
      <li class="${cls}${mod ? ` ${cls}--${mod}` : ""}" id="project-${slug}" data-row="${slug}" data-caps="${caps(slug)}">
        <a class="${cls}__link" href="${SITE}/portfolio/${slug}" rel="noopener">
          <span class="${cls}__code" aria-hidden="true">${s.code}</span>
          <span class="${cls}__name">${esc(p.name)}</span>
          <span class="${cls}__title">${esc(p.caseStudyTitle)}</span>
          <span class="${cls}__go">Case study on alipajand.com<span class="sr-only"> (opens the production site)</span> ↗</span>
        </a>
        <p class="${cls}__meta">${esc(p.role)}${p.timeframe ? ` · ${esc(p.timeframe)}` : ""} · ${esc(s.evidence)}</p>
      </li>`;
  };

  // The dimension string over the bays: each bay is dimensioned by its timeframe. The bays are
  // equal, so the string is marked not to scale.
  const dims = featured
    .map(
      (slug) =>
        `<span class="dims__seg"><span>${esc(SHEETS[slug].time ?? bySlug(slug).timeframe)}</span></span>`
    )
    .join("");

  const capButtons = CAPS.map(
    (c) =>
      `<button type="button" class="cap" data-cap-to="${c.key}" aria-pressed="false" disabled>${esc(c.label)}</button>`
  ).join("");

  const schedule = `
    <div class="sched__wrap" role="region" aria-label="Capability schedule table, scrolls sideways" tabindex="0">
      <table class="sched__table">
        <caption class="sr-only">Capability schedule: which projects show evidence of each discipline, and the evidence each mark cites.</caption>
        <thead><tr><th scope="col" class="sched__p">Project</th>${CAPS.map((c) => `<th scope="col" data-col="${c.key}"><span>${esc(c.label)}</span></th>`).join("")}</tr></thead>
        <tbody>
          ${order
            .map((slug) => {
              const p = bySlug(slug);
              const ev = EVIDENCE[slug] ?? {};
              return `<tr data-row="${slug}"><th scope="row" class="sched__p"><span class="sched__code">${SHEETS[slug].code}</span> ${esc(p.name)}</th>${CAPS.map((c) => (ev[c.key] ? `<td data-col="${c.key}"><span class="mark" aria-hidden="true"></span><span class="sched__ev">${esc(ev[c.key])}</span></td>` : `<td data-col="${c.key}" class="sched__none"><span class="sr-only">No</span></td>`)).join("")}</tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>`;

  const body = `
<a class="skip" href="#work">Skip to selected work</a>
${bar([
  { label: "Work", href: "#work" },
  { label: "Disciplines", href: "#capabilities" },
  { label: "Contact", href: "#contact" },
])}
<main id="main" class="reg">
  <section class="op" aria-labelledby="op-name" data-opening>
    <div class="op__stage" data-op-stage>
      <header class="op__id" data-op-id>
        <p class="op__k"><span class="op__ap" aria-hidden="true">A–A</span> Sheet 00 · Portfolio</p>
        <h1 class="op__name" id="op-name">${esc(PROFILE.name)}</h1>
        <p class="op__role">${esc(PROFILE.role)}</p>
        <p class="op__focus">${esc(PROFILE.focus)}</p>
        <dl class="op__tb">
          <div><dt>Stack</dt><dd>${PROFILE.stack.join(" · ")}</dd></div>
          <div><dt>Experience</dt><dd>${esc(PROFILE.experience)}</dd></div>
          <div><dt>Based</dt><dd>${esc(PROFILE.location)}</dd></div>
          <div><dt>Availability</dt><dd>${esc(PROFILE.availability)}</dd></div>
          <div class="op__call"><dt class="sr-only">Contact</dt><dd><a href="${CONTACT[0].href}">${CONTACT[0].label}</a></dd></div>
        </dl>
      </header>
      <div class="sect" id="work" data-sect>
        <div class="sect__key">
          <h2 class="sect__h">${esc(COPY.workH)}</h2>
          <p class="sect__intro">${esc(COPY.workIntro)}</p>
          <p class="sr-only">${esc(THESIS)} Each featured project is drawn cut through: the shipped interface above the line, the system behind it below.</p>
        </div>
        <div class="sect__draw">
          <p class="datum datum--up" aria-hidden="true"><span>The interface,</span></p>
          <p class="datum datum--down" aria-hidden="true"><span>and the work behind it.</span></p>
          <p class="dims" aria-hidden="true">${dims}</p>
          <ol class="bays" role="list">${featured.map(bay).join("")}</ol>
          <div class="sect__line" aria-hidden="true"></div>
          <span class="sect__a sect__a--l" aria-hidden="true">A</span>
          <span class="sect__a sect__a--r" aria-hidden="true">A</span>
        </div>
      </div>
    </div>
  </section>

  <section class="briefs" aria-label="Featured work in brief">
    <ol class="briefs__list" role="list">${featured.map(brief).join("")}</ol>
  </section>

  <section class="sup" aria-labelledby="sup-h">
    <div class="sect__key">
      <h2 class="sup__h" id="sup-h">Supporting</h2>
      <p class="sect__intro">${esc(COPY.supportingNote)}</p>
    </div>
    <ol class="sup__list" role="list">${order
      .filter((s) => SHEETS[s].tier === "Supporting")
      .map((s) => entry(s))
      .join("")}</ol>
  </section>

  <section class="exp" aria-labelledby="exp-h">
    <div class="sect__key">
      <h2 class="sup__h" id="exp-h">Experiment</h2>
      <p class="sect__intro">${esc(COPY.experimentNote)}</p>
    </div>
    <ol class="sup__list" role="list">${order
      .filter((s) => SHEETS[s].tier === "Experiment")
      .map((s) => entry(s, "exp"))
      .join("")}</ol>
  </section>

  <section class="sched" id="capabilities" aria-labelledby="sched-h">
    <div class="sect__key">
      <h2 class="sup__h" id="sched-h">${esc(COPY.capsH)}</h2>
      <p class="sect__intro">${esc(COPY.capsIntro)}</p>
    </div>
    <div class="sched__body">
      <div class="caps" role="group" aria-label="Mark projects by discipline">${capButtons}</div>
      <p class="caps__status" data-cap-status aria-live="polite"></p>
      <p class="sched__note">${esc(COPY.scheduleNote)}</p>
      ${schedule}
    </div>
  </section>
</main>
${contact}`;

  return shell({
    title: "Section A–A Register",
    description:
      "Ali Pajand portfolio, P2.1 design exploration: the opening and project register for the Section A–A visual system.",
    body,
    css: ["opening.css"],
    scripts: `<script src="${GSAP}/gsap.min.js"></script>
<script src="${GSAP}/ScrollTrigger.min.js"></script>
<script src="motion.js"></script>
<script src="register.js"></script>`,
  });
}

/* ========================================================================= case study */

function caseStudy(p, s, hero, drawings = "", links = null) {
  const cs = p.caseStudy;
  const sec = (id, h, inner) =>
    `<section class="case__sec" aria-labelledby="${id}"><h3 class="case__h" id="${id}">${h}</h3>${inner}</section>`;
  const ul = (items) =>
    `<ul class="case__list">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
  const decisions = cs.technicalDecisions
    .map(
      (d, i) => `
      <article class="dec">
        <p class="dec__n">Decision ${String(i + 1).padStart(2, "0")}</p>
        <h4 class="dec__h">${esc(d.decision)}</h4>
        <dl class="dec__dl">
          <div><dt>Why</dt><dd>${esc(d.why)}</dd></div>
          <div><dt>Trade-off</dt><dd>${esc(d.tradeOff)}</dd></div>
          <div><dt>Result</dt><dd>${esc(d.result)}</dd></div>
        </dl>
      </article>`
    )
    .join("");
  const evidence = (cs.interfaceEvidence ?? []).slice(1);
  return `
<section class="case" id="case" aria-labelledby="case-h" data-tone="paper">
  <div class="case__top">
    <header class="case__head">
      <p class="case__k"><span class="case__code">${s.code}</span> ${esc(p.role)} · ${esc(p.timeframe)}</p>
      <h2 class="case__name" id="case-h">${esc(p.name)}</h2>
      <p class="case__title">${esc(p.caseStudyTitle)}</p>
    </header>
    ${hero}
  </div>
  <div class="case__body">
    <p class="case__lede">${esc(safe([cs.overview])[0] ?? "")}</p>
    ${sec("c-context", "Context", `<p>${esc(cs.context)}</p>`)}
    ${sec("c-problem", "Problem", `<p>${esc(cs.problem)}</p>`)}
    ${sec("c-role", "What I owned", ul(cs.myRole))}
    ${sec("c-built", "What I built", ul(safe(cs.whatIBuilt)))}
    ${sec("c-dec", "Technical decisions", decisions)}
    ${cs.uxDecisions?.length ? sec("c-ux", "UX decisions", ul(cs.uxDecisions)) : ""}
    ${drawings ? `<section class="case__sec case__drawings" aria-labelledby="c-dr"><h3 class="case__h" id="c-dr">Drawings</h3><p>The scene's editorial diagrams at full size.</p>${drawings}</section>` : ""}
    ${evidence.length ? sec("c-ev", "More evidence", evidence.map((e) => `<figure class="plate">${img(e.src.replace("/portfolio-media/alwaysgeeky-", "media/ag-").replace(".png", ""), e.alt, "(max-width: 899px) 92vw, 60vw")}${strip(`${s.code}-05`, e.captionLead.replace(/\.$/, ""), "Screenshot · shipped product")}<p class="plate__cap">${esc(e.captionBody)}</p></figure>`).join("")) : ""}
    ${sec("c-out", "Outcome", ul(safe(cs.outcome)))}
    ${sec("c-next", "What I would improve", ul(cs.nextImprovements))}
    ${links ? sec("c-links", "Links", links) : p.liveLinks.length ? sec("c-links", "Links", `<ul class="case__links">${p.liveLinks.map((l) => `<li><a href="${l.href}" rel="noopener">${esc(l.label)} ↗</a></li>`).join("")}</ul>`) : ""}
  </div>
</section>`;
}

const sheetNav = (slug, prev, next) => `
<nav class="sheetnav" aria-label="Other sheets">
  <a class="sheetnav__a" href="${prev.href}"><span class="sheetnav__k">Previous sheet</span><span class="sheetnav__n"><b>${prev.code}</b> ${esc(prev.name)}</span></a>
  <a class="sheetnav__a sheetnav__a--mid" href="index.html#project-${slug}"><span class="sheetnav__k">Register</span><span class="sheetnav__n">All work</span></a>
  <a class="sheetnav__a sheetnav__a--next" href="${next.href}"><span class="sheetnav__k">Next sheet</span><span class="sheetnav__n"><b>${next.code}</b> ${esc(next.name)}</span></a>
</nav>`;

// The opening card of a scene: who, what and when, and the way out.
const openCard = (p, s, note, provenance, ctx = "") => `
  <header class="step step--open" id="top">
    <div class="step__card step__card--open">
      <p class="step__k"><span class="step__code">${s.code}</span> ${esc(p.timeframe)}</p>
      <h1 class="step__name">${esc(p.name)}</h1>
      <p class="step__title">${esc(p.caseStudyTitle)}</p>
      <p class="step__role">${esc(p.role)} · ${esc(PROFILE.role)} today</p>
      <p class="step__lede">${esc(firstSentence(p.cardProblem))}</p>
      ${ctx ? `<p class="step__ctx">${esc(ctx)}</p>` : ""}
      <p class="step__note">${esc(note)}</p>
      <p class="step__prov">${provenance}</p>
      <p class="step__go"><a class="btn" href="#case">Read the case study</a></p>
    </div>
  </header>`;

/* ======================================================================== AlwaysGeeky */

function alwaysGeekyPage() {
  const p = bySlug("alwaysgeeky");
  const s = SHEETS.alwaysgeeky;
  const cs = p.caseStudy;
  const layersSpec = cs.diagrams.find((d) => d.spec.type === "layers").spec;
  const compare = cs.diagrams.find((d) => d.spec.type === "compare").spec;
  const flow = cs.diagrams.find((d) => d.spec.type === "flow").spec;
  const [market, login] = cs.interfaceEvidence;
  const SURFACES = ["Marketplace", "Authentication", "Product", "Account"];
  const DETAIL_ALT =
    "Crop of the shipped marketplace screenshot: the Recently listed card, with an item, its price and a Shop call to action.";
  const shared = compare.columns[1].items;
  const contractRows = [
    { part: "Loading, empty, and error states", where: shared[0] },
    { part: "Accessibility defaults", where: shared[1] },
    { part: "Component API and escape hatches", where: shared[2] },
    { part: "Conventions: API shape, TypeScript rules, review", where: shared[3] },
  ];
  const under = layersSpec.layers.slice(1);
  const chain = draw.agChain(
    contractRows,
    flow.steps.slice(1).map((st) => st.label),
    flow.loop
  );
  const assemblyStatic = draw.agAssembly(SURFACES, under, [
    "media/ag-marketplace-960.webp",
    "media/ag-login-960.webp",
  ]);

  // The stage: drawn once at a fixed design size (1200 x 800) and scaled to fit. The world is
  // a taller drawing (1200 x 2300) the camera moves over: the interface at the top, the
  // library under it, then the contract and the gates further down.
  const surfX = (i) => 60 + i * 275;
  const stage = `
  <div class="stage" data-stage aria-hidden="true">
    <div class="pic" data-pic>
      <div class="canvas" data-canvas>
        <div class="ag-world" data-world>
          <svg class="ag-wires" viewBox="0 0 1200 1400" data-late>
            ${[0, 1, 2, 3].map((i) => `<line data-drop="${i}" x1="${surfX(i) + 125}" y1="334" x2="${surfX(i) + 125}" y2="428" class="drop ink ag" pathLength="1"/>`).join("")}
            <line data-bus="0" x1="600" y1="522" x2="600" y2="574" class="bus ink ag" pathLength="1"/>
          </svg>
          <div class="ag-band" data-band data-late><span class="ag-band__n">01</span><span class="ag-band__t">${esc(under[0].label)}</span><span class="ag-band__d">${esc(under[0].detail)}</span></div>
          <div class="ag-sheet ag-sheet--chain" data-sheet="chain" data-late>${chain}</div>
          ${SURFACES.map((name, i) =>
            i === 0
              ? ""
              : `<div class="ag-surf" data-surf="${i}" style="left:${surfX(i)}px" data-late>${
                  i === 1
                    ? `<img src="media/ag-login-960.webp" width="960" height="602" alt="" decoding="async">`
                    : `<div class="ag-surf__void"></div>`
                }</div>`
          ).join("")}
          ${SURFACES.map((name, i) => `<p class="ag-surf__l" data-surf-l="${i}" style="left:${surfX(i)}px" data-late><b>${esc(name)}</b><span>${i < 2 ? "Screenshot · shipped product" : "No screenshot in this portfolio"}</span></p>`).join("")}
          <div class="ag-plate" data-plate data-vt-subject>
            <img src="media/ag-marketplace-1600.webp" width="1600" height="1003" alt="" decoding="async" fetchpriority="high">
            <div class="ag-dim" data-dim></div>
            <svg class="ag-callouts" viewBox="0 0 1200 752" data-late>
              <circle cx="180.6" cy="663.9" r="150" class="callout ink ag" pathLength="1"/>
              <path d="M306,580 L420,470 H560" class="leader ink ag" pathLength="1"/>
              <circle cx="1086" cy="30" r="44" class="callout ink ag" pathLength="1"/>
              <path d="M1052,62 L960,150 H820" class="leader ink ag" pathLength="1"/>
            </svg>
            <p class="ag-tag ag-tag--1" data-tag="1" data-late><b>1</b> Catalog browsing and a call to action</p>
            <p class="ag-tag ag-tag--2" data-tag="2" data-late><b>2</b> Sign in</p>
            <p class="ag-plate__l" data-plate-l><b>AG-01</b> Voxies marketplace · Screenshot · shipped product, historical</p>
          </div>
          <div class="ag-lens" data-lens data-late>
            <img src="media/ag-detail-listing.webp" width="820" height="340" alt="" decoding="async">
          </div>
          <p class="ag-lens__l" data-lens-label data-late><b>Detail 1</b> Crop of the shipped screenshot, enlarged · not a Storybook screen</p>
        </div>
      </div>
    </div>
  </div>`;

  const steps = `
  <div class="track" data-track>
    ${openCard(p, s, COPY.agNote, `<b>Materials.</b> Marketplace and login are <span class="m m--shot">shipped screenshots</span>, now historical. Everything drawn is an <span class="m m--draw">editorial diagram</span> of the documented system; nothing here is a Storybook screen.`, COPY.agVoxies)}
    <article class="step" id="detail" data-beat="detail">
      <div class="step__card">
        <p class="step__k"><span class="step__code ag">1</span> AG-01 → Detail 1</p>
        <h2 class="step__h">${esc(COPY.agDetail)}</h2>
        <p>${esc(market.captionBody)}</p>
        <p class="step__src">Case study caption, Marketplace. Detail 1 is a crop of the shipped screenshot, enlarged; the circles are annotations.</p>
      </div>
      ${fig(
        `<div class="lens-static"><img src="media/ag-detail-listing.webp" width="820" height="340" alt="${esc(DETAIL_ALT)}" loading="lazy" decoding="async"></div>
        ${strip("Detail 1", "Recently listed · from AG-01", "Screenshot crop · shipped product")}`,
        `<div class="plate pshot" data-in>
          <div class="pshot__img"><img src="media/ag-marketplace-960.webp" width="960" height="602" alt="${esc(market.alt)}" loading="lazy" decoding="async">${draw.agMarks()}</div>
          ${strip("AG-01", "Voxies marketplace", "Screenshot · shipped product, historical")}
        </div>
        <ol class="pshot__key" role="list"><li><b>1</b> Catalog browsing and a call to action</li><li><b>2</b> Sign in</li></ol>
        <div class="plate pshot" data-in>
          <div class="lens-static"><img src="media/ag-detail-listing.webp" width="820" height="340" alt="${esc(DETAIL_ALT)}" loading="lazy" decoding="async"></div>
          ${strip("Detail 1", "Recently listed · from AG-01", "Screenshot crop · shipped product")}
        </div>`
      )}
    </article>
    <article class="step" id="assembly" data-beat="assembly">
      <div class="step__card">
        <p class="step__k"><span class="step__code ag">2</span> AG-02 · Assembly</p>
        <h2 class="step__h">${esc(layersSpec.title)}</h2>
        <p>${esc(layersSpec.caption)}</p>
        <ol class="facts">
          ${layersSpec.layers.map((l) => `<li><b>${esc(l.label)}.</b> ${esc(l.detail)}</li>`).join("")}
        </ol>
        <p class="step__src">${esc(login.captionBody)}</p>
      </div>
      ${fig(assemblyStatic, pplate(draw.agAssemblyPhone(SURFACES, under[0].label, ["media/ag-marketplace-960.webp", "media/ag-login-960.webp"]), "AG-02", "Assembly · four surfaces, one library", "Editorial diagram · screenshots are shipped"))}
    </article>
    <article class="step" id="gates" data-beat="gates">
      <div class="step__card">
        <p class="step__k"><span class="step__code ag">3</span> AG-03 · Contract and enforcement</p>
        <h2 class="step__h">${esc(COPY.agGates)}</h2>
        <p><b>Contract.</b> ${esc(cs.technicalDecisions[0].decision)}</p>
        <p><b>Enforcement.</b> ${esc(cs.technicalDecisions[1].decision)}</p>
      </div>
      ${fig(
        chain,
        pplate(
          draw.agChainPhone(
            contractRows,
            flow.steps.slice(1).map((st) => st.label),
            flow.loop
          ),
          "AG-03",
          "Storybook contract and CI enforcement",
          "Editorial diagram"
        )
      )}
    </article>
    <div class="beat beat--land" data-beat="land"></div>
  </div>`;

  const hero = `
  <figure class="plate case__hero" data-slot style="--vt: sheet-ag">
    ${img("media/ag-marketplace", market.alt, "(max-width: 899px) 92vw, 64vw", { cls: "slot-media" })}
    ${strip("AG-01", "Voxies marketplace", "Screenshot · shipped product, historical")}
    <p class="plate__cap"><b>${esc(market.captionLead)}</b> ${esc(market.captionBody)} ${esc(COPY.agClosed)}</p>
  </figure>`;

  const body = `
<a class="skip" href="#case">Skip to the AlwaysGeeky case study</a>
${bar([
  { label: "Index", href: `index.html#project-${p.slug}` },
  { label: "Case study", href: "#case" },
  { label: "Contact", href: "#contact" },
])}
<main id="main" class="page page--ag">
  <section class="seq" id="sequence" data-scene="ag" aria-label="AlwaysGeeky: from the interface to the shared component system">
    ${stage}
    ${steps}
  </section>
  ${caseStudy(
    p,
    s,
    hero,
    [assemblyStatic, chain].map((d) => `<figure class="scroll-x">${d}</figure>`).join(""),
    `<p>${esc(COPY.agLinks)}</p>`
  )}
  ${sheetNav("alwaysgeeky", { href: SHEETS.ledgerguard.case, code: "LG", name: "LedgerGuard" }, { href: SHEETS.emplifi.case, code: "EM", name: "Emplifi" })}
</main>
${contact}`;

  return shell({
    title: "AlwaysGeeky Sheet",
    description:
      "Ali Pajand portfolio, P2: AlwaysGeeky Games, the shared component system under four product surfaces.",
    body,
    live: true,
    scripts: `<script src="${GSAP}/gsap.min.js"></script>
<script src="${GSAP}/ScrollTrigger.min.js"></script>
<script src="motion.js"></script>
<script src="ag.js"></script>`,
  });
}

/* ============================================================================ Emplifi */

function emplifiPage() {
  const p = bySlug("emplifi");
  const s = SHEETS.emplifi;
  const cs = p.caseStudy;
  const layersSpec = cs.diagrams.find((d) => d.spec.type === "layers").spec;
  const compare = cs.diagrams.find((d) => d.spec.type === "compare").spec;
  const flow = cs.diagrams.find((d) => d.spec.type === "flow").spec;
  // the flow's "Reduce cost" step carries the unsupported 80% figure: it is never shown
  const steps4 = flow.steps.map((st) => ({
    ...st,
    detail: unsupported(st.detail) ? "" : st.detail,
  }));
  const approach = safe(compare.columns[1].items);
  const monitor = steps4.find((st) => st.label === "Monitor release");

  const stage = `
  <div class="stage" data-stage aria-hidden="true">
    <div class="pic" data-pic>
      <div class="canvas" data-canvas>
        <div class="em-phone" data-phone data-vt-subject>${draw.emWebview()}</div>
        <div class="em-sheet em-sheet--path" data-path data-late>${draw.emRenderPath()}</div>
        <div class="em-sheet em-sheet--layers" data-layers data-late>${draw.emLayers(layersSpec.layers)}</div>
        <div class="em-sheet em-sheet--budget" data-budget data-late>${draw.emBudget(approach)}</div>
        <p class="em-stamp" data-stamp data-late><b>${esc(monitor.label)}</b> ${esc(monitor.detail)}</p>
      </div>
    </div>
  </div>`;

  const steps = `
  <div class="track" data-track>
    ${openCard(p, s, COPY.emNote, `<b>Materials.</b> <span class="m m--draw">Editorial diagrams</span> only, with fictional, unmeasured data. No Emplifi interface is shown or imitated, and no length, value or timing in a drawing is a measurement.`)}
    <article class="step" id="chart" data-beat="chart">
      <div class="step__card">
        <p class="step__k"><span class="step__code em">1</span> EM-01 · The webview</p>
        <h2 class="step__h">${esc(COPY.emChart)}</h2>
        <p>${esc(cs.context)}</p>
      </div>
      <figure class="step__fig step__fig--phone plate plate--draw"><div class="step__phone">${draw.emWebview()}</div>${strip("EM-01", "A dense chart in an embedded mobile webview", "Editorial diagram · illustrative data", "strip--draw")}</figure>
    </article>
    <article class="step" id="path" data-beat="path">
      <div class="step__card">
        <p class="step__k"><span class="step__code em">2</span> EM-02 · The render path</p>
        <h2 class="step__h">${esc(COPY.emPath)}</h2>
        <p>${esc(cs.problem)}</p>
        <p class="step__src">${esc(steps4[0].detail)} ${esc(steps4[1].detail)}</p>
      </div>
      ${fig(draw.emRenderPath(), pplate(draw.emRenderPathPhone(), "EM-02", "The render path of one chart update", "Editorial diagram · schematic"))}
    </article>
    <article class="step" id="composition" data-beat="composition">
      <div class="step__card">
        <p class="step__k"><span class="step__code em">3</span> EM-03 · Composition</p>
        <h2 class="step__h">${esc(layersSpec.title)}</h2>
        <p>${esc(cs.technicalDecisions[0].decision)}</p>
        <p class="step__src">${esc(layersSpec.caption)}</p>
      </div>
      ${fig(draw.emLayers(layersSpec.layers), pplate(draw.emLayersPhone(layersSpec.layers), "EM-03", "Composition of a dashboard module", "Editorial diagram"))}
    </article>
    <article class="step" id="budget" data-beat="budget">
      <div class="step__card">
        <p class="step__k"><span class="step__code em">4</span> EM-04 · The frame budget</p>
        <h2 class="step__h">${esc(COPY.emBudget)}</h2>
        <p>${esc(compare.caption)}</p>
        <p class="step__src">The 16.7 ms ruler is a reference: one frame of a 60 Hz display, not a measurement. ${esc(monitor.detail)}</p>
      </div>
      ${fig(draw.emBudget(approach), pplate(draw.emBudgetPhone(approach), "EM-04", "Designing within the frame budget", "Editorial diagram · schematic"))}
    </article>
    <div class="beat beat--land" data-beat="land"></div>
  </div>`;

  const hero = `
  <figure class="plate plate--draw case__hero case__hero--draw" data-slot style="--vt: sheet-em">
    <div class="plate__draw"><div class="slot-media">${draw.emWebview()}</div></div>
    ${strip("EM-01", "A dense chart in an embedded mobile webview", "Editorial diagram · illustrative data", "strip--draw")}
    <p class="plate__cap"><b>Editorial diagram.</b> ${esc(COPY.emNote)}</p>
  </figure>`;

  const body = `
<a class="skip" href="#case">Skip to the Emplifi case study</a>
${bar([
  { label: "Index", href: `index.html#project-${p.slug}` },
  { label: "Case study", href: "#case" },
  { label: "Contact", href: "#contact" },
])}
<main id="main" class="page page--em">
  <section class="seq" id="sequence" data-scene="em" aria-label="Emplifi: rendering a dense chart in an embedded webview">
    ${stage}
    ${steps}
  </section>
  ${caseStudy(
    p,
    s,
    hero,
    [draw.emRenderPath(), draw.emLayers(layersSpec.layers), draw.emBudget(approach)]
      .map((d) => `<figure class="scroll-x">${d}</figure>`)
      .join("")
  )}
  ${sheetNav("emplifi", { href: SHEETS.alwaysgeeky.case, code: "AG", name: "AlwaysGeeky" }, { href: SHEETS.ledgerguard.case, code: "LG", name: "LedgerGuard" })}
</main>
${contact}`;

  return shell({
    title: "Emplifi Sheet",
    description:
      "Ali Pajand portfolio, P2.1: Emplifi, a screenshot-free case study about rendering dense D3 charts in embedded webviews.",
    body,
    live: true,
    scripts: `<script src="${GSAP}/gsap.min.js"></script>
<script src="${GSAP}/ScrollTrigger.min.js"></script>
<script src="motion.js"></script>
<script src="em.js"></script>`,
  });
}

writeFileSync(join(here, "index.html"), indexPage());
writeFileSync(join(here, "alwaysgeeky.html"), alwaysGeekyPage());
writeFileSync(join(here, "emplifi.html"), emplifiPage());
console.log("wrote index.html, alwaysgeeky.html, emplifi.html");

const pi = process.argv.indexOf("--publish");
if (pi > -1) {
  const out = process.argv[pi + 1];
  mkdirSync(out, { recursive: true });
  const relink = (html) => html.replaceAll(`${P1}/`, "lg/");
  for (const f of [
    "grammar.css",
    "projects.css",
    "opening.css",
    "motion.js",
    "register.js",
    "ag.js",
    "em.js",
    "media",
  ])
    cpSync(join(here, f), join(out, f), { recursive: true });
  for (const f of ["alwaysgeeky.html", "emplifi.html"])
    writeFileSync(join(out, f), relink(readFileSync(join(here, f), "utf8")));
  // P1's LedgerGuard pages, so the register's first row works inside the artifact.
  const p1 = join(here, P1);
  mkdirSync(join(out, "lg"), { recursive: true });
  for (const f of [
    "index.html",
    "ledgerguard.html",
    "workspace.html",
    "styles.css",
    "sequence.js",
    "case.js",
    "media",
  ])
    cpSync(join(p1, f), join(out, "lg", f), { recursive: true });
  // their ways back point at the P2 register, which is the published copy's root
  for (const f of ["index.html", "ledgerguard.html"])
    writeFileSync(
      join(out, "lg", f),
      readFileSync(join(p1, f), "utf8").replaceAll("../../p2-portability/prototype/", "../")
    );
  // The Artifact host wraps the main page in its own skeleton.
  const html = relink(readFileSync(join(here, "index.html"), "utf8"));
  const head = html
    .match(/<head>([\s\S]*?)<\/head>/)[1]
    .replace(/<meta charset[^>]*>\n|<meta name="viewport"[^>]*>\n/g, "");
  const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
  writeFileSync(join(out, "index.html"), `${head}\n${body}`);
  console.log(`published copy in ${out}`);
}
