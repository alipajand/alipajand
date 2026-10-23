// Review harness for the P1 concept prototypes.
//
//   CHROME_PATH=<chromium binary> node review.mjs <concept-dir> [--no-shots]
//
// Needs playwright-core and axe-core resolvable from NODE_PATH (they are not project
// dependencies). Serves the artifacts folder over HTTP, then for 1440, 768 and 390 px:
// captures first-viewport and full-page screenshots, checks first-viewport project visibility and
// horizontal overflow, runs axe, walks the keyboard, and exercises Back, return links, the flow
// walkthrough, and reduced motion. Results go to <concept-dir>/screenshots/review-results.json.

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");
const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const here = path.dirname(fileURLToPath(import.meta.url));
const concept = process.argv[2];
const takeShots = !process.argv.includes("--no-shots");
const shotsDir = path.join(here, concept, "screenshots");
fs.mkdirSync(shotsDir, { recursive: true });

const TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".webp": "image/webp",
};
const server = http.createServer((req, res) => {
  const file = path.join(here, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!file.startsWith(here) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const BASE = `http://127.0.0.1:${server.address().port}/${concept}/`;

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};
const FEATURED = ["ledgerguard", "alwaysgeeky", "emplifi"];

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const results = { concept, capturedAt: new Date().toISOString(), viewports: {} };

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
}

async function axe(page) {
  await page.addScriptTag({ content: axeSource });
  const r = await page.evaluate(() =>
    window.axe.run(document, {
      runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"],
    })
  );
  return r.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.length,
    sample: v.nodes.slice(0, 2).map((n) => n.target.join(" ")),
  }));
}

async function tabWalk(page, steps) {
  await page.evaluate(() => {
    document.activeElement?.blur();
    window.scrollTo(0, 0);
  });
  const stops = [];
  for (let i = 0; i < steps; i++) {
    await page.keyboard.press("Tab");
    stops.push(
      await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        let ring = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
        // Block-link entries draw the ring on the containing item via :has().
        const holder = el.closest(".entry, .brief, .row, .sys, .line");
        if (!ring && holder) {
          const hs = getComputedStyle(holder);
          ring = hs.outlineStyle !== "none" && parseFloat(hs.outlineWidth) > 0;
        }
        return {
          tag: el.tagName.toLowerCase(),
          name: (el.getAttribute("aria-label") || el.textContent || "")
            .trim()
            .replace(/\s+/g, " ")
            .slice(0, 60),
          visibleRing: ring,
          size: [Math.round(r.width), Math.round(r.height)],
        };
      })
    );
  }
  return stops;
}

