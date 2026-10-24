// Functional review of the prototype: accessibility, keyboard, motion modes and their fail-safes,
// anchors and history, layout, and a visual pass in WebKit and Firefox.
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
// WebKit and Firefox builds are tied to a Playwright version; ENGINES_NODE_PATH may point at the
// playwright-core whose browsers are installed.
const engines = process.env.ENGINES_NODE_PATH
  ? createRequire(join(process.env.ENGINES_NODE_PATH, "noop.js"))("playwright-core")
  : req("playwright-core");
const { webkit, firefox } = engines;
const AXE = readFileSync(req.resolve("axe-core/axe.min.js"), "utf8");
const out = process.argv[2] ?? join(here, "review-results.json");
const shots = process.argv[3] ?? join(here, "../screenshots/engines");
const BASE = "http://localhost:4417";
const GSAP = /gsap\.min\.js$/;
const TRIGGER = /ScrollTrigger\.min\.js$/;

const server = await serve(join(here, "../prototype"));
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
  await page.waitForTimeout(800);
  return { ctx, page, errors };
}

const state = (page) =>
  page.evaluate(() => {
    const st = document.querySelector(".stage");
    return {
      live: document.documentElement.classList.contains("motion-live"),
      motion: document.documentElement.dataset.motion ?? null,
      sticky: getComputedStyle(st).position === "sticky",
      inlineTransforms: document.querySelectorAll('[style*="transform"]').length,
      story: getComputedStyle(document.getElementById("project-ledgerguard")).visibility,
      slot: getComputedStyle(document.querySelector("[data-slot]")).visibility,
      strata: getComputedStyle(document.querySelector(".strata--static")).display !== "none",
      height: document.documentElement.scrollHeight,
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

// 1. Accessibility scan, both pages, both motion modes.
for (const path of ["/index.html", "/ledgerguard.html"]) {
  for (const reduce of [false, true]) {
    const { ctx, page, errors } = await open(path, { reduce });
    const v = await axe(page);
    check(`axe ${path} ${reduce ? "reduce" : "full"}`, v.length === 0, v.join("; "));
    check(`console ${path} ${reduce ? "reduce" : "full"}`, errors.length === 0, errors.join("; "));
    await ctx.close();
  }
}

// 2. Keyboard: the first Tab reaches the skip link, it is visible, and it lands on the project.
//    Then every tab stop on the page is on screen with a focus indicator.
for (const reduce of [false, true]) {
  const mode = reduce ? "reduce" : "full";
  const { ctx, page } = await open("/index.html", { reduce });
  await page.keyboard.press("Tab");
  const first = await page.evaluate(() => {
    const a = document.activeElement;
    const r = a.getBoundingClientRect();
    const cs = getComputedStyle(a);
    return {
      text: a.textContent.trim(),
      href: a.getAttribute("href"),
      visible: r.width > 0 && r.top >= 0 && r.bottom <= innerHeight,
      outline: cs.outlineStyle !== "none" || cs.boxShadow !== "none",
    };
  });
  check(
    `keyboard ${mode}: first Tab is the skip link`,
    first.href === "#project-ledgerguard",
    first.text
  );
  check(`keyboard ${mode}: skip link visible with focus ring`, first.visible && first.outline);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(600);
  const landed = await page.evaluate(() => ({
    top: Math.round(document.getElementById("project-ledgerguard").getBoundingClientRect().top),
    hash: location.hash,
  }));
  check(
    `keyboard ${mode}: skip link lands on the project`,
    Math.abs(landed.top) < 120,
    JSON.stringify(landed)
  );

  await page.evaluate(() => scrollTo(0, 0));
  await page.evaluate(() => document.activeElement.blur());
  const stops = [];
  for (let i = 0; i < 90; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(60);
    const s = await page.evaluate(() => {
      const a = document.activeElement;
      if (!a || a === document.body) return null;
      const r = a.getBoundingClientRect();
      const cs = getComputedStyle(a);
      return {
        label: (a.getAttribute("aria-label") || a.textContent || a.tagName).trim().slice(0, 40),
        onScreen: r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight,
        ring: cs.outlineStyle !== "none" || cs.boxShadow !== "none",
      };
    });
    if (!s) break;
    if (stops.length && stops[0].label === s.label && i > 3) break;
    stops.push(s);
  }
  const bad = stops.filter((s) => !s.onScreen || !s.ring);
  check(
    `keyboard ${mode}: ${stops.length} tab stops on screen with focus ring`,
    bad.length === 0,
    bad.map((s) => s.label).join(" | ")
  );
  await ctx.close();
}

// 3. The layer list: each layer is a toggle button that brings its sheet (or band) forward.
for (const reduce of [false, true]) {
  const mode = reduce ? "reduce" : "full";
  const { ctx, page } = await open("/index.html", { reduce });
  await page.evaluate(() => document.getElementById("anatomy").scrollIntoView());
  await page.waitForTimeout(1200);
  await page.locator('[data-layer-to="3"]').focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  const on = await page.evaluate(() => ({
    focus: document.documentElement.dataset.focus ?? null,
    pressed: [...document.querySelectorAll('[data-layer-to][aria-pressed="true"]')].map(
      (b) => b.dataset.layerTo
    ),
    active: document.activeElement.dataset.layerTo ?? null,
  }));
  check(
    `layer list ${mode}: a layer button focuses its layer and keeps keyboard focus`,
    on.focus === "3" && on.pressed.join() === "3" && on.active === "3",
    JSON.stringify(on)
  );
  await page.keyboard.press("Enter");
  await page.waitForTimeout(200);
  const off = await page.evaluate(() => document.documentElement.dataset.focus ?? null);
  check(`layer list ${mode}: pressing again clears the focus`, off === null, String(off));
  await ctx.close();
}

// 4. Workspace states: a state button switches every view of the workspace, announces it and
//    keeps focus. In the live sequence, scrolling through the step moves through the states.
for (const reduce of [false, true]) {
  const mode = reduce ? "reduce" : "full";
  const { ctx, page } = await open("/index.html", { reduce });
  await page.evaluate(() => document.getElementById("boundary").scrollIntoView());
  await page.waitForTimeout(1200);
  await page.locator('[data-ws-to="partial"]').focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  const s = await page.evaluate(() => ({
    states: [...document.querySelectorAll("[data-ws]")].map((el) => el.dataset.state),
    pressed: [...document.querySelectorAll('[data-ws-to][aria-pressed="true"]')].map(
      (b) => b.dataset.wsTo
    ),
    live: document.querySelector("[data-ws-live]").textContent,
    focus: document.activeElement.dataset.wsTo ?? null,
  }));
  check(
    `workspace ${mode}: a state button switches every view and announces it`,
    s.states.every((x) => x === "partial") &&
      s.pressed.join() === "partial" &&
      /partially reviewed/i.test(s.live),
    s.live
  );
  check(`workspace ${mode}: focus stays on the chosen state`, s.focus === "partial");
  if (!reduce) {
    // a fresh page: a state picked by hand above stays until the next crossing
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    const seen = [];
    const span = await page.evaluate(() => {
      const seq = document.getElementById("sequence");
      const a = seq.offsetTop + document.getElementById("boundary").offsetTop - innerHeight;
      const z = seq.offsetTop + document.querySelector('[data-beat="land"]').offsetTop;
      return [a, z];
    });
    for (let i = 0; i <= 24; i++) {
      await page.evaluate((y) => scrollTo(0, y), span[0] + ((span[1] - span[0]) * i) / 24);
      await page.waitForTimeout(260);
      const st = await page.evaluate(() => {
        const ws = document.querySelector(".ws");
        return getComputedStyle(ws).visibility === "visible" ? ws.dataset.state : null;
      });
      if (st && seen[seen.length - 1] !== st) seen.push(st);
    }
    check(
      "workspace full: scrolling through the step shows ready, partial, confirmed in order",
      seen.join() === "ready,partial,confirmed",
      seen.join(" → ")
    );
    // one jump from above the step to below it (a fast flick, an anchor) still ends confirmed
    await page.evaluate((y) => scrollTo(0, y), Math.max(0, span[0] - 1000));
    await page.waitForTimeout(600);
    await page.evaluate((y) => scrollTo(0, y), span[1]);
    await page.waitForTimeout(600);
    const jumped = await page.evaluate(() => document.querySelector("[data-ws]").dataset.state);
    check(
      "workspace full: a jump across the whole step ends confirmed",
      jumped === "confirmed",
      jumped
    );
  }
  await ctx.close();
}

// 4b. The workspace prototype runs from the local copy and links back to the step.
{
  const { ctx, page, errors } = await open("/workspace.html");
  await page.waitForTimeout(600);
  const ok = await page.evaluate(() =>
    /Brightwave Analytics/.test(document.getElementById("root").innerText)
  );
  check(
    "workspace prototype renders with no errors",
    ok && errors.length === 0,
    errors.join(" | ")
  );
  await page.click(".aa-back a");
  await page.waitForURL(/index\.html#boundary/);
  await page.waitForTimeout(1500);
  const top = await page.evaluate(() =>
    Math.round(document.getElementById("boundary").getBoundingClientRect().top)
  );
  check(
    "workspace prototype links back to the boundary step",
    page.url().endsWith("index.html#boundary") && Math.abs(top) < 160,
    `top ${top}`
  );
  await ctx.close();
}

// 5. Anchors, with motion on and off: a deep link lands on its section once the page settles.
for (const reduce of [false, true]) {
  const mode = reduce ? "reduce" : "full";
  for (const id of ["work", "anatomy", "boundary", "project-ledgerguard", "contact"]) {
    const { ctx, page } = await open(`/index.html#${id}`, { reduce });
    await page.waitForTimeout(700);
    const r = await page.evaluate((id) => {
      const el = document.getElementById(id);
      const top = Math.round(el.getBoundingClientRect().top);
      const max = document.documentElement.scrollHeight - innerHeight;
      return { top, atEnd: Math.round(scrollY) >= max - 8 };
    }, id);
    check(
      `anchor ${mode}: #${id} lands on its section`,
      Math.abs(r.top) < 160 || (id === "contact" && r.atEnd && r.top < 900),
      JSON.stringify(r)
    );
    await ctx.close();
  }
}

// 6. History, with motion on and off: open the case study, go Back, land where we left;
//    Forward and the case study's return link land on the project anchor.
for (const reduce of [false, true]) {
  const mode = reduce ? "reduce" : "full";
  const { ctx, page } = await open("/index.html", { reduce });
  await page.evaluate(() => document.getElementById("project-ledgerguard").scrollIntoView());
  await page.waitForTimeout(800);
  const cta = page.locator('#project-ledgerguard a[href="ledgerguard.html"]');
  await cta.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const before = await page.evaluate(() => Math.round(scrollY));
  await cta.click();
  await page.waitForURL(/ledgerguard\.html/);
  await page.waitForTimeout(800);
  await page.goBack();
  await page.waitForTimeout(1500);
  const after = await page.evaluate(() => ({
    y: Math.round(scrollY),
    returning: document.documentElement.classList.contains("returning"),
  }));
  check(
    `history ${mode}: Back restores the scroll position`,
    Math.abs(after.y - before) < 40,
    `${before} → ${after.y}`
  );
  check(`history ${mode}: Back skips the arrival animation`, after.returning);

  await page.goForward();
  await page.waitForURL(/ledgerguard\.html/);
  await page.waitForTimeout(800);
  await page.click('a[href="index.html#project-ledgerguard"] >> nth=0');
  await page.waitForTimeout(1500);
  const ret = await page.evaluate(() => ({
    hash: location.hash,
    top: Math.round(document.getElementById("project-ledgerguard").getBoundingClientRect().top),
  }));
  check(
    `history ${mode}: return link lands on the project anchor`,
    ret.hash === "#project-ledgerguard" && Math.abs(ret.top) < 120,
    JSON.stringify(ret)
  );
  await ctx.close();
}

// 7. Direct access: the case study is one link away from the first frame, in every mode.
for (const reduce of [false, true]) {
  const { ctx, page } = await open("/index.html", { reduce });
  const link = await page.evaluate(() => {
    const a = [...document.querySelectorAll('.bar a[href="ledgerguard.html"]')][0];
    const r = a?.getBoundingClientRect();
    return a ? r.top >= 0 && r.bottom <= innerHeight && r.width > 0 : false;
  });
  check(
    `direct access ${reduce ? "reduce" : "full"}: case study link visible in the first frame`,
    link
  );
  await ctx.close();
}

// 8. Fail-safes: the animated layout is active only when everything it needs is present.
{
  const cases = [
    ["reduced motion", { reduce: true }],
    ["JavaScript disabled", { js: false }],
    ["GSAP unavailable", { block: [{ url: GSAP }] }],
    ["ScrollTrigger unavailable", { block: [{ url: TRIGGER }] }],
    ["sequence.js unavailable", { block: [{ url: /sequence\.js$/ }] }],
    [
      "timeline build throws",
      {
        block: [
          {
            url: TRIGGER,
            with: (r) =>
              r.fulfill({
                contentType: "text/javascript",
                body: "window.ScrollTrigger={refresh(){},getAll(){return[]},create(){throw new Error('simulated')}};",
              }),
          },
        ],
      },
    ],
  ];
  for (const [label, opts] of cases) {
    const { ctx, page, errors } = await open("/index.html", opts);
    const s = await state(page);
    const thrown = errors.filter((e) => !/net::|Failed to load|simulated|ERR_FAILED/.test(e));
    // no inline transforms either: a half-built timeline must not leave the rig posed
    check(
      `fail-safe, ${label}: static layout, nothing pinned, story and figure visible`,
      !s.live &&
        !s.sticky &&
        s.inlineTransforms === 0 &&
        s.story === "visible" &&
        s.slot === "visible" &&
        s.strata,
      JSON.stringify({ ...s, errors: thrown.length })
    );
    // The state and layer buttons work wherever sequence.js runs; without it they stay
    // disabled, so no control is offered that does nothing.
    const runs = opts.js !== false && !String(opts.block?.[0]?.url).includes("sequence");
    const btn = await page.evaluate(() => document.querySelector("[data-ws-to]").disabled);
    if (runs) {
      await page.locator('[data-ws-to="confirmed"]').click();
      const ws = await page.evaluate(() => document.querySelector("[data-ws]").dataset.state);
      check(`fail-safe, ${label}: workspace states still switch`, !btn && ws === "confirmed", ws);
    } else {
      check(`fail-safe, ${label}: state and layer buttons are disabled, not dead`, btn === true);
    }
    await ctx.close();
  }
}

// 9. The OS preference changing while the page is open, and what a stored choice may override.
{
  const { ctx, page } = await open("/index.html");
  await page.evaluate(() => document.getElementById("anatomy").scrollIntoView());
  await page.waitForTimeout(1200);
  const a = await state(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(900);
  const b = await state(page);
  const top = await page.evaluate(() =>
    Math.round(document.getElementById("anatomy").getBoundingClientRect().top)
  );
  check(
    "OS switches to reduced motion mid-page: sequence comes off at once",
    a.live && !b.live && !b.sticky && b.inlineTransforms === 0,
    JSON.stringify({ before: a.live, after: b.live, inline: b.inlineTransforms })
  );
  check(
    "OS switches to reduced motion mid-page: reader keeps their place",
    Math.abs(top) < 200,
    `#anatomy top ${top}`
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForTimeout(1200);
  check("OS switches back: sequence returns", (await state(page)).live);
  await ctx.close();

  const store = (v) =>
    `try{localStorage.setItem("aa-motion2",${JSON.stringify(JSON.stringify(v))})}catch(e){}`;
  const cases = [
    [
      "stored on, made before the OS asked for reduced motion → off",
      { m: "full", os: "full" },
      true,
      false,
    ],
    [
      "stored on, chosen while the OS asked for reduced motion → on",
      { m: "full", os: "reduce" },
      true,
      true,
    ],
    ["stored off, OS asks for nothing → off", { m: "reduce", os: "full" }, false, false],
  ];
  for (const [label, v, reduce, want] of cases) {
    const o = await open("/index.html", { reduce, init: store(v) });
    const s = await state(o.page);
    check(
      `motion choice: ${label}`,
      s.live === want,
      JSON.stringify({ live: s.live, motion: s.motion })
    );
    await o.ctx.close();
  }
}

// 10. The motion toggle switches modes, keeps the reader's place and persists across a reload.
{
  const { ctx, page } = await open("/index.html");
  await page.evaluate(() => document.getElementById("boundary").scrollIntoView());
  await page.waitForTimeout(1200);
  const a = await page.evaluate(() => document.documentElement.classList.contains("motion-live"));
  await page.click("[data-motion-toggle] >> nth=0");
  await page.waitForTimeout(600);
  const b = await page.evaluate(() => ({
    live: document.documentElement.classList.contains("motion-live"),
    pressed: document.querySelector("[data-motion-toggle]").getAttribute("aria-pressed"),
    top: Math.round(document.getElementById("boundary").getBoundingClientRect().top),
  }));
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const c = await page.evaluate(() => document.documentElement.dataset.motion);
  check(
    "motion toggle turns the sequence off",
    a && !b.live && b.pressed === "false",
    JSON.stringify(b)
  );
  check("motion toggle keeps the reader's place", Math.abs(b.top) < 200, `#boundary top ${b.top}`);
  check("motion choice persists across reload", c === "reduce", c);
  await ctx.close();
}

// 11. No horizontal overflow at three widths, scrolled through the whole page, both modes.
for (const [width, height] of [
  [1440, 900],
  [768, 1024],
  [390, 844],
]) {
  for (const path of ["/index.html", "/ledgerguard.html"]) {
    for (const reduce of [false, true]) {
      const { ctx, page } = await open(path, { width, height, reduce });
      let worst = 0;
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < total; y += height) {
        await page.evaluate((y) => scrollTo(0, y), y);
        await page.waitForTimeout(100);
        worst = Math.max(worst, await page.evaluate(() => document.documentElement.scrollWidth));
      }
      check(
        `no horizontal overflow ${path} @${width} ${reduce ? "reduce" : "full"}`,
        worst <= width,
        `scrollWidth ${worst}`
      );
      await ctx.close();
    }
  }
}

// 12. WebKit and Firefox (Playwright builds, not the shipping browsers): the sequence activates
//     without errors, the stage first frame and the landed story are captured for a visual check.
mkdirSync(shots, { recursive: true });
for (const [name, engine] of [
  ["webkit", webkit],
  ["firefox", firefox],
]) {
  let eng;
  try {
    eng = await engine.launch();
  } catch (e) {
    const why = e.message.match(/\[err\] (?!\*)(.+)/)?.[1] ?? e.message.split("\n")[0];
    check(`${name}: not run, the browser did not launch on this machine`, null, why);
    continue;
  }
  for (const [vw, vh] of [
    [1440, 900],
    [390, 844],
  ]) {
    const { ctx, page, errors } = await open("/index.html", { width: vw, height: vh, engine: eng });
    const s = await state(page);
    await page.screenshot({ path: join(shots, `${name}-${vw}-first.png`) });
    const end = await page.evaluate(() => {
      const seq = document.getElementById("sequence");
      return seq.offsetTop + seq.offsetHeight - innerHeight;
    });
    for (const k of [0.25, 0.5, 0.75, 0.97, 1]) {
      await page.evaluate((y) => scrollTo(0, y), Math.round(end * k));
      await page.waitForTimeout(900);
      if (k === 0.5) await page.screenshot({ path: join(shots, `${name}-${vw}-mid.png`) });
    }
    const landed = await page.evaluate(() => {
      const sl = document.querySelector("[data-slot]").getBoundingClientRect();
      return {
        landed: document.documentElement.hasAttribute("data-landed"),
        slotTop: Math.round(sl.top),
      };
    });
    await page.screenshot({ path: join(shots, `${name}-${vw}-landed.png`) });
    check(
      `${name} @${vw}: sequence activates and lands without errors`,
      s.live && landed.landed && errors.length === 0,
      JSON.stringify({ live: s.live, ...landed, errors })
    );
    await ctx.close();
  }
  for (const reduce of [true]) {
    const { ctx, page } = await open("/index.html", { reduce, engine: eng });
    const s = await state(page);
    check(
      `${name}: reduced motion keeps the static layout`,
      !s.live && !s.sticky,
      JSON.stringify(s)
    );
    await ctx.close();
  }
  await eng.close();
}

writeFileSync(out, JSON.stringify(results, null, 2) + "\n");
const failed = results.filter((r) => r.pass === false).length;
const skipped = results.filter((r) => r.pass === null).length;
const ran = results.length - skipped;
console.log(`\n${ran - failed}/${ran} passed${skipped ? `, ${skipped} not run` : ""}`);
await browser.close();
server.close();
