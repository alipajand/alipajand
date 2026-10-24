// Functional review of the P2 prototype: accessibility, keyboard, the register's controls, motion
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
    const target = p === "index.html" ? "#register" : "#case";
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
        };
      });
      if (!s) break;
      stops++;
      if (s.id.startsWith("A.row__link")) rowLinks++;
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
        `keyboard index.html ${mode}: every register row's case-study link is a tab stop`,
        rowLinks === 7,
        `${rowLinks} of 7`
      );
    await ctx.close();
  }
}

/* 3 · the register: key plan, capability marks, live status, Escape */
{
  const { ctx, page } = await open(P2 + "index.html");
  await page.hover('[data-row="emplifi"] .row__name');
  await page.waitForTimeout(350);
  let on = await page.evaluate(() => document.querySelector(".viewer__sheet.is-on")?.dataset.view);
  check("register: pointing at a row shows its sheet in the key plan", on === "emplifi", on);
  await page.focus('[data-row="controltech"] .row__link');
  await page.waitForTimeout(350);
  on = await page.evaluate(() => ({
    view: document.querySelector(".viewer__sheet.is-on")?.dataset.view,
    label: document.querySelector("[data-view-label]").textContent,
  }));
  check(
    "register: focusing a row shows its sheet",
    on.view === "controltech" && on.label === "CT-01",
    JSON.stringify(on)
  );
  const wipe = await page.evaluate(
    () =>
      Math.max(
        ...getComputedStyle(document.querySelector(".viewer__sheet"))
          .transitionDuration.split(",")
          .map(parseFloat)
      ) * 1000
  );
  check("register: the key-plan wipe is at most 280 ms", wipe <= 280, `${wipe} ms`);
  await page.focus('[data-cap-to="systems"]');
  await page.keyboard.press("Enter");
  await page.waitForTimeout(200);
  const marked = await page.evaluate(() => ({
    pressed: document.querySelector('[data-cap-to="systems"]').getAttribute("aria-pressed"),
    matches: [...document.querySelectorAll(".row.is-match")].map((r) => r.dataset.row),
    status: document.querySelector("[data-cap-status]").textContent,
    col: document.querySelectorAll('.sched__table .is-col[data-col="systems"]').length,
  }));
  check(
    "register: Design systems marks AlwaysGeeky and Emplifi, in rows and schedule",
    marked.pressed === "true" &&
      marked.matches.join() === "alwaysgeeky,emplifi" &&
      marked.col === 8,
    JSON.stringify(marked.matches) + " col cells " + marked.col
  );
  check(
    "register: the status line names the marked sheets",
    /2 sheets marked, AlwaysGeeky Games, Emplifi\./.test(marked.status),
    marked.status
  );
  const live = await page.evaluate(() =>
    document.querySelector("[data-cap-status]").getAttribute("aria-live")
  );
  check("register: the status line is a polite live region", live === "polite");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  const cleared = await page.evaluate(
    () => !document.querySelector(".reg").dataset.cap && !document.querySelector(".row.is-match")
  );
  check("register: Escape clears the marks", cleared);
  await ctx.close();
}

/* 4 · without script: everything is a plain link, a plain table and readable steps */
{
  const { ctx, page } = await open(P2 + "index.html", { js: false });
  const r = await page.evaluate(() => ({
    rows: document.querySelectorAll(".row__link[href]").length,
    caps: [...document.querySelectorAll(".cap")].filter(
      (b) => getComputedStyle(b).display !== "none"
    ).length,
    table: document.querySelectorAll(".sched__table tbody tr").length,
  }));
  check(
    "no script: 7 register links, no dead controls, full schedule",
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

/* 6 · anchors and the match cut */
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
  for (const [w, h] of [
    [1440, 900],
    [390, 844],
  ]) {
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

/* 10 · LedgerGuard depth: 3D where it has been seen to render, flat elsewhere or on request */
{
  const { ctx, page } = await open(P1 + "index.html");
  const d = await page.evaluate(() => document.documentElement.classList.contains("depth-flat"));
  check("depth: Chromium runs the 3D anatomy by default", !d);
  await ctx.close();
  const f = await open(P1 + "index.html?depth=flat");
  const s = await f.page.evaluate(() => ({
    flat: document.documentElement.classList.contains("depth-flat"),
    ready: document.documentElement.classList.contains("motion-ready"),
    strata: getComputedStyle(document.querySelector(".strata--stage")).display,
    tilt: getComputedStyle(document.querySelector(".rest-probe")).rotate,
  }));
  check(
    "depth: ?depth=flat runs the drawn section with no tilt",
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
