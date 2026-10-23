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
import { PROJECTS, PORTFOLIO_CASE_STUDY_ORDER } from "../../../../../data/projects.ts";
import * as draw from "./drawings.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const lg = PROJECTS.find((p) => p.slug === "ledgerguard");
const cs = lg.caseStudy;
const layers = cs.diagrams.find((d) => d.spec.type === "layers").spec.layers;
const compare = cs.diagrams.find((d) => d.spec.type === "compare").spec;
const [decApi, decRouter, decAsync] = cs.technicalDecisions;

const SITE = "https://alipajand.com";
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
const SEQUENCE_NOTE =
  "Five layers under one shipped product. Scroll down through them, or jump to a layer.";

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

// The 90% coverage figure has no established source yet (owner decision 5): never featured,
// muted and flagged where the case study prints it.
const txt = (s) =>
  /\b90%/.test(s)
    ? `<span class="pending">${esc(s)}</span> <span class="flag">Source pending</span>`
    : esc(s);

const FONTS =
  "https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Instrument+Sans:wght@400;500;600&family=Martian+Mono:wght@400;500&display=swap";
const GSAP = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5";

const BOOT = (seq) =>
  `<script${seq ? " data-seq" : ""}>(function(){var r=document.documentElement,s=null;try{s=localStorage.getItem("aa-motion")}catch(e){}r.dataset.motion=s||(matchMedia("(prefers-reduced-motion: reduce)").matches?"reduce":"full");r.classList.add("js");if(r.dataset.motion==="full"&&document.currentScript&&document.currentScript.dataset.seq!==undefined)r.classList.add("motion-live");var n=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];if((n&&n.type==="back_forward")||location.hash)r.classList.add("returning")})();</script>`;

