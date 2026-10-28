// Navigation-loop leak probe for docs/audits/code-quality-2026-10-28.md (CQ-L1).
// Against a production server (pnpm build && pnpm exec next start -p 3526):
//   node docs/audits/evidence/cleanup/nav-leak-probe.mjs "$PWD" http://localhost:3526 chromium 20
// Counts window/document/MediaQueryList listeners, live observers, intervals and pending rAF
// callbacks after each client-side route change; in Chromium also DOM counters after forced GC.
import { createRequire } from "node:module";
import { join } from "node:path";

const [repo, base = "http://localhost:3526", engine = "chromium", roundsArg = "20"] =
  process.argv.slice(2);
const require = createRequire(join(repo, "package.json"));
const pw = require("@playwright/test");
const ROUNDS = Number(roundsArg);

const init = () => {
  const probe = {
    rafPending: new Set(),
    rafRequested: 0,
    listeners: new Map(), // key -> Set of listener refs (global targets + MediaQueryList)
    elementListenersAdded: 0,
    elementListenersRemoved: 0,
    observers: { IntersectionObserver: 0, ResizeObserver: 0, MutationObserver: 0 },
    intervals: new Set(),
    timeoutsPending: new Set(),
  };
  window.__probe = probe;
  const raf = window.requestAnimationFrame.bind(window);
  const caf = window.cancelAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => {
    const id = raf((t) => {
      probe.rafPending.delete(id);
      cb(t);
    });
    probe.rafRequested += 1;
    probe.rafPending.add(id);
    return id;
  };
  window.cancelAnimationFrame = (id) => {
    probe.rafPending.delete(id);
    caf(id);
  };
  const si = window.setInterval.bind(window);
  const ci = window.clearInterval.bind(window);
  window.setInterval = (...a) => {
    const id = si(...a);
    probe.intervals.add(id);
    return id;
  };
  window.clearInterval = (id) => {
    probe.intervals.delete(id);
    ci(id);
  };
  const isGlobal = (t) =>
    t === window ||
    t === document ||
    (typeof MediaQueryList !== "undefined" && t instanceof MediaQueryList);
  const keyOf = (t, type) =>
    `${t === window ? "window" : t === document ? "document" : `mql(${t.media})`}:${type}`;
  const add = EventTarget.prototype.addEventListener;
  const remove = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.addEventListener = function (type, l, o) {
    if (l) {
      if (isGlobal(this)) {
        const k = keyOf(this, type);
        if (!probe.listeners.has(k)) probe.listeners.set(k, new Set());
        probe.listeners.get(k).add(l);
      } else probe.elementListenersAdded += 1;
    }
    return add.call(this, type, l, o);
  };
  EventTarget.prototype.removeEventListener = function (type, l, o) {
    if (l) {
      if (isGlobal(this)) probe.listeners.get(keyOf(this, type))?.delete(l);
      else probe.elementListenersRemoved += 1;
    }
    return remove.call(this, type, l, o);
  };
  // MediaQueryList.addListener (legacy) routes through addEventListener in modern engines.
  for (const name of Object.keys(probe.observers)) {
    const Native = window[name];
    if (!Native) continue;
    window[name] = class extends Native {
      constructor(...a) {
        super(...a);
        this.__live = false;
      }
      observe(...a) {
        if (!this.__live) {
          this.__live = true;
          probe.observers[name] += 1;
        }
        return super.observe(...a);
      }
      disconnect() {
        if (this.__live) {
          this.__live = false;
          probe.observers[name] -= 1;
        }
        return super.disconnect();
      }
    };
  }
};

const snap = (page) =>
  page.evaluate(() => {
    const p = window.__probe;
    const listeners = {};
    let total = 0;
    p.listeners.forEach((s, k) => {
      if (s.size) listeners[k] = s.size;
      total += s.size;
    });
    return {
      globalListeners: total,
      listeners,
      observers: { ...p.observers },
      intervals: p.intervals.size,
      rafPending: p.rafPending.size,
      elementNet: p.elementListenersAdded - p.elementListenersRemoved,
    };
  });

const rafDuring = async (page, ms) => {
  const start = await page.evaluate(() => window.__probe.rafRequested);
  await page.waitForTimeout(ms);
  return page.evaluate((s) => window.__probe.rafRequested - s, start);
};

// Client-side route cycle through header/footer links; the 404 is entered by a hard load once.
const CYCLE = ["/portfolio", "/writing", "/open-source", "/engineering-principles", "/now", "/"];

const run = async () => {
  const browser = await pw[engine].launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.addInitScript(init);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const cdp = engine === "chromium" ? await context.newCDPSession(page) : null;
  const dom = async () => {
    if (!cdp) return null;
    await cdp.send("HeapProfiler.collectGarbage");
    await cdp.send("HeapProfiler.collectGarbage");
    return cdp.send("Memory.getDOMCounters");
  };
  const baseline = { ...(await snap(page)), dom: await dom() };
  const rows = [];
  let hardLoads = 0;
  let step = 0;
  const via = [];
  for (let r = 0; r < ROUNDS; r += 1) {
    const target = CYCLE[r % CYCLE.length];
    const link = page
      .locator(`header a[href="${target}"], footer a[href="${target}"], main a[href="${target}"]`)
      .first();
    await page.evaluate(() => (window.__marker = 1));
    if (await link.count()) await link.click();
    else {
      via.push(target);
      await page.evaluate((t) => window.next.router.push(t), target);
    }
    await page.waitForURL((u) => u.pathname === target);
    await page.waitForTimeout(600);
    // scroll a bit to wake scroll-linked islands, then back to top
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(300);
    await page.mouse.wheel(0, -1200);
    await page.waitForTimeout(400);
    const marker = await page.evaluate(() => window.__marker === 1);
    if (!marker) hardLoads += 1;
    step += 1;
    rows.push({ step, path: target, clientNav: marker, ...(await snap(page)), dom: await dom() });
  }
  const end = await snap(page);
  const idleRaf = await rafDuring(page, 1500);
  // Does a header link on the 404 navigate client-side?
  await page.goto(`${base}/this-page-does-not-exist`, { waitUntil: "networkidle" });
  await page.evaluate(() => (window.__marker = 1));
  await page.locator('header a[href="/portfolio"]').first().click();
  await page.waitForURL((u) => u.pathname === "/portfolio");
  await page.waitForTimeout(500);
  const notFoundHeaderClientNav = await page.evaluate(() => window.__marker === 1);
  console.log(
    JSON.stringify(
      {
        engine,
        rounds: ROUNDS,
        baseline,
        end,
        idleRafRequestsOver1500ms: idleRaf,
        hardLoads,
        routerPushFor: [...new Set(via)],
        notFoundHeaderClientNav,
        errors,
        rows,
      },
      null,
      1
    )
  );
  await browser.close();
};
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
