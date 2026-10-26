// Functional review of the P2 prototype: accessibility, keyboard, the opening and register, motion
// modes and their fail-safes, anchors, layout, provenance and factual guards, the match cuts,
// the LedgerGuard depth fallback, and a pass in WebKit and Firefox where they are installed.
//   node capture/review.mjs [outFile.json] [shotDir]
// Prints one line per check and writes the full results as JSON.
import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "./serve.mjs";

const here = dirname(fileURLToPath(import.meta.url));
// playwright-core and axe-core are deliberately not project dependencies: resolve them from NODE_PATH.
const req = createRequire(join(process.env.NODE_PATH ?? ".", "noop.js"));
const { chromium } = req("playwright-core");
const engines = process.env.ENGINES_NODE_PATH
  ? createRequire(join(process.env.ENGINES_NODE_PATH, "noop.js"))("playwright-core")
  : req("playwright-core");
const { webkit, firefox } = engines;
const AXE = readFileSync(req.resolve("axe-core/axe.min.js"), "utf8");
const out = process.argv[2] ?? join(here, "review-results.json");
const shots = process.argv[3] ?? join(here, "../screenshots/engines");
const PORT = 4418;
const BASE = `http://localhost:${PORT}`;
const P2 = "/p2-portability/prototype/";
const P1 = "/cinematic-exploration/prototype/";
const PAGES = ["index.html", "alwaysgeeky.html", "emplifi.html"];
const SCENES = ["alwaysgeeky.html", "emplifi.html"];
const GSAP = /gsap\.min\.js$/;
const TRIGGER = /ScrollTrigger\.min\.js$/;

const server = await serve(join(here, "../.."), PORT);
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const results = [];
// pass is true, false, or null for a check that could not run here (reported as SKIP)
const check = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  const tag = pass === null ? "SKIP" : pass ? "PASS" : "FAIL";
  console.log(`${tag}  ${name}${detail ? "  — " + detail : ""}`);
};

async function open(
  path,
  { width = 1440, height = 900, reduce = false, js = true, block = [], init, engine = browser } = {}
) {
  const ctx = await engine.newContext({
    viewport: { width, height },
    reducedMotion: reduce ? "reduce" : "no-preference",
    javaScriptEnabled: js,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("response", (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));
  for (const b of block) await page.route(b.url, b.with ?? ((r) => r.abort()));
  if (init) await page.addInitScript(init);
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  if (js) await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);
  return { ctx, page, errors };
}

const state = (page) =>
  page.evaluate(() => {
    const r = document.documentElement;
    const st = document.querySelector(".stage");
    return {
      live: r.classList.contains("motion-live"),
      ready: r.classList.contains("motion-ready"),
      motion: r.dataset.motion ?? null,
      stage: st ? getComputedStyle(st).display : null,
      figs: [...document.querySelectorAll(".step__fig")].filter(
        (f) => getComputedStyle(f).display !== "none"
      ).length,
      inlineTransforms: document.querySelectorAll('[style*="transform"]').length,
      height: r.scrollHeight,
    };
  });

async function axe(page) {
  await page.addScriptTag({ content: AXE });
  return page.evaluate(async () => {
    const r = await window.axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"],
      },
    });
    return r.violations.map((v) => `${v.id} (${v.impact}, ${v.nodes.length})`);
  });
}

const toEnd = (page) =>
  page.evaluate(() => {
    const s = document.querySelector("[data-scene]");
    scrollTo(0, s.offsetTop + s.offsetHeight - innerHeight);
  });

/* 1 · accessibility and console, every page, both motion modes */
for (const p of PAGES) {
  for (const reduce of [false, true]) {
    const mode = reduce ? "reduce" : "full";
    const { ctx, page, errors } = await open(P2 + p, { reduce });
    const v = await axe(page);
    check(`axe ${p} ${mode}`, v.length === 0, v.join("; "));
    check(`console ${p} ${mode}`, errors.length === 0, errors.join("; "));
    await ctx.close();
  }
}