const shell = ({ title, description, body, scripts = "" }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="color-scheme" content="light">
<link rel="icon" href="data:,">
${BOOT(scripts.includes("sequence.js"))}
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

const nav = (
  page
) => `<a class="skip" href="#${page === "index" ? "project-ledgerguard" : "main"}">${page === "index" ? "Skip the sequence" : "Skip to content"}</a>
<header class="bar" data-bar>
  <a class="bar__mark" href="${page === "index" ? "#top" : "index.html"}"><span class="bar__ap" aria-hidden="true">A—A</span> Ali Pajand</a>
  <nav class="bar__nav" aria-label="Site">
    <a href="${page === "index" ? "#work" : "index.html#work"}">Work</a>
    <a href="${page === "index" ? "#project-ledgerguard" : "index.html#project-ledgerguard"}" class="bar__skip">${page === "index" ? "Skip intro" : "Portfolio"}</a>
    <a href="#contact">Contact</a>
    <button type="button" class="bar__motion" data-motion-toggle aria-pressed="true"><span class="bar__dot" aria-hidden="true"></span><span data-motion-label>Motion on</span></button>
  </nav>
</header>`;

/* ---------- the stack ---------- */

const plate = (n, code, inner, cls = "") =>
  `<div class="plate ${cls}" data-plate="${n}" style="--k:${n}">${inner}</div>`;

const stack = (variant) => `<div class="rig" data-rig="${variant}">
  <div class="floor"></div>
  ${plate(5, "LG-05", draw.worker(), "plate--draw")}
  ${plate(4, "LG-04", draw.jobs(), "plate--draw")}
  ${plate(3, "LG-03", draw.data(), "plate--draw")}
  ${plate(2, "LG-02", draw.api(), "plate--draw")}
  ${plate(
    1,
    "LG-01",
    `<img src="media/ledgerguard-dashboard-1600.webp" srcset="media/ledgerguard-dashboard-960.webp 960w, media/ledgerguard-dashboard-1600.webp 1600w" sizes="(min-width: 768px) 62vw, 90vw" width="1600" height="1034" alt="" decoding="async">
     <span class="plate__strip"><b>LG-01</b> Next.js App Router product <em>Screenshot · shipped product</em></span>`,
    "plate--shot"
  )}
  <div class="boundary" data-boundary><span>Review boundary</span></div>
</div>`;

/* ---------- index ---------- */

const step = (
  id,
  n,
  layer,
  extra
) => `<article class="beat step" id="${id}" data-beat="${n}" aria-labelledby="${id}-h">
  <div class="step__card">
    <p class="step__code">${n === 5 ? "A–A" : "LG-0" + n} <span>${n === 5 ? "Review boundary" : "Layer " + n + " of 5"}</span></p>
    <h3 id="${id}-h">${esc(layer)}</h3>
    ${extra}
  </div>
</article>`;

const decisionNote = (d, label) => `<div class="note">
  <p class="note__k">${label}</p>
  <p>${esc(d.decision)}</p>
  <p class="note__trade"><span>Trade-off</span> ${esc(d.tradeOff)}</p>
</div>`;

const FIELDS = [
  { key: "notice", label: "Notice window" },
  { key: "renewal", label: "Renewal date" },
  { key: "autorenew", label: "Auto-renew" },
];

const boundaryDemo = `<fieldset class="demo" data-demo>
  <legend>Move a value across the line</legend>
  <p class="demo__note">A demonstration of the rule, drawn on sheet LG-03. Not product UI.</p>
  <ul class="demo__rows" role="list">
    ${FIELDS.map(
      (f) => `<li class="demo__row" data-row="${f.key}" data-state="suggested">
      <span class="demo__name">${f.label}</span>
      <span class="demo__state" data-state-label>Suggested by extraction</span>
      <button type="button" class="demo__btn" data-confirm="${f.key}" aria-describedby="demo-live">Confirm<span class="sr-only"> ${f.label.toLowerCase()}</span></button>
    </li>`
    ).join("")}
  </ul>
  <p class="demo__live" id="demo-live" aria-live="polite" data-demo-live>Three values suggested. None confirmed.</p>
  <button type="button" class="demo__reset" data-demo-reset>Reset</button>
</fieldset>`;

const others = PORTFOLIO_CASE_STUDY_ORDER.filter((s) => s !== "ledgerguard").map((slug, i) => {
  const p = PROJECTS.find((x) => x.slug === slug);
  return `<li><a href="${SITE}/portfolio/${slug}"><span class="reg__n">0${i + 2}</span><span class="reg__name">${esc(p.name)}</span><span class="reg__meta">${esc(TIER[slug])} · ${esc(p.role)}${p.timeframe ? " · " + esc(p.timeframe) : ""}</span><span class="reg__go" aria-hidden="true">↗</span></a></li>`;
});

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
    <h1 class="sr-only" id="name">${PROFILE.name}</h1>
    <div class="void" aria-hidden="true">
      <div class="void__glow"></div>
      <div class="scene">${stack("stage")}</div>
    </div>
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
    <nav class="layers" aria-label="LedgerGuard layers" data-layers>
      <p class="layers__k">LedgerGuard · sheets</p>
      <ol>
        <li><a href="#layer-interface" data-to="1"><b>01</b> Interface</a></li>
        <li><a href="#layer-api" data-to="2"><b>02</b> API</a></li>
        <li><a href="#layer-data" data-to="3"><b>03</b> Data</a></li>
        <li><a href="#layer-jobs" data-to="4"><b>04–05</b> Jobs</a></li>
        <li><a href="#layer-boundary" data-to="5"><b>A–A</b> Boundary</a></li>
      </ol>
    </nav>
  </div>

  <div class="track">
    <div class="beat beat--open" data-beat="open"></div>
    <article class="beat step step--intro" id="work" data-beat="intro" aria-labelledby="work-h">
      <div class="step__card step__card--intro">
        <p class="step__code">Featured work · 01 of 03 <span>${esc(lg.timeframe)}</span></p>
        <h2 id="work-h" class="intro__name">${esc(lg.name)}</h2>
        <p class="intro__title">${esc(lg.caseStudyTitle)}</p>
        <p class="intro__meta">${esc(lg.role)} · built alone · <a href="${lg.liveLinks[0].href}">ledgerguard.io</a></p>
        <p>${esc(cs.overview)}</p>
        <p class="intro__how">${SEQUENCE_NOTE}</p>
        <figure class="anatomy" aria-labelledby="anatomy-cap">
          <div class="anatomy__scene" aria-hidden="true">${stack("static")}</div>
          <figcaption id="anatomy-cap">LedgerGuard, exploded: a screenshot of the shipped product on top (LG-01), four editorial diagrams beneath it (LG-02 to LG-05), and the review boundary cutting through all of them.</figcaption>
        </figure>
      </div>
    </article>
    ${step(
      "layer-interface",
      1,
      layers[0].label,
      `<p>${esc(layers[0].detail)}</p>${decisionNote(decRouter, "Decision")}<p class="step__src">Sheet LG-01 is a screenshot of the shipped product.</p>`
    )}
    ${step("layer-api", 2, layers[1].label, `<p>${esc(layers[1].detail)}</p>${decisionNote(decApi, "Decision")}`)}
    ${step(
      "layer-data",
      3,
      layers[2].label,
      `<p>${esc(layers[2].detail)}</p><p>${esc(cs.context.split(". ").slice(1).join(". "))}</p>`
    )}
    ${step(
      "layer-jobs",
      4,
      `${layers[3].label} and ${layers[4].label}`,
      `<p>${esc(layers[3].detail)} ${esc(layers[4].detail)}</p>${decisionNote(decAsync, "Decision")}`
    )}
    ${step(
      "layer-boundary",
      5,
      compare.columns[1].label.replace("LedgerGuard ", "The "),
      `<p>${esc(cs.myRole[2])}</p><ul class="step__list">${compare.columns[1].items
        .slice(0, 2)
        .concat(compare.columns[1].items.slice(-1))
        .map((i) => `<li>${esc(i)}</li>`)
        .join("")}</ul>${boundaryDemo}`
    )}
    <div class="beat beat--collapse" data-beat="collapse"></div>
  </div>
</section>

<section class="story" id="project-ledgerguard" aria-labelledby="story-h" tabindex="-1">
  <div class="story__in">
    <header class="story__head">
      <p class="story__k">${esc(TIER.ledgerguard)} · 01 · ${esc(lg.timeframe)}</p>
      <h2 id="story-h" class="story__name"><span class="story__cut" aria-hidden="true"></span>${esc(lg.name)}</h2>
      <p class="story__title">${esc(lg.caseStudyTitle)}</p>
    </header>
    <figure class="story__shot">
      <img src="media/ledgerguard-dashboard-1600.webp" srcset="media/ledgerguard-dashboard-960.webp 960w, media/ledgerguard-dashboard-1600.webp 1600w" sizes="(min-width: 1100px) 760px, calc(100vw - 32px)" width="1600" height="1034" alt="${esc(cs.interfaceEvidence[2].alt)}" loading="lazy" decoding="async">
      <figcaption><b>Screenshot.</b> ${esc(cs.interfaceEvidence[2].captionBody)}</figcaption>
    </figure>
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

<section class="register" aria-labelledby="reg-h">
  <div class="register__in">
    <h2 id="reg-h" class="register__h">Other sheets in this set</h2>
    <p class="register__note">Not part of this prototype. These link to the current case studies on alipajand.com.</p>
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
    scripts: `<script src="${GSAP}/gsap.min.js"></script>
<script src="${GSAP}/ScrollTrigger.min.js"></script>
<script src="sequence.js"></script>`,
  });
}

