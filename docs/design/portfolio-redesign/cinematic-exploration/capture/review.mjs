// Functional review of the prototype: accessibility, keyboard, motion modes, history and layout.
//   node capture/review.mjs [outFile.json]
// Prints one line per check and writes the full results as JSON.
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "./serve.mjs";

const here = dirname(fileURLToPath(import.meta.url));
// playwright-core and axe-core are deliberately not project dependencies: resolve them from NODE_PATH.
const req = createRequire(join(process.env.NODE_PATH ?? ".", "noop.js"));
const { chromium } = req("playwright-core");
const AXE = readFileSync(req.resolve("axe-core/axe.min.js"), "utf8");
const out = process.argv[2] ?? join(here, "review-results.json");
const BASE = "http://localhost:4417";

const server = await serve(join(here, "../prototype"));
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const results = [];
const check = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

async function open(path, { width = 1440, height = 900, reduce = false } = {}) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    reducedMotion: reduce ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("response", (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);
  return { ctx, page, errors };
}

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
{
  const { ctx, page } = await open("/index.html");
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
  check("keyboard: first Tab is the skip link", first.href === "#project-ledgerguard", first.text);
  check("keyboard: skip link visible with focus ring", first.visible && first.outline);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  const landed = await page.evaluate(() => {
    const r = document.getElementById("project-ledgerguard").getBoundingClientRect();
    return { top: Math.round(r.top), hash: location.hash };
  });
  check(
    "keyboard: skip link lands on the project",
    Math.abs(landed.top) < 120,
    JSON.stringify(landed)
  );

  // Tab through the whole page: every stop is visible and has a focus indicator.
  await page.evaluate(() => scrollTo(0, 0));
  await page.evaluate(() => document.activeElement.blur());
  const stops = [];
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press("Tab");
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
    `keyboard: ${stops.length} tab stops on screen with focus ring`,
    bad.length === 0,
    bad.map((s) => s.label).join(" | ")
  );
  await ctx.close();
}

// 3. Layer index links reach their step and mark it current.
{
  const { ctx, page } = await open("/index.html");
  for (const id of ["layer-api", "layer-data", "layer-jobs", "layer-boundary"]) {
    await page.evaluate((id) => {
      document.getElementById(id).scrollIntoView();
    }, id);
    await page.waitForTimeout(1500);
    const cur = await page.evaluate(
      () => document.querySelector('.layers [aria-current="step"]')?.getAttribute("href") ?? null
    );
    check(`layer index marks #${id} current`, cur === `#${id}`, String(cur));
  }
  await ctx.close();
}