for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  const out = {};

  // Index
  await page.goto(BASE + "index.html");
  await settle(page);
  out.fontsLoaded = await page.evaluate(() =>
    [...document.fonts]
      .filter((f) => f.status === "loaded")
      .map((f) => f.family)
      .filter((v, i, a) => a.indexOf(v) === i)
  );
  out.index = await page.evaluate((featured) => {
    const vh = innerHeight;
    const vis = (slug) => {
      const el = document.querySelector(`#project-${slug} a[href="${slug}.html"]`);
      if (!el) return { found: false };
      const r = el.getBoundingClientRect();
      return {
        found: true,
        nameTop: Math.round(r.top),
        nameBottom: Math.round(r.bottom),
        inFirstViewport: r.bottom <= vh && r.top >= 0,
      };
    };
    return {
      horizontalOverflow:
        document.documentElement.scrollWidth > document.documentElement.clientWidth,
      scrollHeight: document.documentElement.scrollHeight,
      featured: Object.fromEntries(featured.map((s) => [s, vis(s)])),
      linksInMain: document.querySelectorAll("main a").length,
      caseStudyLinks: [...document.querySelectorAll("main a")].filter((a) =>
        /^[a-z-]+\.html$/.test(a.getAttribute("href"))
      ).length,
      hiddenTextAtRest: [...document.querySelectorAll("main *")].filter((el) => {
        const cs = getComputedStyle(el);
        return (
          el.childNodes.length &&
          el.textContent.trim() &&
          (parseFloat(cs.opacity) < 0.99 || cs.visibility === "hidden")
        );
      }).length,
      motion: document.documentElement.dataset.motion,
    };
  }, FEATURED);
  if (takeShots) {
    await page.screenshot({ path: path.join(shotsDir, `index-${vp.width}-first-viewport.png`) });
    await page.screenshot({
      path: path.join(shotsDir, `index-${vp.width}-full.jpg`),
      fullPage: true,
      quality: 70,
      type: "jpeg",
    });
  }
  out.indexAxe = await axe(page);
  out.indexTab = await tabWalk(page, vpName === "mobile" ? 12 : 16);
  if (takeShots && vpName === "desktop") {
    // Focus state on the first featured entry
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.focus('a[href="ledgerguard.html"]');
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(shotsDir, `index-${vp.width}-keyboard-focus.png`) });
  }

  // Back restores scroll position
  await page.goto(BASE + "index.html");
  await settle(page);
  const target = await page.evaluate(() => {
    const el = document.querySelector('#project-tallyfolio a[href="tallyfolio.html"]');
    el.scrollIntoView({ block: "center" });
    return Math.round(scrollY);
  });
  const linkTop = () =>
    page.evaluate(() =>
      Math.round(
        document
          .querySelector('#project-tallyfolio a[href="tallyfolio.html"]')
          .getBoundingClientRect().top
      )
    );
  const topBefore = await linkTop();
  await page.waitForTimeout(200);
  await page.click('#project-tallyfolio a[href="tallyfolio.html"]');
  await page.waitForLoadState("load");
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.goBack();
  await page.waitForTimeout(700);
  out.back = {
    scrolledTo: target,
    afterBack: Math.round(await page.evaluate(() => scrollY)),
    linkTopBefore: topBefore,
    linkTopAfterBack: await linkTop(),
  };
  // Restored means the same content is back in the same place on screen.
  out.back.restored = Math.abs(out.back.linkTopAfterBack - out.back.linkTopBefore) < 4;

  // Case study
  await page.goto(BASE + "ledgerguard.html");
  await settle(page);
  out.case = await page.evaluate(() => ({
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    h1: document.querySelector("h1")?.textContent.trim(),
    outlineBeforeContent: (() => {
      const o = document.querySelector("[data-outline]");
      const s = document.querySelector(".cs-sec");
      return !!(o && s && o.compareDocumentPosition(s) & Node.DOCUMENT_POSITION_FOLLOWING);
    })(),
    headings: [...document.querySelectorAll("h1,h2,h3")].map((h) => h.tagName).join(""),
    imagesRequested: performance
      .getEntriesByType("resource")
      .filter((r) => r.initiatorType === "img")
      .map((r) => r.name.split("/").pop()),
  }));
  if (takeShots) {
    await page.screenshot({
      path: path.join(shotsDir, `ledgerguard-${vp.width}-first-viewport.png`),
    });
    await page.screenshot({
      path: path.join(shotsDir, `ledgerguard-${vp.width}-full.jpg`),
      fullPage: true,
      quality: 70,
      type: "jpeg",
    });
  }
  out.caseAxe = await axe(page);
  out.caseTab = await tabWalk(page, 12);

  // Flow walkthrough, keyboard only
  const flow = page.locator("[data-flow] .dg__btn--next").first();
  if (await flow.count()) {
    await flow.focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    out.flowStatus = await page.locator("[data-flow] .dg__status").first().textContent();
    if (takeShots && vpName !== "tablet") {
      await page.locator("[data-flow]").first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(350);
      await page
        .locator("[data-flow]")
        .first()
        .screenshot({ path: path.join(shotsDir, `ledgerguard-${vp.width}-flow-step.png`) });
    }
  }

  // Return link lands on the project anchor
  await page.click(".casenav__back, a[href='index.html#project-ledgerguard']");
  await page.waitForLoadState("load");
  await page.waitForTimeout(500);
  out.returnLink = await page.evaluate(() => {
    const t = document.getElementById("project-ledgerguard");
    return {
      hash: location.hash,
      targetTop: Math.round(t.getBoundingClientRect().top),
      scrollY: Math.round(scrollY),
    };
  });
  out.errors = errors;
  await ctx.close();

  // Reduced motion
  const rctx = await browser.newContext({ viewport: vp, reducedMotion: "reduce" });
  const rpage = await rctx.newPage();
  await rpage.goto(BASE + "index.html");
  await settle(rpage);
  out.reducedMotion = await rpage.evaluate(() => ({
    motion: document.documentElement.dataset.motion,
    runningAnimations: document.getAnimations().length,
  }));
  if (takeShots && vpName !== "tablet") {
    await rpage.screenshot({
      path: path.join(shotsDir, `index-${vp.width}-reduced-motion-first-viewport.png`),
    });
  }
  await rctx.close();

  results.viewports[vpName] = out;
}

await browser.close();
server.close();
fs.writeFileSync(
  path.join(shotsDir, "review-results.json"),
  JSON.stringify(results, null, 2) + "\n"
);

// Console summary
for (const [vp, r] of Object.entries(results.viewports)) {
  const feat = Object.entries(r.index.featured)
    .map(([s, v]) => `${s}:${v.inFirstViewport ? "yes" : `no(${v.nameTop})`}`)
    .join(" ");
  console.log(
    `${vp.padEnd(7)} featured-in-first-viewport ${feat} | overflow idx/case ${r.index.horizontalOverflow}/${r.case.horizontalOverflow} | hidden-at-rest ${r.index.hiddenTextAtRest} | axe idx ${r.indexAxe.map((v) => v.id).join(",") || "0"} case ${r.caseAxe.map((v) => v.id).join(",") || "0"} | back ${r.back.restored} (y ${r.back.scrolledTo}->${r.back.afterBack}, link top ${r.back.linkTopBefore}->${r.back.linkTopAfterBack}) | return ${r.returnLink.hash} top=${r.returnLink.targetTop} | rm ${r.reducedMotion.motion}/${r.reducedMotion.runningAnimations} | flow "${r.flowStatus ?? "-"}" | rings ${[...r.indexTab, ...r.caseTab].filter((s) => s && !s.visibleRing).length} missing | errors ${r.errors.length}`
  );
}
console.log("fonts:", results.viewports.desktop.fontsLoaded.join(", "));
