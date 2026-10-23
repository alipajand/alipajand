import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

// Path to a Chromium build, e.g. one installed by `npx playwright install chromium`.
const EXEC = process.env.CHROME_PATH;
const BASE = "https://alipajand.com";
const SHOTS = process.argv[2];
const OUT = process.argv[3];
fs.mkdirSync(SHOTS, { recursive: true });

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};
const PAGES = {
  portfolio: "/portfolio",
  ledgerguard: "/portfolio/ledgerguard",
  alwaysgeeky: "/portfolio/alwaysgeeky",
};

const results = { capturedAt: new Date().toISOString(), runs: [] };

const vitalsInit = () => {
  window.__vitals = { lcp: null, lcpEl: null, cls: 0, fcp: null, longTasks: 0, tbt: 0 };
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) {
      window.__vitals.lcp = e.startTime;
      const el = e.element;
      window.__vitals.lcpEl = el
        ? `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""} "${(el.textContent || el.getAttribute("alt") || "").trim().slice(0, 60)}"`
        : null;
    }
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) if (!e.hadRecentInput) window.__vitals.cls += e.value;
  }).observe({ type: "layout-shift", buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries())
      if (e.name === "first-contentful-paint") window.__vitals.fcp = e.startTime;
  }).observe({ type: "paint", buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) {
      window.__vitals.longTasks += 1;
      window.__vitals.tbt += Math.max(0, e.duration - 50);
    }
  }).observe({ type: "longtask", buffered: true });
};

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.6));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 1500));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 600));
  });
}

async function inspect(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const vw = doc.clientWidth;
    const overflowers = [];
    document.querySelectorAll("body *").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > vw + 1 || r.left < -1)) {
        const cs = getComputedStyle(el);
        if (cs.position === "fixed" || cs.visibility === "hidden") return;
        let p = el.parentElement,
          clipped = false;
        while (p) {
          const ps = getComputedStyle(p);
          if (/(hidden|auto|scroll|clip)/.test(ps.overflowX)) {
            clipped = true;
            break;
          }
          p = p.parentElement;
        }
        if (!clipped)
          overflowers.push(
            `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} right=${Math.round(r.right)}`
          );
      }
    });
    const headings = [...document.querySelectorAll("h1,h2,h3,h4")].map((h) => {
      const hidden = h.closest(".sr-only") || h.classList.contains("sr-only");
      return `${h.tagName}${hidden ? "(sr-only)" : ""}: ${h.textContent.trim().replace(/\s+/g, " ").slice(0, 80)}`;
    });
    const landmarks = [
      ...document.querySelectorAll(
        "header,nav,main,footer,aside,section[aria-labelledby],[role=region]"
      ),
    ].map(
      (el) =>
        `${el.tagName.toLowerCase()}${el.getAttribute("aria-label") ? `[${el.getAttribute("aria-label")}]` : ""}${el.id ? "#" + el.id : ""}`
    );
    const links = [...document.querySelectorAll("main a[href]")];
    const hrefCounts = {};
    links.forEach((a) => {
      const h = a.getAttribute("href");
      hrefCounts[h] = (hrefCounts[h] || 0) + 1;
    });
    const dupHrefs = Object.entries(hrefCounts)
      .filter(([, n]) => n > 1)
      .map(([h, n]) => `${h} ×${n}`);
    const imgs = [...document.querySelectorAll("img")].map((img) => ({
      src: (img.currentSrc || img.src).replace(location.origin, "").slice(0, 140),
      alt: img.alt.slice(0, 60),
      loading: img.loading,
      fetchpriority: img.getAttribute("fetchpriority"),
      natural: `${img.naturalWidth}x${img.naturalHeight}`,
      rendered: `${Math.round(img.getBoundingClientRect().width)}x${Math.round(img.getBoundingClientRect().height)}`,
      sizes: img.sizes || null,
    }));
    const hiddenReveal = [...document.querySelectorAll("[data-reveal]")].filter(
      (el) => getComputedStyle(el).opacity === "0"
    ).length;
    const tinyTargets = [...document.querySelectorAll("main a[href], main button, main summary")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.height < 24 || r.width < 24);
      })
      .map(
        (el) =>
          `${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 40)}" ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`
      );
    const resources = performance.getEntriesByType("resource");
    const byType = {};
    let total = 0;
    resources.forEach((r) => {
      const t = r.initiatorType;
      byType[t] = (byType[t] || 0) + (r.transferSize || 0);
      total += r.transferSize || 0;
    });
    const nav = performance.getEntriesByType("navigation")[0];
    const imageResources = resources
      .filter((r) => r.initiatorType === "img" || /_next\/image/.test(r.name))
      .map((r) => ({
        url: r.name.replace(location.origin, "").slice(0, 160),
        transferKB: Math.round((r.transferSize || 0) / 1024),
        decodedKB: Math.round((r.decodedBodySize || 0) / 1024),
      }));
    return {
      title: document.title,
      metaDescription: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      jsonLdTypes: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
        try {
          const j = JSON.parse(s.textContent);
          return j["@type"] || (j["@graph"] || []).map((g) => g["@type"]).join("+");
        } catch {
          return "invalid";
        }
      }),
      docHeight: doc.scrollHeight,
      viewportWidth: vw,
      horizontalOverflow: doc.scrollWidth > vw,
      scrollWidth: doc.scrollWidth,
      overflowers: overflowers.slice(0, 15),
      headings,
      landmarks,
      mainLinkCount: links.length,
      dupHrefs,
      imgs,
      hiddenRevealCount: hiddenReveal,
      revealTotal: document.querySelectorAll("[data-reveal]").length,
      tinyTargets: tinyTargets.slice(0, 20),
      transferKB: Math.round(total / 1024),
      transferByTypeKB: Object.fromEntries(
        Object.entries(byType).map(([k, v]) => [k, Math.round(v / 1024)])
      ),
      documentTransferKB: nav ? Math.round(nav.transferSize / 1024) : null,
      ttfb: nav ? Math.round(nav.responseStart) : null,
      domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
      load: nav ? Math.round(nav.loadEventEnd) : null,
      imageResources,
      lenisActive: doc.classList.contains("lenis"),
      vitals: window.__vitals,
    };
  });
}