/* 2 · keyboard: the skip link first, then every tab stop visible and outlined */
for (const p of PAGES) {
  for (const reduce of [false, true]) {
    const mode = reduce ? "reduce" : "full";
    const { ctx, page } = await open(P2 + p, { reduce });
    await page.keyboard.press("Tab");
    const first = await page.evaluate(() => ({
      href: document.activeElement.getAttribute("href"),
      text: document.activeElement.textContent.trim(),
    }));
    const target = p === "index.html" ? "#work" : "#case";
    check(`keyboard ${p} ${mode}: first Tab is the skip link`, first.href === target, first.text);
    const bad = [];
    let stops = 0;
    let rowLinks = 0;
    for (let i = 0; i < 80; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(40);
      const s = await page.evaluate(() => {
        const a = document.activeElement;
        if (!a || a === document.body) return null;
        const r = a.getBoundingClientRect();
        const cs = getComputedStyle(a);
        const after = getComputedStyle(a, "::after");
        const ring =
          cs.outlineStyle !== "none" ||
          (after.outlineStyle !== "none" && after.content !== "none") ||
          cs.boxShadow !== "none";
        return {
          id:
            a.tagName +
            (a.className ? "." + String(a.className).split(" ")[0] : "") +
            " " +
            a.textContent.trim().slice(0, 30),
          visible: r.width > 0 && r.bottom > 0 && r.top < innerHeight,
          ring,
          case: a.matches(".bay__name a, .srow__link"),
        };
      });
      if (!s) break;
      stops++;
      if (s.case) rowLinks++;
      if (!s.visible || !s.ring)
        bad.push(`${s.id}${s.visible ? "" : " (off screen)"}${s.ring ? "" : " (no ring)"}`);
    }
    check(
      `keyboard ${p} ${mode}: ${stops} tab stops on screen with a focus ring`,
      bad.length === 0,
      bad.slice(0, 4).join("; ")
    );
    if (p === "index.html")
      check(
        `keyboard index.html ${mode}: all seven case-study links are tab stops`,
        rowLinks === 7,
        `${rowLinks} of 7`
      );
    await ctx.close();
  }
}

/* 3 · the register: seven destinations, bay focus, discipline marks, live status, Escape */
{
  const { ctx, page } = await open(P2 + "index.html");
  const dest = await page.evaluate(() => ({
    featured: [...document.querySelectorAll(".bay__name a")].map((a) => a.getAttribute("href")),
    scenes: [...document.querySelectorAll(".bay__go")].map((a) => a.getAttribute("href")),
    pictures: [...document.querySelectorAll(".bay__sect")].map((a) => [
      a.getAttribute("href"),
      a.getAttribute("tabindex"),
      a.getAttribute("aria-hidden"),
    ]),
    order: [...document.querySelectorAll(".bay")].map((b) =>
      [...b.querySelectorAll('a[href]:not([tabindex="-1"])')].map((a) => a.className || "name")
    ),
    supporting: [...document.querySelectorAll(".sup .srow__link")].length,
    experiment: [...document.querySelectorAll(".exp .srow--exp .srow__link")].map((a) =>
      a.closest("[data-row]").getAttribute("data-row")
    ),
  }));
  check(
    "register: 3 featured case studies and scenes, 3 supporting, MapBylaw as the experiment",
    dest.featured.length === 3 &&
      dest.scenes.length === 3 &&
      dest.supporting === 3 &&
      dest.experiment.join() === "mapbylaw",
    JSON.stringify(dest)
  );
  check(
    "register: the picture repeats the case-study link, out of the tab order and hidden",
    dest.pictures.every(([h, t, a], i) => h === dest.featured[i] && t === "-1" && a === "true"),
    JSON.stringify(dest.pictures)
  );
  check(
    "register: in each bay the case study is the first tab stop, Scene the second",
    dest.order.every((o) => o.length === 2 && o[0] === "name" && o[1] === "bay__go"),
    JSON.stringify(dest.order)
  );
  const prom = await page.evaluate(() =>
    [...document.querySelectorAll(".bay")].map((b) => {
      const cs = b.querySelector(".bay__cs").getBoundingClientRect();
      const go = b.querySelector(".bay__go").getBoundingClientRect();
      const f = (e) => parseFloat(getComputedStyle(b.querySelector(e)).fontSize);
      return {
        cs: f(".bay__cs"),
        go: f(".bay__go"),
        csH: Math.round(cs.height),
        goH: Math.round(go.height),
      };
    })
  );
  check(
    "register: the case-study action is at least as prominent as Scene",
    prom.every((b) => b.cs >= b.go),
    JSON.stringify(prom[0])
  );
  await page.hover('.bay[data-row="emplifi"] .bay__sect');
  await page.waitForTimeout(350);
  const dim = await page.evaluate(() =>
    [...document.querySelectorAll(".bay")].map((b) => [
      b.dataset.row,
      +getComputedStyle(b.querySelector(".bay__below .drawing")).opacity,
    ])
  );
  const em = dim.find(([r]) => r === "emplifi")[1];
  check(
    "register: pointing at a bay quiets the other two (hover is an enhancement only)",
    dim.every(([r, o]) => r === "emplifi" || o < em),
    JSON.stringify(dim)
  );
  await page.mouse.move(0, 0);
  await page.focus('[data-cap-to="systems"]');
  await page.keyboard.press("Enter");
  await page.waitForTimeout(200);
  const marked = await page.evaluate(() => ({
    pressed: document.querySelector('[data-cap-to="systems"]').getAttribute("aria-pressed"),
    matches: [...document.querySelectorAll(".is-match")].map((r) => r.dataset.row),
    status: document.querySelector("[data-cap-status]").textContent,
    col: document.querySelectorAll('.sched__table .is-col[data-col="systems"]').length,
  }));
  check(
    "register: Design systems marks AlwaysGeeky and Emplifi, in the bays and the schedule",
    marked.pressed === "true" &&
      marked.matches.join() === "alwaysgeeky,emplifi" &&
      marked.col === 8,
    JSON.stringify(marked.matches) + " col cells " + marked.col
  );
  check(
    "register: the status line names the marked projects",
    /2 projects marked, AlwaysGeeky Games, Emplifi\./.test(marked.status),
    marked.status
  );
  const live = await page.evaluate(() =>
    document.querySelector("[data-cap-status]").getAttribute("aria-live")
  );
  check("register: the status line is a polite live region", live === "polite");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  const cleared = await page.evaluate(
    () => !document.querySelector(".reg").dataset.cap && !document.querySelector(".is-match")
  );
  check("register: Escape clears the marks", cleared);
  await ctx.close();
}

