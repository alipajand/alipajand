// Captures the storyboard stills: one frame per beat, desktop and mobile, plus the static
// (reduced-motion) layout and the case study the match cut resolves into.
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
const server = await serve(join(here, "../prototype"));
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });

async function open(width, height, reduce, path = "/index.html") {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: width < 600 ? 2 : 1,
    reducedMotion: reduce ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  await page.goto("http://localhost:4417" + path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  return { ctx, page };
}

// a scroll target: a fraction of the sequence's own scroll length
const at = (page, f) =>
  page.evaluate((f) => {
    const seq = document.getElementById("sequence");
    scrollTo(0, seq.offsetTop + (seq.offsetHeight - innerHeight) * f);
  }, f);
const shot = async (page, name) => {
  await page.waitForTimeout(1600);
  await page.screenshot({ path: join(out, name + ".png") });
};

for (const [tag, w, h, plan] of [
  [
    "desktop",
    1440,
    900,
    [
      ["01-first-frame", 0],
      ["02-a-interface", 0.1],
      ["03-b-anatomy", 0.42],
      ["04-b-layer-focus", 0.42, '[data-layer-to="3"]'],
      ["05-c-boundary", 0.61],
      ["06-c-confirmed", 0.74],
      ["07-d-match-cut", 0.93],
      ["08-d-landed", 1],
    ],
  ],
  [
    "mobile",
    390,
    844,
    [
      ["01-first-frame", 0],
      ["02-a-interface", 0.14],
      ["03-b-anatomy", 0.36],
      ["04-b-layer-focus", 0.36, '[data-layer-to="3"]'],
      ["05-c-boundary", 0.52],
      ["06-c-confirmed", 0.7],
      ["07-d-match-cut", 0.92],
      ["08-d-landed", 1],
    ],
  ],
]) {
  const { ctx, page } = await open(w, h, false);
  for (const [name, f, click] of plan) {
    await at(page, f);
    if (click) {
      await page.waitForTimeout(900);
      await page.locator(click).click();
    }
    await shot(page, `${tag}-${name}`);
    if (click) await page.locator(click).click();
  }
  await ctx.close();

  const cs = await open(w, h, false, "/ledgerguard.html");
  await shot(cs.page, `${tag}-09-case-study`);
  await cs.ctx.close();

  const rm = await open(w, h, true);
  await shot(rm.page, `${tag}-10-static-first-frame`);
  await rm.page.evaluate(() => document.getElementById("anatomy").scrollIntoView());
  await shot(rm.page, `${tag}-11-static-anatomy`);
  await rm.page.evaluate(() => document.getElementById("boundary").scrollIntoView());
  await shot(rm.page, `${tag}-12-static-boundary`);
  await rm.ctx.close();
}

await browser.close();
server.close();