/* ---------- case study ---------- */

const list = (items) =>
  `<ul class="cs__list">${items.map((i) => `<li>${txt(i)}</li>`).join("")}</ul>`;

function casePage() {
  const shots = cs.interfaceEvidence
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
    ["outcome", "Outcome", list(cs.outcome)],
    ["next", "What I would improve next", list(cs.nextImprovements)],
  ];
  const body = `${nav("case")}
<main id="main" tabindex="-1" class="cs">
  <header class="cs__head">
    <a class="cs__back" href="index.html#project-ledgerguard"><span aria-hidden="true">←</span> Back to the work</a>
    <p class="story__k">${esc(TIER.ledgerguard)} · ${esc(lg.timeframe)} · ${esc(lg.role)}</p>
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
    <img src="media/ledgerguard-dashboard-1600.webp" srcset="media/ledgerguard-dashboard-960.webp 960w, media/ledgerguard-dashboard-1600.webp 1600w" sizes="(min-width: 1100px) 1040px, calc(100vw - 32px)" width="1600" height="1034" alt="${esc(cs.interfaceEvidence[2].alt)}" decoding="async">
    <figcaption><b>Screenshot · Dashboard.</b> ${esc(cs.interfaceEvidence[2].captionBody)}</figcaption>
  </figure>
  <div class="cs__grid">
    <nav class="cs__toc" aria-label="Sections"><ol>${sections.map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join("")}</ol></nav>
    <div class="cs__body">
      ${sections.map(([id, label, html]) => `<section id="${id}" aria-labelledby="${id}-h"><h2 id="${id}-h">${label}</h2>${html}</section>`).join("")}
      <p class="story__cta"><a class="cta" href="index.html#project-ledgerguard"><span aria-hidden="true">←</span> <span>Back to the work</span></a></p>
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
  for (const f of ["styles.css", "sequence.js", "case.js", "ledgerguard.html", "media"])
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