/* 3b · the opening: pinned condensation with motion, one static column without. The
   condensation is transforms and clipping only: nothing after the opening moves. */
for (const [w, h] of [
  [1440, 900],
  [390, 844],
]) {
  const { ctx, page } = await open(P2 + "index.html", {
    width: w,
    height: h,
    init: () => {
      window.__cls = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    },
  });
  const r = await page.evaluate(async () => {
    const sect = document.querySelector("[data-sect]");
    const above = sect.querySelector(".bay__above");
    const below = sect.querySelector(".bay__below");
    const inset = (el) => (getComputedStyle(el).clipPath.match(/[\d.]+px/g) || []).map(parseFloat);
    // the height of the section a reader sees: transforms plus clipping
    const seen = () => {
      const t = above.getBoundingClientRect().top + (inset(above)[0] || 0);
      const bt = below.getBoundingClientRect().bottom - (inset(below)[2] || 0);
      return Math.round(bt - t);
    };
    const doc = (sel) =>
      Math.round(document.querySelector(sel).getBoundingClientRect().top + scrollY);
    const t = ScrollTrigger.getAll()[0];
    // the upper datum sits wholly above the cut, the lower one below it
    const cut = sect.querySelector(".bay__cut").getBoundingClientRect();
    const up = sect.querySelector(".datum--up").getBoundingClientRect();
    const down = sect.querySelector(".datum--down").getBoundingClientRect();
    const a = {
      // (on a phone they are a legend above the bays instead)
      datums:
        getComputedStyle(sect.querySelector(".datum--up")).position !== "absolute" ||
        (up.bottom <= cut.top + 1 && down.top >= cut.bottom - 1),
      live: document.documentElement.classList.contains("op-live"),
      h: seen(),
      briefs0: doc(".briefs"),
      page0: document.documentElement.scrollHeight,
      cls0: window.__cls,
    };
    for (let y = 0; y <= t.end + 200; y += 60) {
      scrollTo(0, y);
      await new Promise((d) => requestAnimationFrame(() => requestAnimationFrame(d)));
    }
    scrollTo(0, t.end);
    await new Promise((d) => setTimeout(d, 900));
    const briefs = document.querySelector(".briefs").getBoundingClientRect().top;
    const stage = document.querySelector("[data-op-stage]").getBoundingClientRect().bottom;
    const layoutStyles = [...document.querySelectorAll("[data-op] [style]")].filter((e) =>
      /margin|(^|;\s*)(min-|max-)?height|padding/.test(e.getAttribute("style"))
    ).length;
    return {
      ...a,
      end: Math.round(t.end),
      condensed: seen(),
      gap: Math.round(briefs - stage),
      briefs1: doc(".briefs"),
      page1: document.documentElement.scrollHeight,
      layoutStyles,
      cls: +window.__cls.toFixed(4),
    };
  });
  check(
    `opening ${w}px: pins, condenses the bays and keeps the register attached`,
    r.live && r.condensed < r.h && r.gap >= 0 && r.gap <= 40,
    JSON.stringify({ h: r.h, condensed: r.condensed, gap: r.gap, end: r.end })
  );
  check(`opening ${w}px: the datums sit either side of the cut, not on it`, r.datums);
  check(
    `opening ${w}px: condensation moves nothing after it (layout fixed, CLS ${r.cls})`,
    r.briefs0 === r.briefs1 && r.page0 === r.page1 && r.layoutStyles === 0 && r.cls <= 0.1,
    JSON.stringify({
      briefs: [r.briefs0, r.briefs1],
      page: [r.page0, r.page1],
      layoutStyles: r.layoutStyles,
      cls: r.cls,
    })
  );
  await ctx.close();
}
/* 3c · return links land on the project in the register, past the condensation */
for (const [w, h] of [
  [1440, 900],
  [390, 844],
]) {
  for (const slug of ["ledgerguard", "alwaysgeeky", "emplifi"]) {
    const { ctx, page } = await open(P2 + "index.html#project-" + slug, { width: w, height: h });
    const r = await page.evaluate(() => {
      const el = document.getElementById(location.hash.slice(1));
      const box = el.getBoundingClientRect();
      const t = ScrollTrigger.getAll()[0];
      return {
        top: Math.round(box.top),
        bottom: Math.round(box.bottom),
        y: Math.round(scrollY),
        end: Math.round(t.end),
      };
    });
    check(
      `anchor index.html#project-${slug} ${w}px: the project is on screen, opening condensed`,
      r.top >= 0 && r.top < h && r.y >= r.end - 2,
      JSON.stringify(r)
    );
    await ctx.close();
  }
}
for (const [w, h] of [
  [1440, 900],
  [390, 844],
]) {
  const { ctx, page } = await open(P2 + "index.html", { width: w, height: h, reduce: true });
  const r = await page.evaluate(() => ({
    live: document.documentElement.classList.contains("op-live"),
    height: document.documentElement.scrollHeight,
    inline: document.querySelectorAll('[style*="transform"]').length,
  }));
  check(
    `opening ${w}px reduced: static, no transforms${w < 600 ? ", page under 4,200 px" : ""}`,
    !r.live && r.inline === 0 && (w > 600 || r.height < 4200),
    JSON.stringify(r)
  );
  await ctx.close();
}