async function focusWalk(page, steps) {
  const seq = [];
  for (let i = 0; i < steps; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(60);
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return { tag: "body" };
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const visibleIndicator =
        (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) ||
        (cs.boxShadow && cs.boxShadow !== "none");
      return {
        tag: el.tagName.toLowerCase(),
        text: (el.getAttribute("aria-label") || el.textContent || "")
          .trim()
          .replace(/\s+/g, " ")
          .slice(0, 70),
        href: el.getAttribute("href"),
        visibleIndicator,
        inViewport: r.top >= 0 && r.bottom <= window.innerHeight,
        opacity: cs.opacity,
      };
    });
    seq.push(info);
  }
  return seq;
}

const browser = await chromium.launch({ executablePath: EXEC });

for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
  for (const motion of ["no-preference", "reduce"]) {
    const isMobile = vpName === "mobile";
    const ctx = await browser.newContext({
      viewport: vp,
      deviceScaleFactor: isMobile ? 3 : 1,
      isMobile,
      hasTouch: vpName !== "desktop",
      reducedMotion: motion,
      userAgent: isMobile
        ? "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"
        : undefined,
    });
    await ctx.addInitScript(vitalsInit);
    for (const [pageName, route] of Object.entries(PAGES)) {
      // Only run reduced-motion on portfolio + ledgerguard to keep the run focused.
      if (motion === "reduce" && pageName === "alwaysgeeky") continue;
      const page = await ctx.newPage();
      const consoleErrors = [];
      page.on("console", (m) => {
        if (m.type() === "error") consoleErrors.push(m.text().slice(0, 200));
      });
      page.on("pageerror", (e) => consoleErrors.push(String(e).slice(0, 200)));
      const t0 = Date.now();
      await page.goto(BASE + route, { waitUntil: "load" });
      await page.waitForTimeout(2500);
      const tag = `${pageName}-${vp.width}${motion === "reduce" ? "-reduced-motion" : ""}`;

      // First viewport, before any scrolling.
      await page.screenshot({ path: path.join(SHOTS, `${tag}-first-viewport.png`), scale: "css" });
      const beforeScroll = await inspect(page);

      // Full-page without scrolling: shows content that is hidden until intersection.
      let unscrolledShot = null;
      if (motion === "no-preference" && pageName !== "alwaysgeeky" && vpName === "desktop") {
        unscrolledShot = `${tag}-full-unscrolled.jpg`;
        await page.screenshot({
          path: path.join(SHOTS, unscrolledShot),
          fullPage: true,
          type: "jpeg",
          quality: 55,
          scale: "css",
        });
      }

      await scrollThrough(page);
      const afterScroll = await inspect(page);
      await page.screenshot({
        path: path.join(SHOTS, `${tag}-full.jpg`),
        fullPage: true,
        type: "jpeg",
        quality: 60,
        scale: "css",
      });

      let focus = null;
      if (vpName === "desktop" && pageName !== "alwaysgeeky") {
        await page.goto(BASE + route, { waitUntil: "load" });
        await page.waitForTimeout(1500);
        focus = await focusWalk(page, pageName === "portfolio" ? 45 : 35);
      }

      results.runs.push({
        page: pageName,
        route,
        viewport: vpName,
        width: vp.width,
        motion,
        wallMs: Date.now() - t0,
        consoleErrors,
        beforeScroll,
        afterScroll,
        focus,
        unscrolledShot,
      });
      await page.close();
      console.log("done", tag);
    }
    await ctx.close();
  }
}

