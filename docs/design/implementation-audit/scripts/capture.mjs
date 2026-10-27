// Captures design artifacts and the production build side by side and records measurements. Read-only.
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
const require = createRequire(process.env.NODE_PATH + "/");
const { chromium } = require("playwright-core");
const dir = new URL(".", import.meta.url).pathname;
const PROD = "http://localhost:3456";
const cases = ["ledgerguard","alwaysgeeky","emplifi","agent-tooling","tallyfolio","controltech","mapbylaw"];
const pairs = [
  ["home", "/", "home"], ["portfolio", "/portfolio", "portfolio"],
  ...cases.map((c) => [`case-${c}`, `/portfolio/${c}`, `case-${c}`]),
  ["open-source", "/open-source", "open-source"], ["writing", "/writing", "writing"],
  ["post-ard", "/writing/agent-readiness-doctor", "agent-readiness-doctor"],
  ["post-reader", "/writing/agent-instructions-are-code", "writing-reader#agent-instructions-are-code"],
  ["principles", "/engineering-principles", "engineering-principles"], ["now", "/now", "now"],
  ["not-found", "/this-route-does-not-exist", "not-found"],
];
const viewports = [[1440, 900], [390, 844]];
const measure = () => {
  const de = document.documentElement, vw = de.clientWidth;
  const cs = getComputedStyle(document.body);
  const hidden = [...document.querySelectorAll("main *, body > div *")].filter((el) => {
    const r = el.getBoundingClientRect(); if (!r.width || !r.height || r.top > innerHeight || r.bottom < 0) return false;
    const s = getComputedStyle(el); return s.opacity === "0" && el.textContent.trim().length > 20 && !el.closest("[aria-hidden=true]");
  }).length;
  const overflow = [...document.querySelectorAll("body *")].filter((el) => { const r = el.getBoundingClientRect(); return r.width && r.right > vw + 1 && !el.closest("[aria-hidden=true], .ticker, [class*=overflow-x], .act__graph"); }).slice(0, 5).map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)}`);
  return {
    title: document.title, lang: de.lang,
    h1: [...document.querySelectorAll("h1")].map((h) => (h.getAttribute("aria-label") || h.textContent).trim().replace(/\s+/g, " ").slice(0, 60)),
    headings: document.querySelectorAll("h1,h2,h3,h4").length,
    height: de.scrollHeight, hOverflow: de.scrollWidth > vw, overflow,
    bodyBg: cs.backgroundColor, bodyFg: cs.color, bodyFont: cs.fontFamily.slice(0, 60), bodySize: cs.fontSize,
    canvases: document.querySelectorAll("canvas").length, imgs: document.images.length, dialogs: document.querySelectorAll("dialog").length,
    nodes: document.getElementsByTagName("*").length, hiddenText: hidden,
    jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { const j = JSON.parse(s.textContent); return [].concat(j["@graph"] || j).map((x) => x["@type"]).join("+"); } catch { return "invalid"; } }),
    canonical: document.querySelector('link[rel=canonical]')?.href || null,
    fonts: [...document.fonts].filter((f) => f.status === "loaded").map((f) => `${f.family.replace(/"/g, "")} ${f.weight} ${f.stretch}`).filter((v, i, a) => a.indexOf(v) === i).slice(0, 8),
    lcp: window.__lcp ?? null, cls: window.__cls ?? null,
  };
};
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const out = [];
for (const [w, h] of viewports) {
  for (const reduce of [false, true]) {
    if (reduce && w !== 1440) continue;
    const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: reduce ? "reduce" : "no-preference" });
    await ctx.addInitScript(() => {
      window.__cls = 0;
      try {
        new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = Math.round(e.startTime); }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });
      } catch {}
    });
    for (const [id, route, art] of pairs) {
      for (const side of ["artifact", "prod"]) {
        const p = await ctx.newPage();
        let js = 0, bytes = 0, reqs = 0;
        p.on("response", async (r) => { try { const len = (await r.body()).length; bytes += len; reqs++; if (r.request().resourceType() === "script") js += len; } catch {} });
        const url = side === "prod" ? PROD + route : `http://127.0.0.1:4317/${art.replace(/(#.*)?$/, "-pv.html$1")}`;
        const resp = await p.goto(url, { waitUntil: "load" }).catch((e) => null);
        await p.waitForTimeout(1800);
        const m = await p.evaluate(measure);
        const tag = `${id}-${side}-${w}${reduce ? "-reduce" : ""}`;
        if (!reduce) await p.screenshot({ path: `${dir}shots/audit/${tag}.jpg`, type: "jpeg", quality: 55, fullPage: false });
        out.push({ id, side, w, reduce, url, status: resp?.status() ?? null, jsBytes: js, bytes, reqs, ...m });
        await p.close();
      }
    }
    await ctx.close();
  }
}
// JS disabled, production only, 1440.
const nojs = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
for (const [id, route] of pairs) {
  const p = await nojs.newPage();
  await p.goto(PROD + route, { waitUntil: "load" });
  await p.waitForTimeout(400);
  const m = await p.evaluate(measure);
  await p.screenshot({ path: `${dir}shots/audit/${id}-prod-1440-nojs.jpg`, type: "jpeg", quality: 55 });
  out.push({ id, side: "prod-nojs", w: 1440, ...m });
  await p.close();
}
await b.close();
writeFileSync(`${dir}audit/captures.json`, JSON.stringify(out, null, 1));
console.log("captures", out.length);