// 4. Workspace states: a state button switches every view of the workspace, announces it and
//    keeps focus. In the live sequence, scrolling through the step also moves through the states.
const boundaryAt = (f) => {
  const step = document.getElementById("layer-boundary");
  const col = document.querySelector('[data-beat="collapse"]');
  const seq = document.getElementById("sequence");
  const a = seq.offsetTop + step.offsetTop - innerHeight * 0.25;
  const z = seq.offsetTop + col.offsetTop - innerHeight * 0.7;
  scrollTo(0, a + (z - a) * f);
};
for (const reduce of [false, true]) {
  const mode = reduce ? "reduce" : "full";
  const { ctx, page } = await open("/index.html", { reduce });
  await page.evaluate(() => document.getElementById("layer-boundary").scrollIntoView());
  await page.waitForTimeout(1200);
  await page.locator('[data-ws-to="partial"]').focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  const s = await page.evaluate(() => {
    const fig = document.querySelector(".wsx__fig");
    const shown = [...fig.querySelectorAll("img")]
      .filter(
        (i) => getComputedStyle(i).display !== "none" && getComputedStyle(fig).display !== "none"
      )
      .map((i) => i.dataset.wsImg);
    return {
      states: [...document.querySelectorAll("[data-ws]")].map((el) => el.dataset.state),
      pressed: [...document.querySelectorAll('[data-ws-to][aria-pressed="true"]')].map(
        (b) => b.dataset.wsTo
      ),
      live: document.querySelector("[data-ws-live]").textContent,
      focus: document.activeElement.dataset.wsTo ?? null,
      shown: shown.join(),
    };
  });
  check(
    `workspace ${mode}: a state button switches every view and announces it`,
    s.states.every((x) => x === "partial") &&
      s.pressed.join() === "partial" &&
      /partially reviewed/i.test(s.live),
    s.live
  );
  check(`workspace ${mode}: focus stays on the chosen state`, s.focus === "partial");
  if (reduce) {
    check(
      "workspace reduce: the inline figure shows the chosen state",
      s.shown === "partial",
      s.shown
    );
  } else {
    await page.evaluate(boundaryAt, 0.8);
    await page.waitForTimeout(1600);
    const st = await page.evaluate(() => {
      const ws = document.querySelector(".ws");
      return `${ws.dataset.state} ${getComputedStyle(ws).visibility}`;
    });
    check(
      "workspace full: scrolling through the step reaches Confirmed on the stage",
      st === "confirmed visible",
      st
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
  await page.waitForURL(/index\.html#layer-boundary/);
  check(
    "workspace prototype links back to the A–A step",
    page.url().endsWith("index.html#layer-boundary")
  );
  await ctx.close();
}

// 5. History: open the case study from the story, go Back, and land where we left.
{
  const { ctx, page } = await open("/index.html");
  await page.evaluate(() => document.getElementById("project-ledgerguard").scrollIntoView());
  await page.waitForTimeout(800);
  const cta = page.locator('#project-ledgerguard a[href="ledgerguard.html"]');
  await cta.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  // Measured after the CTA is on screen, so the click itself does not scroll.
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
    "Back restores the scroll position",
    Math.abs(after.y - before) < 40,
    `${before} → ${after.y}`
  );
  check("Back skips the arrival animation", after.returning);

  await page.goForward();
  await page.waitForTimeout(800);
  await page.click('a[href="index.html#project-ledgerguard"] >> nth=0');
  await page.waitForTimeout(1500);
  const ret = await page.evaluate(() => ({
    hash: location.hash,
    top: Math.round(document.getElementById("project-ledgerguard").getBoundingClientRect().top),
  }));
  check(
    "return link lands on the project anchor",
    ret.hash === "#project-ledgerguard" && Math.abs(ret.top) < 120,
    JSON.stringify(ret)
  );
  await ctx.close();
}

// 6. Reduced motion: no sticky sequence, no running animations, the static drawing is shown.
{
  const { ctx, page } = await open("/index.html", { reduce: true });
  const s = await page.evaluate(() => ({
    live: document.documentElement.classList.contains("motion-live"),
    motion: document.documentElement.dataset.motion,
    anims: document.getAnimations().filter((a) => a.playState === "running").length,
    anatomy: getComputedStyle(document.querySelector(".anatomy")).display !== "none",
  }));
  check("reduced motion: sequence not pinned", !s.live && s.motion === "reduce", JSON.stringify(s));
  check("reduced motion: no running animations", s.anims === 0, String(s.anims));
  check("reduced motion: static anatomy drawing shown", s.anatomy);
  await ctx.close();
}

// 7. Motion toggle switches modes and persists across a reload.
{
  const { ctx, page } = await open("/index.html");
  const a = await page.evaluate(() => document.documentElement.classList.contains("motion-live"));
  await page.click("[data-motion-toggle] >> nth=0");
  await page.waitForTimeout(600);
  const b = await page.evaluate(() => ({
    live: document.documentElement.classList.contains("motion-live"),
    pressed: document.querySelector("[data-motion-toggle]").getAttribute("aria-pressed"),
  }));
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const c = await page.evaluate(() => document.documentElement.dataset.motion);
  check(
    "motion toggle turns the sequence off",
    a && !b.live && b.pressed === "false",
    JSON.stringify(b)
  );
  check("motion choice persists across reload", c === "reduce", c);
  await ctx.close();
}

// 8. No horizontal overflow at three widths, scrolled through the whole page.
for (const [width, height] of [
  [1440, 900],
  [768, 1024],
  [390, 844],
]) {
  for (const path of ["/index.html", "/ledgerguard.html"]) {
    const { ctx, page } = await open(path, { width, height });
    let worst = 0;
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += height) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await page.waitForTimeout(120);
      worst = Math.max(worst, await page.evaluate(() => document.documentElement.scrollWidth));
    }
    check(`no horizontal overflow ${path} @${width}`, worst <= width, `scrollWidth ${worst}`);
    await ctx.close();
  }
}

writeFileSync(out, JSON.stringify(results, null, 2) + "\n");
const failed = results.filter((r) => !r.pass).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
await browser.close();
server.close();