/* 4 · without script: everything is a plain link, a plain table and readable steps */
{
  const { ctx, page } = await open(P2 + "index.html", { js: false });
  const r = await page.evaluate(() => ({
    rows: document.querySelectorAll(".bay__name a[href], .srow__link[href]").length,
    caps: [...document.querySelectorAll(".cap")].filter(
      (b) => getComputedStyle(b).display !== "none"
    ).length,
    table: document.querySelectorAll(".sched__table tbody tr").length,
  }));
  check(
    "no script: 7 case-study links, no dead controls, full schedule",
    r.rows === 7 && r.caps === 0 && r.table === 7,
    JSON.stringify(r)
  );
  await ctx.close();
  for (const p of SCENES) {
    const { ctx, page } = await open(P2 + p, { js: false });
    const s = await state(page);
    check(
      `no script ${p}: stage hidden, every step figure shown`,
      s.stage === "none" && s.figs >= (p === "alwaysgeeky.html" ? 3 : 4) && !s.live,
      JSON.stringify(s)
    );
    await ctx.close();
  }
}

/* 5 · motion modes and fail-safes on the scenes */
for (const p of SCENES) {
  {
    const { ctx, page } = await open(P2 + p);
    const s = await state(page);
    check(
      `motion ${p}: live and confirmed`,
      s.live && s.ready && s.stage === "block" && s.figs === 0,
      JSON.stringify(s)
    );
    await ctx.close();
  }
  {
    const { ctx, page } = await open(P2 + p, { reduce: true });
    const s = await state(page);
    check(
      `reduced ${p}: static steps, no inline transforms`,
      !s.live &&
        s.motion === "reduce" &&
        s.figs >= (p === "alwaysgeeky.html" ? 3 : 4) &&
        s.inlineTransforms === 0,
      JSON.stringify(s)
    );
    await page.click("[data-motion-toggle]");
    await page.waitForTimeout(500);
    const on = await state(page);
    await page.click("[data-motion-toggle]");
    await page.waitForTimeout(500);
    const off = await state(page);
    check(
      `reduced ${p}: the toggle turns the scene on and off cleanly`,
      on.live && on.ready && !off.live && off.inlineTransforms === 0,
      `on ${on.live}/${on.ready}, off ${off.live}, transforms ${off.inlineTransforms}`
    );
    await ctx.close();
  }
  for (const [label, block] of [
    ["GSAP blocked", [{ url: GSAP }]],
    ["ScrollTrigger blocked", [{ url: TRIGGER }]],
    [
      "scene script blocked",
      [{ url: new RegExp(p === "alwaysgeeky.html" ? "ag\\.js$" : "em\\.js$") }],
    ],
    [
      "timeline throws mid-build",
      [
        {
          url: GSAP,
          with: async (route) => {
            const res = await route.fetch();
            const body =
              (await res.text()) +
              ';(function(){var t=gsap.timeline;var n=0;gsap.timeline=function(){var tl=t.apply(this,arguments);var to=tl.to;tl.to=function(){if(++n>6)throw new Error("injected");return to.apply(this,arguments)};return tl}})();';
            route.fulfill({ response: res, body });
          },
        },
      ],
    ],
  ]) {
    const { ctx, page } = await open(P2 + p, { block });
    const s = await state(page);
    const visible = await page.evaluate(
      () =>
        getComputedStyle(document.querySelector("#case")).visibility === "visible" &&
        getComputedStyle(document.querySelector("[data-slot] .slot-media")).visibility === "visible"
    );
    check(
      `fail-safe ${p}: ${label} leaves the static page`,
      !s.live &&
        !s.ready &&
        s.figs >= (p === "alwaysgeeky.html" ? 3 : 4) &&
        s.inlineTransforms === 0 &&
        visible,
      JSON.stringify(s)
    );
    await ctx.close();
  }
}

