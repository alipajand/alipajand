// Builds the "Section A-A" cinematic prototype from data/projects.ts.
//
//   node docs/design/portfolio-redesign/cinematic-exploration/prototype/build.mjs [--publish <dir>]
//
// Writes index.html (opening, transformation, LedgerGuard sequence, navigation) and
// ledgerguard.html (the readable case study) next to this file. Every project fact is read from
// data/projects.ts; the only new copy is marked NEW in the constants below and needs owner approval.
// --publish also writes a copy whose index.html has no document skeleton, for the Artifact host.

import { mkdirSync, readFileSync, writeFileSync, cpSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PROJECTS } from "../../../../../data/projects.ts";
import * as draw from "./drawings.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const lg = PROJECTS.find((p) => p.slug === "ledgerguard");
const cs = lg.caseStudy;
const layers = cs.diagrams.find((d) => d.spec.type === "layers").spec.layers;
const compare = cs.diagrams.find((d) => d.spec.type === "compare").spec;

const SITE = "https://alipajand.com";
// The P2 register is the portfolio index for the whole drawing set. Every way back from these
// pages lands on LedgerGuard's row there; the other featured sheets are P2 pages.
const P2 = "../../p2-portability/prototype";
const REGISTER = `${P2}/index.html`;
const BACK = `${REGISTER}#project-ledgerguard`;
const PROFILE = {
  name: "Ali Pajand",
  role: "Senior Software Engineer",
  focus: "Frontend architecture, design systems, and full-stack product work",
  stack: ["React", "TypeScript", "Next.js", "Node.js"],
  location: "Montreal, Canada",
  experience: "9+ years",
  availability: "Open to remote work within Canada",
  languages: "English: professional. French: intermediate.",
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
// NEW copy, for owner approval.
const THESIS = "The interface, and the work behind it.";
const SEQUENCE_NOTE = "Five layers and one review boundary. Scroll, or pick a layer.";
// LedgerGuard is presented as independent product work. data/projects.ts lists its role as
// "Senior Product Engineer"; the prototype does not print that as a title (owner decision).
const LG_ROLE = "Independent product · designed and built end to end";

const TIER = {
  ledgerguard: "Featured",
  alwaysgeeky: "Featured",
  emplifi: "Featured",
  "agent-tooling": "Supporting",
  tallyfolio: "Supporting",
  controltech: "Supporting",
  mapbylaw: "Experiment",
};

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// The 90% coverage figure has no established source yet (owner decision 5). The public
// experience omits it; the verification note lives in the internal docs only.
const unsupported = (s) => /\b\d+(\.\d+)?%/.test(s);

const FONTS =
  "https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Instrument+Sans:wght@400;500;600&family=Martian+Mono:wght@400;500&display=swap";
const GSAP = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5";

// Resolves the motion mode before first paint. A stored choice records the OS setting it was
// made under: "Motion on" chosen while the OS asked for reduced motion stays on, but a choice
// made before the OS switched to reduced motion does not override it.
// On the sequence page it also lays out the animated version before first paint, so nothing
// shifts when the timeline arrives. It is provisional: sequence.js adds .motion-ready once
// GSAP and the timeline are confirmed, and if that has not happened by the load event (a
// script failed or was blocked), the static layout comes back.
const PROVISIONAL = `if(m==="full"){r.classList.add("motion-live");addEventListener("load",function(){if(r.classList.contains("motion-ready"))return;r.classList.remove("motion-live");var t=location.hash&&document.getElementById(decodeURIComponent(location.hash.slice(1)));if(t)t.scrollIntoView()})}`;
// Depth: the flat 2D section is the default everywhere. The stacked 3D anatomy is an
// exploration that has only been seen to render in Chromium, so it runs only on request
// (?depth=3d); no browser detection stands in for a capability check.
const DEPTH = `if(!/[?&]depth=3d/.test(location.search))r.classList.add("depth-flat");`;
const boot = (live) =>
  `<script>(function(){var r=document.documentElement,q=matchMedia("(prefers-reduced-motion: reduce)"),s=null;try{s=JSON.parse(localStorage.getItem("aa-motion2")||"null")}catch(e){}var os=q.matches?"reduce":"full",m=os;if(s&&(s.m==="full"||s.m==="reduce")){if(os==="full")m=s.m;else if(s.os==="reduce")m=s.m}r.dataset.motion=m;r.classList.add("js");var n=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];if((n&&n.type==="back_forward")||location.hash)r.classList.add("returning");${DEPTH}${live ? PROVISIONAL : ""}})();</script>`;

const shell = ({ title, description, body, scripts = "", live = false }) => `<!doctype html>
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
<link rel="stylesheet" href="styles.css">
</head>
<body>
${body}
${scripts}
</body>
</html>
`;

// The case study is one link away on every screen: the bar carries it, and the first Tab
// reaches a skip link to the readable story.
const nav = (
  page
) => `<a class="skip" href="${page === "index" ? "#project-ledgerguard" : "#main"}">${page === "index" ? "Skip to the LedgerGuard story" : "Skip to content"}</a>
<header class="bar" data-bar>
  <a class="bar__mark" href="${REGISTER}" aria-label="Ali Pajand, portfolio register"><span class="bar__ap" aria-hidden="true">A—A</span> <span class="bar__name">Ali Pajand</span></a>
  <nav class="bar__nav" aria-label="Site">
    <a href="${BACK}">Work</a>
    ${page === "index" ? `<a href="ledgerguard.html">Case study</a>` : `<a href="index.html">Scene</a>`}
    <a href="#contact">Contact</a>
    <button type="button" class="bar__motion" data-motion-toggle aria-pressed="true"><span class="bar__dot" aria-hidden="true"></span><span data-motion-label>Motion on</span></button>
  </nav>
</header>`;

/* ---------- shared pieces ---------- */

const PROTO = "Design prototype · fictional data";
const media = (name) =>
  `src="media/${name}-1600.webp" srcset="media/${name}-960.webp 960w, media/${name}-1600.webp 1600w"`;

// The shipped dashboard, drawn as sheet LG-01: the screenshot plus its title strip. The same
// markup is the top sheet of the stack, the story figure and the case-study hero, so the one
// image can carry across the match cut and the view transition at the same proportions.
const LG01_ALT = cs.interfaceEvidence[2].alt;
const sheetInner = (sizes, alt, lazy) => `<div class="sheet__in">
    <img ${media("ledgerguard-dashboard")} sizes="${sizes}" width="1600" height="1034" alt="${alt ? esc(LG01_ALT) : ""}"${lazy ? ' loading="lazy"' : ""} decoding="async">
    <span class="sheet__strip"><b>LG-01</b> <span>Next.js App Router product</span> <em>Screenshot · shipped product</em></span>
  </div>`;

/* ---------- the stack (desktop, motion on) ---------- */

const plate = (n, inner, cls = "") =>
  `<div class="plate ${cls}" data-plate="${n}" style="--k:${n}">${inner}</div>`;

const stack = () => `<div class="rig" data-rig>
  <div class="floor"></div>
  ${plate(5, draw.worker(), "plate--draw")}
  ${plate(4, draw.jobs(), "plate--draw")}
  ${plate(3, draw.data(), "plate--draw")}
  ${plate(2, draw.api(), "plate--draw")}
  ${plate(1, sheetInner("(min-width: 900px) 125vw, 300vw", false, false), "plate--shot sheet")}
  <div class="boundary" data-boundary><span>Review boundary</span></div>
</div>`;

/* ---------- the section (static figure everywhere, the stage on narrow screens) ---------- */

// A two-dimensional section through the five layers: each layer is a band, and the review
// boundary is the red line through all of them, suggested values on its left and confirmed
// values on its right. Band LG-01 holds the shipped screenshot; the rest are hatched as
// materials are on a drawn section.
const strata = (
  variant
) => `<div class="strata strata--${variant}" data-strata="${variant}"${variant === "stage" ? ' aria-hidden="true"' : ""}>
  <p class="strata__sides" aria-hidden="true"><span>Suggested</span><span>Confirmed</span></p>
  <ol class="strata__bands" role="list">
    ${layers
      .map(
        (l, i) =>
          `<li class="stratum" data-k="${i + 1}"><span class="stratum__k"><b>LG-0${i + 1}</b> ${esc(l.label)}</span><span class="stratum__body">${
            i === 0
              ? `<span class="stratum__shot" data-band-shot>${variant === "static" ? `<img src="media/ledgerguard-dashboard-960.webp" width="960" height="620" alt="" loading="lazy" decoding="async">` : ""}</span>`
              : ""
          }</span></li>`
      )
      .join("")}
  </ol>
  <span class="strata__line" data-strata-line><i>A–A · Review boundary</i></span>
</div>`;

/* ---------- the review boundary in the product ---------- */

// The Document Intelligence Workspace design prototype (workspace.html, a local copy).
// Captures are of that prototype with fictional data.
const WS_STATES = [
  {
    key: "ready",
    label: "Ready for review",
    count: "0 of 13 terms confirmed",
    tally: 0,
    msg: "0 of 13 terms confirmed. Review required.",
  },
  {
    key: "partial",
    label: "Partially reviewed",
    count: "6 of 13 terms confirmed",
    tally: 6,
    msg: "6 of 13 terms confirmed. 7 await review.",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    count: "13 of 13 terms confirmed",
    tally: 13,
    msg: "13 of 13 terms confirmed. Review complete.",
  },
];
const wsAlt = (st) =>
  `Design prototype of the LedgerGuard Document Intelligence Workspace with fictional data, ${st.label.toLowerCase()}: ${st.count}. Extracted terms on the left, the contract on the right.`;
const wsImgs = (sizes, alt) =>
  WS_STATES.map(
    (st) =>
      `<img data-ws-img="${st.key}" ${media("proto-workspace-" + st.key)} sizes="${sizes}" width="1600" height="1000" alt="${alt ? esc(wsAlt(st)) : ""}" loading="lazy" decoding="async">`
  ).join("");

// The visible consequence of each state: thirteen terms, filled as they are confirmed. The
// states are the prototype's, with fictional data, and the tally says so wherever it appears.
const tally = (cls) => `<div class="tally ${cls}" data-ws data-state="ready" aria-hidden="true">
  <span class="tally__k">Prototype state · fictional data</span>
  <span class="tally__ticks">${Array.from({ length: 13 }, () => "<i></i>").join("")}</span>
  <span class="tally__msg">${WS_STATES.map((st) => `<span data-ws-msg="${st.key}">${st.msg}</span>`).join("")}</span>
</div>`;

// On the stage: a sheet the red plane uncovers once it has risen through the stack.
const wsStage = `<div class="ws" data-ws data-state="ready" aria-hidden="true">
  <div class="ws__frame">${wsImgs("(min-width: 900px) 56vw, 380vw", false)}</div>
  <p class="ws__strip"><b>A–A</b> Document Intelligence Workspace <em>${PROTO}</em></p>
  ${tally("tally--stage")}
</div>`;

// NEW copy, for owner approval.
const WS_LEAD =
  "In the product, the line runs through the Document Intelligence Workspace. Terms on the left, the contract on the right: a person confirms, corrects, or flags each extracted term, and only then does it count.";
const WS_SHIPPED =
  "the suggested, verified and corrected statuses and their confirm, edit and needs-review actions; the notice deadline as term end minus notice days, verified only once both of those terms are confirmed or corrected.";
const WS_PROPOSED =
  "a separate Corrected chip, history and details as tabs, viewer zoom, and moving to the next term after a confirm.";

const boundaryWorkspace = `<div class="wsx" data-ws-card>
  <p>${WS_LEAD}</p>
  <figure class="wsx__fig" data-ws data-state="ready">
    <div class="ws__frame">${wsImgs("(min-width: 900px) 31rem, calc(100vw - 72px)", true)}</div>
    <figcaption><b>${PROTO}.</b> Not the shipped product.</figcaption>
  </figure>
  <div class="wsx__states" role="group" aria-label="Workspace review state">
    ${WS_STATES.map(
      (st, i) =>
        `<button type="button" data-ws-to="${st.key}" aria-pressed="${i === 0}" disabled aria-describedby="ws-live"><span>${st.label}</span><small>${st.count.replace(" terms", "")}</small></button>`
    ).join("")}
  </div>
  ${tally("tally--card")}
  <p class="wsx__live" id="ws-live" aria-live="polite" data-ws-live></p>
  <p class="wsx__src"><b>The prototype's notes list as shipped:</b> ${WS_SHIPPED} <b>Proposed, not built:</b> ${WS_PROPOSED} The prototype is drawn on that behaviour; it is not a recording of it.</p>
  <p><a class="wsx__open" href="workspace.html">Open the workspace prototype <span aria-hidden="true">→</span></a></p>
</div>`;

/* ---------- index ---------- */

const LAYER_SHORT = ["Interface", "API", "Data", "Jobs", "Worker"];

// The anatomy, in one place: every layer's fact is on the page at once. Picking a layer
// raises its sheet (or band) on the stage; scrolling marks each as its drawing inks in.
const anatomy = `<article class="beat step" id="anatomy" data-beat="anatomy" aria-labelledby="anatomy-h">
  <div class="step__card">
    <p class="step__code">LG-01 – LG-05 <span>Anatomy</span></p>
    <h3 id="anatomy-h">One product, five layers</h3>
    <ol class="ledger" role="list" data-ledger>
      ${layers
        .map(
          (l, i) =>
            `<li data-layer="${i + 1}"><button type="button" data-layer-to="${i + 1}" aria-pressed="false" disabled><b>LG-0${i + 1}</b> ${esc(LAYER_SHORT[i])}</button><p><span class="ledger__label">${esc(l.label)}.</span> ${esc(l.detail)}</p></li>`
        )
        .join("")}
    </ol>
    <figure class="figure figure--strata">
      ${strata("static")}
      <figcaption>LedgerGuard in section: the shipped product's screenshot in band LG-01, editorial bands for the four layers beneath it, and the review boundary cut through all five.</figcaption>
    </figure>
    <p class="step__src">LG-01 is a screenshot of the shipped product. LG-02 to LG-05 are editorial diagrams of its documented architecture.</p>
  </div>
</article>`;

const boundaryStep = `<article class="beat step" id="boundary" data-beat="boundary" aria-labelledby="boundary-h">
  <div class="step__card">
    <p class="step__code">A–A <span>Review boundary</span></p>
    <h3 id="boundary-h">${esc(compare.columns[1].label.replace("LedgerGuard ", "The "))}</h3>
    <p>${esc(cs.myRole[2])}</p>
    <ul class="step__list">${[compare.columns[1].items[0], compare.columns[1].items[1], compare.columns[1].items[4]].map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
    ${boundaryWorkspace}
  </div>
</article>`;

// The other sheets in the set: the two P2 featured sheets, then the register for the rest.
const others = [
  ...["alwaysgeeky", "emplifi"].map((slug, i) => {
    const p = PROJECTS.find((x) => x.slug === slug);
    return `<li><a href="${P2}/${slug}.html#case"><span class="reg__n">0${i + 2}</span><span class="reg__name">${esc(p.name)}</span><span class="reg__meta">${esc(TIER[slug])} · ${esc(p.role)} · ${esc(p.timeframe)}</span><span class="reg__go" aria-hidden="true">→</span></a></li>`;
  }),
  `<li><a href="${BACK}"><span class="reg__n">00</span><span class="reg__name">The register</span><span class="reg__meta">All seven projects, with supporting work and the experiment</span><span class="reg__go" aria-hidden="true">→</span></a></li>`,
];

const contact = `<footer class="contact" id="contact" aria-labelledby="contact-h" data-tone="void">
  <div class="contact__in">
    <h2 id="contact-h" class="contact__h">Contact</h2>
    <ul class="contact__links" role="list">
      ${CONTACT.map((c) => `<li><a href="${c.href}"><span>${c.label}</span><span class="contact__host">${c.host}</span></a></li>`).join("")}
    </ul>
    <p class="contact__meta">${esc(PROFILE.location)} · ${esc(PROFILE.availability)} · ${esc(PROFILE.languages)}</p>
    <p class="proto">Design prototype for the alipajand.com portfolio · Section A–A cinematic exploration · not production code.</p>
  </div>
</footer>`;

function indexPage() {
  const body = `${nav("index")}
<main id="top">
<section class="seq" id="sequence" aria-labelledby="name" data-tone="void">
  <div class="stage" data-stage>
    <h1 class="sr-only" id="name">${PROFILE.name}, ${PROFILE.role}</h1>
    <div class="interior" data-interior aria-hidden="true">
      <div class="void" data-void><div class="void__glow"></div></div>
      <div class="scene">${stack()}</div>
      ${strata("stage")}
      ${wsStage}
    </div>
    <i class="rest-probe" hidden></i>
    <div class="panel panel--top" data-panel="top" data-tone="paper">
      <div class="panel__head">
        <p class="eyebrow"><span>Section A–A</span> <span>Sheet 01</span></p>
        <p class="role">${PROFILE.role}</p>
        <p class="focus">${PROFILE.focus}</p>
      </div>
      <div class="name name--top" aria-hidden="true"><span>Ali</span> <span>Pajand</span></div>
      <div class="cutface cutface--top" aria-hidden="true"></div>
    </div>
    <div class="panel panel--bottom" data-panel="bottom" data-tone="paper">
      <div class="cutface cutface--bottom" aria-hidden="true"></div>
      <div class="name name--bottom" aria-hidden="true"><span>Ali</span> <span>Pajand</span></div>
      <div class="panel__foot">
        <p class="thesis">${THESIS}</p>
        <dl class="titleblock">
          <div><dt>Stack</dt><dd>${PROFILE.stack.join(" · ")}</dd></div>
          <div><dt>Experience</dt><dd>${PROFILE.experience}</dd></div>
          <div><dt>Based</dt><dd>${PROFILE.location}</dd></div>
          <div><dt>Availability</dt><dd>${PROFILE.availability}</dd></div>
          <div class="titleblock__cta"><dt>Contact</dt><dd><a href="${CONTACT[0].href}">${CONTACT[0].label}</a></dd></div>
        </dl>
      </div>
    </div>
    <div class="cut" aria-hidden="true">
      <span class="cut__mark cut__mark--l"><i>A</i></span>
      <span class="cut__line"></span>
      <span class="cut__mark cut__mark--r"><i>A</i></span>
    </div>
    <p class="aperture__tag" data-aperture-tag><b>LG-01</b> LedgerGuard · Screenshot · shipped product</p>
  </div>

  <div class="track">
    <div class="beat beat--open" data-beat="open"></div>
    <article class="beat step step--intro" id="work" data-beat="intro" aria-labelledby="work-h">
      <div class="step__card step__card--intro">
        <p class="step__code">Featured work · 01 of 03 <span>${esc(lg.timeframe)}</span></p>
        <h2 id="work-h" class="intro__name">${esc(lg.name)}</h2>
        <p class="intro__title">${esc(lg.caseStudyTitle)}</p>
        <p class="intro__meta">${LG_ROLE} · <a href="${lg.liveLinks[0].href}">ledgerguard.io</a></p>
        <p>${esc(cs.overview)}</p>
        <p class="intro__how">${SEQUENCE_NOTE} <a href="ledgerguard.html">Or read the case study</a>.</p>
      </div>
    </article>
    ${anatomy}
    ${boundaryStep}
    <div class="beat beat--land" data-beat="land"></div>
  </div>
</section>

<section class="story" id="project-ledgerguard" aria-labelledby="story-h" tabindex="-1" data-tone="paper">
  <div class="story__in">
    <figure class="story__shot">
      <div class="sheet" data-slot>${sheetInner("(min-width: 1100px) 700px, calc(100vw - 32px)", true, true)}</div>
      <figcaption><b>Screenshot.</b> ${esc(cs.interfaceEvidence[2].captionBody)}</figcaption>
    </figure>
    <header class="story__head">
      <p class="story__k">${esc(TIER.ledgerguard)} · 01 · ${esc(lg.timeframe)}</p>
      <h2 id="story-h" class="story__name"><span class="story__cut" aria-hidden="true"></span>${esc(lg.name)}</h2>
      <p class="story__title">${esc(lg.caseStudyTitle)}</p>
    </header>
    <div class="story__body">
      <p class="story__lede">${esc(lg.cardProblem)}</p>
      <ol class="story__notes" role="list">
        ${cs.technicalDecisions
          .map(
            (d, i) =>
              `<li><p class="note__k">Note ${i + 1}</p><p>${esc(d.decision)}</p><p class="note__trade"><span>Result</span> ${esc(d.result)}</p></li>`
          )
          .join("")}
      </ol>
      <p class="story__cta">
        <a class="cta" href="ledgerguard.html"><span>Read the LedgerGuard case study</span> <span aria-hidden="true">→</span></a>
        <a class="cta cta--quiet" href="${lg.liveLinks[0].href}">ledgerguard.io <span aria-hidden="true">↗</span></a>
      </p>
    </div>
  </div>
</section>

<section class="register" aria-labelledby="reg-h" data-tone="paper">
  <div class="register__in">
    <h2 id="reg-h" class="register__h">Other sheets in this set</h2>
    <p class="register__note">The next featured case studies, and the register of all seven projects.</p>
    <ol class="register__list" role="list">${others.join("")}</ol>
  </div>
</section>
</main>
${contact}`;
  return shell({
    title: "Section A–A Portfolio",
    description:
      "Ali Pajand portfolio, cinematic exploration: a cut through the name opens into the layers behind a shipped product.",
    body,
    live: true,
    scripts: `<script src="${GSAP}/gsap.min.js"></script>
<script src="${GSAP}/ScrollTrigger.min.js"></script>
<script src="sequence.js"></script>`,
  });
}

/* ---------- case study ---------- */

const list = (items) =>
  `<ul class="cs__list">${items
    .filter((i) => !unsupported(i))
    .map((i) => `<li>${esc(i)}</li>`)
    .join("")}</ul>`;

// Dashboard states from the LedgerGuard dashboard design prototype (fictional data).
const DB_STATES = [
  {
    key: "typical",
    label: "Typical workspace",
    alt: "deadlines grouped by notice window, verified and provisional totals kept apart",
  },
  { key: "loading", label: "Loading", alt: "skeletons in the shape of the final layout" },
  {
    key: "error",
    label: "Dashboard failed",
    alt: "an error that says nothing changed in the contracts, with Try again and Open Contracts",
  },
  {
    key: "empty",
    label: "New workspace",
    alt: "an empty state with one action, Upload your first contract",
  },
];

const protoFig = (name, label, alt, sizes) => `<figure class="cs__proto">
      <img ${media(name)} sizes="${sizes}" width="1600" height="1000" alt="Design prototype with fictional data, ${esc(alt)}" loading="lazy" decoding="async">
      <figcaption><b>${esc(label)}</b> ${PROTO}</figcaption>
    </figure>`;

// NEW copy, for owner approval.
const PROTO_INTRO =
  "Two of LedgerGuard's interactive design prototypes. They show designed states with fictional data, not screenshots of the shipped product. The workspace prototype's design notes separate shipped behaviour from proposals.";

const prototypes = `<p>${PROTO_INTRO}</p>
    <h3 class="cs__h3">Document Intelligence Workspace</h3>
    <div class="cs__protos cs__protos--3">${WS_STATES.map((st) => protoFig("proto-workspace-" + st.key, st.label + " · " + st.count, "the Document Intelligence Workspace, " + st.label.toLowerCase(), "(min-width: 1100px) 300px, calc(100vw - 32px)")).join("")}</div>
    <p><a href="workspace.html">Open the workspace prototype <span aria-hidden="true">→</span></a></p>
    <h3 class="cs__h3">Dashboard states</h3>
    <div class="cs__protos">${DB_STATES.map((st) => protoFig("proto-dashboard-" + st.key, st.label, "the dashboard, " + st.alt, "(min-width: 1100px) 450px, calc(100vw - 32px)")).join("")}</div>`;

function casePage() {
  const shots = cs.interfaceEvidence
    .filter((f) => !f.src.includes("dashboard"))
    .map((f) => {
      const key = f.src.replace("/portfolio-media/", "").replace(".png", "");
      return `<figure class="cs__shot">
      <img src="media/${key}-1600.webp" srcset="media/${key}-960.webp 960w, media/${key}-1600.webp 1600w" sizes="(min-width: 1100px) 900px, calc(100vw - 32px)" width="1600" height="1034" alt="${esc(f.alt)}" loading="lazy" decoding="async">
      <figcaption><b>Screenshot · ${esc(f.captionLead.replace(/\.$/, ""))}.</b> ${esc(f.captionBody)}</figcaption>
    </figure>`;
    })
    .join("");
  const sections = [
    ["context", "Context", `<p>${esc(cs.context)}</p>`],
    ["problem", "Problem", `<p>${esc(cs.problem)}</p>`],
    ["role", "My role", list(cs.myRole)],
    ["built", "What I built", list(cs.whatIBuilt)],
    [
      "decisions",
      "Technical decisions",
      cs.technicalDecisions
        .map(
          (
            d,
            i
          ) => `<article class="cs__note"><p class="note__k">Note ${i + 1}</p><h3>${esc(d.decision)}</h3>
        <dl><div><dt>Why</dt><dd>${esc(d.why)}</dd></div><div><dt>Trade-off</dt><dd>${esc(d.tradeOff)}</dd></div><div><dt>Result</dt><dd>${esc(d.result)}</dd></div></dl></article>`
        )
        .join(""),
    ],
    ["ux", "UX decisions", list(cs.uxDecisions)],
    ["evidence", "Interface evidence", shots],
    ["prototypes", "Design prototypes", prototypes],
    ["outcome", "Outcome", list(cs.outcome)],
    ["next", "What I would improve next", list(cs.nextImprovements)],
  ];
  const body = `${nav("case")}
<main id="main" tabindex="-1" class="cs">
  <header class="cs__head">
    <a class="cs__back" href="${BACK}"><span aria-hidden="true">←</span> Back to the work</a>
    <p class="story__k">${esc(TIER.ledgerguard)} · ${esc(lg.timeframe)} · Independent product</p>
    <h1 class="cs__name"><span class="story__cut story__cut--arrive" aria-hidden="true"></span>${esc(lg.name)}</h1>
    <p class="story__title">${esc(lg.caseStudyTitle)}</p>
    <p class="cs__lede">${esc(cs.overview)}</p>
    <dl class="titleblock titleblock--cs">
      <div><dt>Stack</dt><dd>${lg.capabilityTags.map(esc).join(" · ")}</dd></div>
      <div><dt>Live</dt><dd><a href="${lg.liveLinks[0].href}">ledgerguard.io</a></dd></div>
      <div><dt>Writing</dt><dd><a href="${SITE}${lg.relatedLinks[0].href}">${esc(lg.relatedLinks[0].label)}</a></dd></div>
    </dl>
  </header>
  <figure class="cs__hero">
    <div class="sheet">${sheetInner("(min-width: 1100px) 1040px, calc(100vw - 32px)", true, false)}</div>
    <figcaption><b>Screenshot · Dashboard.</b> ${esc(cs.interfaceEvidence[2].captionBody)}</figcaption>
  </figure>
  <div class="cs__grid">
    <nav class="cs__toc" aria-label="Sections"><ol>${sections.map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join("")}</ol></nav>
    <div class="cs__body">
      ${sections.map(([id, label, html]) => `<section id="${id}" aria-labelledby="${id}-h"><h2 id="${id}-h">${label}</h2>${html}</section>`).join("")}
      <p class="story__cta"><a class="cta" href="${BACK}"><span aria-hidden="true">←</span> <span>Back to the work</span></a> <a class="cta cta--quiet" href="${P2}/alwaysgeeky.html#case"><span>Next sheet: AlwaysGeeky Games</span> <span aria-hidden="true">→</span></a></p>
    </div>
  </div>
</main>
${contact}`;
  return shell({
    title: "LedgerGuard · Section A–A",
    description: lg.caseStudyMetaDescription,
    body,
    scripts: `<script src="case.js"></script>`,
  });
}

writeFileSync(join(here, "index.html"), indexPage());
writeFileSync(join(here, "ledgerguard.html"), casePage());
console.log("wrote index.html, ledgerguard.html");

const pi = process.argv.indexOf("--publish");
if (pi > -1) {
  const out = process.argv[pi + 1];
  mkdirSync(out, { recursive: true });
  for (const f of [
    "styles.css",
    "sequence.js",
    "case.js",
    "ledgerguard.html",
    "workspace.html",
    "media",
  ])
    cpSync(join(here, f), join(out, f), { recursive: true });
  // The Artifact host wraps the main page in its own skeleton.
  const html = readFileSync(join(here, "index.html"), "utf8");
  const head = html
    .match(/<head>([\s\S]*?)<\/head>/)[1]
    .replace(/<meta charset[^>]*>\n|<meta name="viewport"[^>]*>\n/g, "");
  const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
  writeFileSync(join(out, "index.html"), `${head}\n${body}`);
  console.log(`published copy in ${out}`);
}