// Behavioural checks.
const behaviour = {};
{
  const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
  const page = await ctx.newPage();
  await page.goto(BASE + "/portfolio", { waitUntil: "load" });
  await page.waitForTimeout(1500);
  // Skip link.
  await page.keyboard.press("Tab");
  const firstFocus = await page.evaluate(() => document.activeElement?.textContent?.trim());
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  behaviour.skipLink = {
    firstFocus,
    afterEnter: await page.evaluate(
      () => document.activeElement?.id || document.activeElement?.tagName
    ),
  };

  // Index -> case study -> back link.
  await page.click('a[href="/portfolio/ledgerguard"] >> nth=0');
  await page.waitForURL("**/portfolio/ledgerguard");
  await page.waitForTimeout(1500);
  behaviour.afterOpenCaseStudy = await page.evaluate(() => ({
    url: location.pathname,
    scrollY: Math.round(scrollY),
    focused: document.activeElement?.id || document.activeElement?.tagName,
  }));
  const back = page.locator('a[href="/portfolio#case-studies"]').first();
  await back.scrollIntoViewIfNeeded();
  await back.click();
  await page.waitForTimeout(2000);
  behaviour.backToCaseStudies = await page.evaluate(() => {
    const target = document.getElementById("case-studies");
    return {
      url: location.pathname + location.hash,
      scrollY: Math.round(scrollY),
      caseStudiesTop: target ? Math.round(target.getBoundingClientRect().top + scrollY) : null,
      focused: document.activeElement?.id || document.activeElement?.tagName,
    };
  });
  // Browser back from case study to index.
  await page.goto(BASE + "/portfolio", { waitUntil: "load" });
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 2400));
  await page.waitForTimeout(1500);
  const yBefore = await page.evaluate(() => Math.round(scrollY));
  await page.click('a[href="/portfolio/emplifi"] >> nth=0');
  await page.waitForURL("**/portfolio/emplifi");
  await page.waitForTimeout(1200);
  await page.goBack();
  await page.waitForTimeout(2000);
  behaviour.historyBackRestoresScroll = {
    yBefore,
    yAfter: await page.evaluate(() => Math.round(scrollY)),
  };

  // Desktop TOC on index.
  const tocLinks = await page.locator('nav[aria-label="Case studies on this page"] a').count();
  behaviour.indexTocLinks = tocLinks;
  await ctx.close();
}
{
  // Touch: mobile TOC disclosure + tap through.
  const ctx = await browser.newContext({
    viewport: VIEWPORTS.mobile,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "/portfolio/ledgerguard", { waitUntil: "load" });
  await page.waitForTimeout(1500);
  const summary = page.locator("details summary").first();
  await summary.scrollIntoViewIfNeeded();
  await summary.tap();
  await page.waitForTimeout(500);
  const open = await page.evaluate(() => document.querySelector("details")?.open);
  await page.screenshot({ path: path.join(SHOTS, "ledgerguard-390-toc-open.png"), scale: "css" });
  const outcome = page.locator('details a[href$="-outcome"]').first();
  await outcome.tap();
  await page.waitForTimeout(1800);
  behaviour.mobileToc = {
    openedOnTap: open,
    afterTapOutcome: await page.evaluate(() => {
      const el = document.getElementById("ledgerguard-outcome");
      return {
        hash: location.hash,
        targetTop: el ? Math.round(el.getBoundingClientRect().top) : null,
        detailsOpen: document.querySelector("details")?.open,
      };
    }),
  };
  // Mobile nav menu.
  await page.goto(BASE + "/portfolio", { waitUntil: "load" });
  await page.waitForTimeout(1200);
  const menuBtn = page.getByRole("button", { name: /open menu/i });
  behaviour.mobileMenuButton = await menuBtn.count();
  if (behaviour.mobileMenuButton) {
    await menuBtn.first().tap();
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(SHOTS, "portfolio-390-menu-open.png"), scale: "css" });
    behaviour.mobileMenu = await page.evaluate(() => ({
      expanded: document.querySelector("[aria-expanded]")?.getAttribute("aria-expanded"),
      focused: document.activeElement?.textContent?.trim().slice(0, 40),
      bodyOverflow: getComputedStyle(document.body).overflow,
    }));
  }
  await ctx.close();
}
{
  // Image delivery: what next/image serves for the LedgerGuard hero at desktop.
  const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
  const page = await ctx.newPage();
  const imgs = [];
  page.on("response", async (r) => {
    if (/_next\/image|portfolio-media/.test(r.url())) {
      const h = r.headers();
      imgs.push({
        url: r.url().replace(BASE, "").slice(0, 160),
        status: r.status(),
        type: h["content-type"],
        lengthKB: h["content-length"] ? Math.round(+h["content-length"] / 1024) : null,
        cache: h["x-vercel-cache"] || null,
      });
    }
  });
  for (const route of ["/portfolio/ledgerguard", "/portfolio/alwaysgeeky", "/portfolio/mapbylaw"]) {
    await page.goto(BASE + route, { waitUntil: "load" });
    await page.waitForTimeout(2500);
  }
  behaviour.imageResponses = imgs;
  await ctx.close();
}

results.behaviour = behaviour;
await browser.close();
fs.writeFileSync(OUT, JSON.stringify(results, null, 2));
console.log("wrote", OUT);