/* 5b · narrow screens: no pinned stage below 900 px; phone sheets below 768 px */
for (const p of SCENES) {
  for (const [w, h] of [
    [390, 844],
    [820, 1100],
  ]) {
    const { ctx, page } = await open(P2 + p, { width: w, height: h });
    const s = await state(page);
    const f = await page.evaluate(() => {
      const shown = (sel) =>
        [...document.querySelectorAll(sel)].filter((e) => getComputedStyle(e).display !== "none")
          .length;
      return { phone: shown(".fig-p"), wide: shown(".fig-w") };
    });
    const want = w < 768 ? f.phone >= 3 && f.wide === 0 : f.wide >= 3 && f.phone === 0;
    check(
      `narrow ${p} ${w}px: motion on, no stage, ${w < 768 ? "phone sheets" : "wide drawings"} in the steps`,
      s.live && s.stage === "none" && s.figs >= (p === "alwaysgeeky.html" ? 3 : 4) && want,
      JSON.stringify({ ...f, stage: s.stage, figs: s.figs })
    );
    await ctx.close();
  }
  // every label in a phone sheet reads at 12 px or more and stays on its sheet
  for (const w of [360, 390, 430]) {
    const { ctx, page } = await open(P2 + p, { width: w, height: 800, reduce: true });
    const r = await page.evaluate(() => {
      const out = { min: 99, small: [], over: [] };
      document.querySelectorAll(".step__fig svg text").forEach((t) => {
        if (!t.getClientRects().length) return;
        const svg = t.ownerSVGElement;
        const k = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
        const px = parseFloat(getComputedStyle(t).fontSize) * k;
        out.min = Math.min(out.min, +px.toFixed(1));
        if (px < 12) out.small.push(t.textContent.slice(0, 24) + "=" + px.toFixed(1));
        const bb = t.getBBox();
        if (bb.x < 2 || bb.x + bb.width > svg.viewBox.baseVal.width - 2)
          out.over.push(t.textContent.slice(0, 30));
      });
      return out;
    });
    check(
      `phone labels ${p} ${w}px: smallest ${r.min} px, none under 12 px, none past the sheet`,
      r.small.length === 0 && r.over.length === 0,
      [...r.small, ...r.over].slice(0, 4).join("; ")
    );
    await ctx.close();
  }
}

