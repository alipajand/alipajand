// Captures the storyboard stills for P2: the register, then one frame per beat of each scene, on
// desktop and on a phone, plus the reduced-motion presentation of every page.
//   node capture/stills.mjs <outDir>
// PNG out; the committed screenshots are WebP made from them with cwebp -q 82.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "./serve.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const { chromium } = createRequire(join(process.env.NODE_PATH ?? ".", "noop.js"))(
  "playwright-core"
);
const out = process.argv[2];
mkdirSync(out, { recursive: true });
const PORT = 4420;
const server = await serve(join(here, "../.."), PORT);
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });

async function open(width, height, reduce, path) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: width < 600 ? 2 : 1,
    reducedMotion: reduce ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}/p2-portability/prototype/${path}`, {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  return { ctx, page };
}

const shot = async (page, name, opts = {}) => {
  await page.waitForTimeout(1600);
  await page.screenshot({ path: join(out, name + ".png"), ...opts });
};

// A beat is held once its motion has settled: two thirds of the way from the step's start (its top at
// 55% of the viewport) to the next step's start.
const toBeat = (page, i) =>
  page.evaluate((i) => {
    const vh = innerHeight;
    const abs = (el) => el.getBoundingClientRect().top + scrollY;
    const steps = [...document.querySelectorAll(".track > .step[data-beat]")];
    const land = document.querySelector(".beat--land");
    const starts = steps.map((s) => abs(s) - 0.55 * vh);
    const ends = starts.slice(1).concat(abs(land) - vh);
    scrollTo(0, starts[i] + (ends[i] - starts[i]) * 0.66);
  }, i);
// The match cut in flight, then landed in the case study's hero.
const toLand = (page, f) =>
  page.evaluate((f) => {
    const seq = document.querySelector(".seq");
    const land = document.querySelector(".beat--land");
    const a = land.getBoundingClientRect().top + scrollY - innerHeight;
    const b = seq.getBoundingClientRect().bottom + scrollY - innerHeight;
    scrollTo(0, a + (b - a) * f);
  }, f);

for (const [tag, w, h] of [
  ["desktop", 1440, 900],
  ["mobile", 390, 844],
]) {
  /* the register */
  {
    const { ctx, page } = await open(w, h, false, "index.html");
    await shot(page, `${tag}-00-index-first-screen`);
    if (w > 900) {
      await page.hover('[data-row="alwaysgeeky"] .row__name');
      await shot(page, `${tag}-01-index-key-plan`);
    }
    await page.evaluate(() => document.getElementById("register").scrollIntoView());
    await shot(page, `${tag}-02-index-register`);
    await page.locator('[data-cap-to="systems"]').click();
    await page.evaluate(() => document.getElementById("capabilities").scrollIntoView());
    await shot(page, `${tag}-03-index-capability-marked`);
    await ctx.close();
  }

  /* the scenes, beat by beat */
  for (const [code, path, beats] of [
    ["ag", "alwaysgeeky.html", ["detail", "assembly", "gates"]],
    ["em", "emplifi.html", ["chart", "cost", "composition", "after"]],
  ]) {
    const { ctx, page } = await open(w, h, false, path);
    await shot(page, `${tag}-${code}-00-first-frame`);
    for (const [i, beat] of beats.entries()) {
      await toBeat(page, i);
      await shot(page, `${tag}-${code}-${String(i + 1).padStart(2, "0")}-${beat}`);
    }
    await toLand(page, 0.55);
    await shot(page, `${tag}-${code}-08-match-cut`);
    await page.evaluate(() => document.getElementById("case").scrollIntoView());
    await shot(page, `${tag}-${code}-09-case-study`);
    await ctx.close();
  }

  /* reduced motion: the same pages as readable steps */
  for (const [code, path] of [
    ["index", "index.html"],
    ["ag", "alwaysgeeky.html"],
    ["em", "emplifi.html"],
  ]) {
    const { ctx, page } = await open(w, h, true, path);
    await shot(page, `${tag}-reduced-${code}-first-screen`);
    if (code !== "index") {
      await page.evaluate(() =>
        document.querySelector(".track > .step[data-beat]").scrollIntoView()
      );
      await shot(page, `${tag}-reduced-${code}-step`);
    }
    await ctx.close();
  }
}

await browser.close();
server.close();
