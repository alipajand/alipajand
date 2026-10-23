// Rough performance probe: delivered bytes by type, and frame pacing while scrolling the sequence.
//   node capture/perf.mjs
// Lab numbers from headless Chromium on a laptop. They show relative cost, not field performance.
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "./serve.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const { chromium } = createRequire(join(process.env.NODE_PATH ?? ".", "noop.js"))(
  "playwright-core"
);
const server = await serve(join(here, "../prototype"));
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });

async function probe(label, viewport, cpu) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
  const bytes = {};
  await cdp.send("Network.enable");
  const types = new Map();
  cdp.on("Network.responseReceived", (e) => types.set(e.requestId, e.type));
  cdp.on("Network.loadingFinished", (e) => {
    const t = types.get(e.requestId) ?? "Other";
    bytes[t] = (bytes[t] ?? 0) + e.encodedDataLength;
  });
  await page.goto("http://localhost:4417/index.html", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  const vitals = await page.evaluate(
    () =>
      new Promise((done) => {
        let lcp = 0;
        new PerformanceObserver((l) => l.getEntries().forEach((e) => (lcp = e.startTime))).observe({
          type: "largest-contentful-paint",
          buffered: true,
        });
        let cls = 0;
        new PerformanceObserver((l) =>
          l.getEntries().forEach((e) => !e.hadRecentInput && (cls += e.value))
        ).observe({
          type: "layout-shift",
          buffered: true,
        });
        setTimeout(() => done({ lcp: Math.round(lcp), cls: +cls.toFixed(3) }), 300);
      })
  );
  // Scroll the whole sequence in 8 s and record every frame interval.
  const frames = await page.evaluate(
    () =>
      new Promise((done) => {
        const end = document.getElementById("project-ledgerguard").offsetTop;
        const gaps = [];
        const t0 = performance.now();
        let last = t0;
        (function step(now) {
          gaps.push(now - last);
          last = now;
          const k = Math.min(1, (now - t0) / 8000);
          scrollTo(0, end * k);
          if (k < 1) requestAnimationFrame(step);
          else done(gaps.slice(1));
        })(t0);
      })
  );
  const sorted = [...frames].sort((a, b) => a - b);
  const p = (q) => sorted[Math.floor(q * (sorted.length - 1))].toFixed(1);
  const kb = Object.fromEntries(Object.entries(bytes).map(([k, v]) => [k, Math.round(v / 1024)]));
  console.log(
    JSON.stringify({
      label,
      cpuSlowdown: cpu,
      kb,
      totalKb: Object.values(kb).reduce((a, b) => a + b, 0),
      ...vitals,
      frames: frames.length,
      medianMs: p(0.5),
      p95Ms: p(0.95),
      over33ms: frames.filter((g) => g > 33.4).length,
    })
  );
  await ctx.close();
}

await probe("desktop", { width: 1440, height: 900 }, 1);
await probe("desktop, 4x CPU slowdown", { width: 1440, height: 900 }, 4);
await probe("mobile viewport, 4x CPU slowdown", { width: 390, height: 844 }, 4);
await browser.close();
server.close();