/* 6 · anchors and the match cut (the match cut runs from 900 px up) */
for (const p of SCENES) {
  {
    const { ctx, page } = await open(P2 + p + "#case");
    const r = await page.evaluate(() => ({
      top: Math.round(document.getElementById("case").getBoundingClientRect().top),
      landed: document.documentElement.hasAttribute("data-landed"),
      slot: getComputedStyle(document.querySelector("[data-slot] .slot-media")).visibility,
    }));
    check(
      `anchor ${p}#case: the case study is at the top, hero shown`,
      Math.abs(r.top) <= 2 && r.landed && r.slot === "visible",
      JSON.stringify(r)
    );
    await ctx.close();
  }
  for (const [w, h] of [[1440, 900]]) {
    const { ctx, page } = await open(P2 + p, { width: w, height: h });
    await toEnd(page);
    await page.waitForTimeout(1600);
    const r = await page.evaluate(() => {
      const a = document.querySelector("[data-vt-subject]").getBoundingClientRect();
      const b = document.querySelector("[data-slot] .slot-media").getBoundingClientRect();
      return {
        landed: document.documentElement.hasAttribute("data-landed"),
        dx: Math.abs(a.left - b.left),
        dy: Math.abs(a.top - b.top),
        dw: Math.abs(a.width - b.width),
      };
    });
    check(
      `match cut ${p} ${w}px: the subject lands on the hero within 2 px`,
      r.landed && r.dx <= 2 && r.dy <= 2 && r.dw <= 2,
      JSON.stringify(r)
    );
    await ctx.close();
  }
}

/* 7 · layout: no sideways scroll at any width, in either mode */
for (const p of PAGES) {
  for (const width of [320, 390, 768, 1024, 1440]) {
    for (const reduce of [false, true]) {
      const { ctx, page } = await open(P2 + p, { width, height: 844, reduce });
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      if (sw > width)
        check(
          `layout ${p} ${width}px ${reduce ? "reduce" : "full"}: no sideways scroll`,
          false,
          `${sw}px`
        );
      await ctx.close();
    }
  }
}
check(
  "layout: no sideways scroll on any page at 320–1440 px, both modes",
  !results.some((r) => r.name.startsWith("layout ") && r.pass === false)
);

