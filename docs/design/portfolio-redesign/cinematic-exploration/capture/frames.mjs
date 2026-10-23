// Captures still frames of the sequence at chosen scroll positions.
//   node capture/frames.mjs <outDir> <width> <height> [reduce] [positions...]
// Positions are element ids (scrolled so the element's top meets the viewport top), or numbers
// (a scroll offset in viewport heights). Each frame waits for the scrubbed timeline to settle.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "./serve.mjs";

const here = dirname(fileURLToPath(import.meta.url));
// playwright-core is deliberately not a project dependency: resolve it from NODE_PATH.
const { chromium } = createRequire(join(process.env.NODE_PATH ?? ".", "noop.js"))(
  "playwright-core"
);
const [out, w = "1440", h = "900", mode = "full", ...positions] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const server = await serve(join(here, "../prototype"));
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const page = await browser.newPage({
  viewport: { width: Number(w), height: Number(h) },
  reducedMotion: mode === "reduce" ? "reduce" : "no-preference",
});
await page.goto("http://localhost:4417/index.html", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(900);
const list = positions.length ? positions : ["0"];
for (const pos of list) {
  await page.evaluate((pos) => {
    const n = Number(pos);
    const y = Number.isNaN(n)
      ? document.getElementById(pos).getBoundingClientRect().top + scrollY
      : n * innerHeight;
    scrollTo(0, y);
  }, pos);
  await page.waitForTimeout(1700);
  await page.screenshot({ path: join(out, `${w}-${mode}-${pos}.png`) });
}
await browser.close();
server.close();