/* 8 · provenance and factual guards */
{
  const texts = {};
  for (const p of PAGES) {
    const { ctx, page } = await open(P2 + p, { js: false });
    texts[p] = await page.evaluate(() => {
      const strips = [...document.querySelectorAll("figcaption.strip, .drawing .strip")].map(
        (s) => s.textContent
      );
      return {
        body: document.body.innerText,
        drawn: [...document.querySelectorAll(".drawing, .step__h, .step__k")]
          .map((d) => d.textContent)
          .join(" "),
        imgs: [...document.querySelectorAll("img")].map((i) => i.getAttribute("src")),
        figs: [...document.querySelectorAll("figure")].filter(
          (f) => !f.querySelector(".strip, .drawing")
        ).length,
        strips,
      };
    });
    await ctx.close();
  }
  const pct = Object.entries(texts)
    .filter(([, t]) => /\b\d+(\.\d+)?%/.test(t.body))
    .map(([p]) => p);
  check(
    "facts: no percentage figure on any page (80% and 90% never shown)",
    pct.length === 0,
    pct.join(", ")
  );
  check(
    "provenance: every figure carries a sheet strip or is a labelled drawing",
    Object.values(texts).every((t) => t.figs === 0),
    JSON.stringify(Object.fromEntries(Object.entries(texts).map(([p, t]) => [p, t.figs])))
  );
  check(
    "Emplifi: no raster image anywhere on the sheet",
    texts["emplifi.html"].imgs.length === 0,
    texts["emplifi.html"].imgs.join(", ")
  );
  const agImgs = texts["alwaysgeeky.html"].imgs.filter(
    (s) => !/^media\/ag-(marketplace|login|detail-listing)/.test(s)
  );
  check(
    "AlwaysGeeky: only crops of the two shipped screenshots",
    agImgs.length === 0,
    agImgs.join(", ")
  );
  check(
    "AlwaysGeeky: no Storybook screen is claimed",
    /(not a|nothing here is a) Storybook screen/.test(texts["alwaysgeeky.html"].body) &&
      !/Storybook screenshot/i.test(texts["alwaysgeeky.html"].body)
  );
  const all = Object.values(texts)
    .map((t) => t.body)
    .join("\n");
  check("facts: the word proprietary is not used", !/proprietary/i.test(all));
  const em = texts["emplifi.html"].body;
  check(
    "Emplifi: every 16.7 ms is called a reference, never a measurement",
    /16\.7 ms/.test(em) &&
      (em.match(/16\.7 ms/g) || []).length <=
        (em.match(/reference/gi) || []).length + (em.match(/60 Hz/g) || []).length &&
      /not a measurement/.test(em),
    `${(em.match(/16\.7 ms/g) || []).length} mentions`
  );
  // the drawings and scene headings; the case study's own published wording is left as it is
  check(
    "Emplifi: no before/after, reduction or speed-up wording in any drawing or heading",
    !/\bbefore\b|\bafter\b|\breduc(e|ed|tion)\b|\bfaster\b|\bsaved?\b/i.test(
      texts["emplifi.html"].drawn
    )
  );
  const ag = texts["alwaysgeeky.html"].body;
  check(
    "AlwaysGeeky: the Voxies relation and the July 2026 closure are stated",
    /makes Voxies/.test(ag) && /closed in July 2026/.test(ag)
  );
  const kinds = Object.values(texts).flatMap((t) => t.strips);
  const unlabelled = kinds.filter(
    (k) => !/(Screenshot|Editorial diagram|Design prototype|No screenshot)/i.test(k)
  );
  check(
    "provenance: every strip names its material",
    unlabelled.length === 0,
    unlabelled.slice(0, 3).join(" | ")
  );
}

/* 9 · red belongs to the A–A mark, the focus ring and LedgerGuard only */
for (const p of SCENES) {
  const { ctx, page } = await open(P2 + p);
  const reds = await page.evaluate(() => {
    const hits = [];
    const isRed = (c) => /rgb\(200, 50, 27\)|rgb\(240, 87, 60\)|rgb\(168, 38, 15\)/.test(c);
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      const used = [cs.color, cs.backgroundColor, cs.borderTopColor, cs.fill, cs.stroke].some(
        isRed
      );
      if (used && !el.closest(".bar__ap, .tb__ap, .contact"))
        hits.push(el.tagName + "." + (el.getAttribute("class") || ""));
    }
    return hits;
  });
  check(`ink ${p}: no red outside the A–A mark`, reds.length === 0, reds.slice(0, 4).join(", "));
  await ctx.close();
}

/* 10 · LedgerGuard depth: flat everywhere by default, 3D only on request */
{
  const src = readFileSync(join(here, "../../cinematic-exploration/prototype/index.html"), "utf8");
  check(
    "depth: no user-agent sniffing (navigator.userAgentData is not used as a capability test)",
    !/userAgentData|navigator\.userAgent/.test(src)
  );
  const { ctx, page } = await open(P1 + "index.html");
  const d = await page.evaluate(() => document.documentElement.classList.contains("depth-flat"));
  check("depth: the flat drawn section is the default", d);
  await ctx.close();
  const q = await open(P1 + "index.html?depth=3d");
  const d3 = await q.page.evaluate(() => document.documentElement.classList.contains("depth-flat"));
  check("depth: ?depth=3d opts into the 3D anatomy (Chromium review only)", !d3);
  await q.ctx.close();
  const f = await open(P1 + "index.html");
  const s = await f.page.evaluate(() => ({
    flat: document.documentElement.classList.contains("depth-flat"),
    ready: document.documentElement.classList.contains("motion-ready"),
    strata: getComputedStyle(document.querySelector(".strata--stage")).display,
    tilt: getComputedStyle(document.querySelector(".rest-probe")).rotate,
  }));
  check(
    "depth: the default runs the drawn section with no tilt",
    s.flat && s.ready && s.strata === "grid" && (s.tilt === "none" || /0deg/.test(s.tilt)),
    JSON.stringify(s)
  );
  await f.page.evaluate(() => {
    const s = document.getElementById("sequence");
    scrollTo(0, s.offsetTop + (s.offsetHeight - innerHeight) * 0.5);
  });
  await f.page.waitForTimeout(1500);
  const t3d = await f.page.evaluate(
    () =>
      [...document.querySelectorAll("[style*='transform']")].filter((e) =>
        /matrix3d|rotateX|rotateY|translateZ|translate3d\([^)]*,[^)]*,\s*[1-9-]/.test(
          e.style.transform
        )
      ).length
  );
  check("depth: flat run sets no 3D transform mid-sequence", t3d === 0, `${t3d} elements`);
  const cap = await f.page.evaluate(() =>
    [...document.querySelectorAll(".tally--card .tally__msg span, .tally--card .tally__k")].map(
      (s) => s.textContent
    )
  );
  check(
    "LedgerGuard: review captions match the review and say prototype · fictional data",
    cap.includes("Prototype state · fictional data") &&
      cap.includes("0 of 13 terms confirmed. Review required.") &&
      cap.includes("6 of 13 terms confirmed. 7 await review.") &&
      cap.includes("13 of 13 terms confirmed. Review complete."),
    cap.join(" | ")
  );
  await f.ctx.close();
}

/* 11 · other engines: WebKit and Firefox, where installed */
mkdirSync(shots, { recursive: true });
for (const [label, engine] of [
  ["webkit", webkit],
  ["firefox", firefox],
]) {
  let b = null;
  try {
    b = await engine.launch();
  } catch {
    check(`${label}: engine available`, null, "not installed here");
    continue;
  }
  for (const [path, f, file] of [
    [P2 + "index.html", 0, "index"],
    [P2 + "alwaysgeeky.html", 0.24, "ag-detail"],
    [P2 + "alwaysgeeky.html", 0.5, "ag-assembly"],
    [P2 + "emplifi.html", 0.62, "em-composition"],
    [P2 + "emplifi.html", 0.85, "em-budget"],
    [P1 + "index.html", 0.4, "lg-section"],
  ]) {
    const { ctx, page, errors } = await open(path, { engine: b });
    if (f) {
      await page.evaluate((f) => {
        const s = document.querySelector("[data-scene], #sequence");
        scrollTo(0, s.offsetTop + (s.offsetHeight - innerHeight) * f);
      }, f);
      await page.waitForTimeout(1400);
    }
    const s = await page.evaluate(() => ({
      live: document.documentElement.classList.contains("motion-live"),
      ready: document.documentElement.classList.contains("motion-ready"),
      flat: document.documentElement.classList.contains("depth-flat"),
      sw: document.documentElement.scrollWidth,
    }));
    await page.screenshot({ path: join(shots, `${label}-${file}.png`) });
    const ok =
      errors.length === 0 &&
      s.sw <= 1440 &&
      (path.endsWith("index.html") && path.startsWith(P2) ? true : s.ready);
    check(
      `${label} ${file}: renders, no errors${path.startsWith(P1) ? (s.flat ? ", depth flat" : ", depth 3D") : ""}`,
      ok,
      JSON.stringify(s) + (errors.length ? " " + errors.join("; ") : "")
    );
    await ctx.close();
  }
  await b.close();
}

await browser.close();
server.close();
writeFileSync(out, JSON.stringify(results, null, 2) + "\n");
const fail = results.filter((r) => r.pass === false).length;
const skip = results.filter((r) => r.pass === null).length;
console.log(`\n${results.length - fail - skip} pass, ${fail} fail, ${skip} skip`);
