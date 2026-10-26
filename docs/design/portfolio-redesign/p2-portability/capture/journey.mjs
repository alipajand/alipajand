// The navigation journey across both prototypes: every internal link resolves with its anchor,
// return links land on the project in the register, cross-project links, browser Back and
// Forward, and layout shift on each landing.
//   node capture/journey.mjs            (W, H set the viewport; RM=1 for reduced motion)
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "./serve.mjs";

const here = dirname(fileURLToPath(import.meta.url));
// playwright-core is deliberately not a project dependency: resolve it from NODE_PATH.
const { chromium } = createRequire(join(process.env.NODE_PATH ?? ".", "noop.js"))(
  "playwright-core"
);
const server = await serve(join(here, "../.."), 4432);
const B = "http://localhost:4432";
const P2 = "/p2-portability/prototype/";
const P1 = "/cinematic-exploration/prototype/";
const W = +(process.env.W ?? 1440),
  H = +(process.env.H ?? 900);
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const ctx = await b.newContext({
  viewport: { width: W, height: H },
  reducedMotion: process.env.RM ? "reduce" : "no-preference",
});
await ctx.addInitScript(() => {
  window.__cls = 0;
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
  }).observe({ type: "layout-shift", buffered: true });
});
const p = await ctx.newPage();
const errs = [];
p.on("pageerror", (e) => errs.push(String(e)));
p.on("response", (r) => r.status() >= 400 && errs.push(`${r.status()} ${r.url()}`));
let fails = 0;
const ok = (n, c, d = "") => {
  if (!c) fails++;
  console.log(`${c ? "PASS" : "FAIL"}  ${n}${d ? "  — " + d : ""}`);
};
const settle = async () => {
  await p.waitForLoadState("networkidle");
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(900);
};
const path = () => new URL(p.url()).pathname + new URL(p.url()).hash;
// where a hash target sits in the viewport, and its id
const landed = () =>
  p.evaluate(() => {
    const id = location.hash.slice(1);
    const el = id && document.getElementById(id);
    if (!el) return { id, found: false };
    const r = el.getBoundingClientRect();
    return {
      id,
      found: true,
      top: Math.round(r.top),
      visible: r.top < innerHeight && r.bottom > 0,
      cls: +window.__cls.toFixed(4),
      y: Math.round(scrollY),
    };
  });

// 1. every same-site link on all five pages resolves and its hash target exists
const pages = [
  P2 + "index.html",
  P2 + "alwaysgeeky.html",
  P2 + "emplifi.html",
  P1 + "index.html",
  P1 + "ledgerguard.html",
];
const seen = new Map();
for (const pg of pages) {
  await p.goto(B + pg, { waitUntil: "networkidle" });
  const links = await p.evaluate(() =>
    [...document.querySelectorAll("a[href]")]
      .map((a) => a.href)
      .filter((h) => h.startsWith(location.origin))
  );
  for (const l of links) if (!seen.has(l)) seen.set(l, pg);
}
const prod = [];
for (const pg of pages) {
  await p.goto(B + pg, { waitUntil: "networkidle" });
  prod.push(
    ...(await p.evaluate(() =>
      [...document.querySelectorAll("a[href^='https://alipajand.com']")].map(
        (a) =>
          `${location.pathname.split("/").slice(-1)}: ${a.textContent.trim().replace(/\s+/g, " ")} -> ${a.getAttribute("href")}`
      )
    ))
  );
}
let bad = [];
for (const [l, from] of seen) {
  const u = new URL(l);
  const r = await ctx.request.get(u.origin + u.pathname);
  if (r.status() !== 200) {
    bad.push(`${from} -> ${l} (${r.status()})`);
    continue;
  }
  if (u.hash.length > 1) {
    const html = await r.text();
    if (!html.includes(`id="${u.hash.slice(1)}"`))
      bad.push(`${from} -> ${l} (no #${u.hash.slice(1)})`);
  }
}
ok(`all ${seen.size} internal links resolve with their anchors`, bad.length === 0, bad.join("; "));
ok(
  "production links are only the projects without a sheet, plus contact",
  prod.every((x) => !/portfolio\/(ledgerguard|alwaysgeeky|emplifi)/i.test(x)),
  prod.join("; ")
);

// 2. index -> LG case -> Back to the work -> lands on LG in the register
const clsLog = [];
await p.goto(B + P2 + "index.html");
await settle();
await p.click("#project-ledgerguard .bay__cs");
await settle();
ok("index: LedgerGuard name opens the LG case study", path() === P1 + "ledgerguard.html", path());
clsLog.push(["LG case", await p.evaluate(() => window.__cls)]);
await p.click(".cs__back");
await settle();
let L = await landed();
ok(
  "LG case: Back to the work lands on LedgerGuard in the register",
  path() === P2 + "index.html#project-ledgerguard" && L.visible,
  JSON.stringify(L)
);
clsLog.push(["register #LG", L.cls]);
// browser Back returns to LG case, Forward to the register at the same project
await p.goBack();
await settle();
ok("Back returns to the LG case", path().startsWith(P1 + "ledgerguard.html"), path());
await p.goForward();
await settle();
L = await landed();
ok("Forward returns to LedgerGuard in the register", L.visible, JSON.stringify(L));

// 3. index -> LG scene -> logo / Work -> register
await p.goto(B + P2 + "index.html");
await settle();
await p.click("#project-ledgerguard .bay__go");
await settle();
ok("index: LedgerGuard Scene opens the LG scene", path() === P1 + "index.html", path());
const lgLinks = await p.evaluate(() => ({
  mark: document.querySelector(".bar__mark")?.getAttribute("href"),
  nav: [...document.querySelectorAll(".bar a")].map((a) => [
    a.textContent.trim(),
    a.getAttribute("href"),
  ]),
}));
ok(
  "LG scene: logo goes to the register",
  /p2-portability\/prototype\/index\.html$/.test(lgLinks.mark ?? ""),
  lgLinks.mark
);
ok(
  "LG scene: Work goes to LedgerGuard in the register",
  lgLinks.nav.some(([t, h]) => t === "Work" && /index\.html#project-ledgerguard$/.test(h)),
  JSON.stringify(lgLinks.nav)
);
await p.click(".bar a:text-is('Work')");
await settle();
L = await landed();
ok(
  "LG scene: Work lands on LedgerGuard",
  L.id === "project-ledgerguard" && L.visible,
  JSON.stringify(L)
);
await p.goBack();
await settle();
ok("Back returns to the LG scene", path().startsWith(P1 + "index.html"), path());

// 4. LG case -> next sheet AG -> AG next EM -> EM next LG; AG/EM register link
await p.goto(B + P1 + "ledgerguard.html");
await settle();
await p.click("a:has-text('Next sheet')");
await settle();
ok("LG case: next sheet opens AG case", path() === P2 + "alwaysgeeky.html#case", path());
L = await landed();
ok("AG case anchor in view", L.visible, JSON.stringify(L));
const sn = async () =>
  p.evaluate(() =>
    [...document.querySelectorAll(".sheetnav a")].map((a) => a.getAttribute("href"))
  );
ok(
  "AG sheetnav: LG case · register #AG · EM case",
  JSON.stringify(await sn()) ===
    JSON.stringify([
      "../../cinematic-exploration/prototype/ledgerguard.html",
      "index.html#project-alwaysgeeky",
      "emplifi.html#case",
    ]),
  JSON.stringify(await sn())
);
await p.click(".sheetnav a[href='emplifi.html#case']");
await settle();
ok("AG -> EM case", path() === P2 + "emplifi.html#case", path());
ok(
  "EM sheetnav: AG case · register #EM · LG case",
  JSON.stringify(await sn()) ===
    JSON.stringify([
      "alwaysgeeky.html#case",
      "index.html#project-emplifi",
      "../../cinematic-exploration/prototype/ledgerguard.html",
    ]),
  JSON.stringify(await sn())
);
await p.click(".sheetnav a[href='index.html#project-emplifi']");
await settle();
L = await landed();
ok(
  "EM: register link lands on Emplifi",
  L.id === "project-emplifi" && L.visible,
  JSON.stringify(L)
);
clsLog.push(["register #EM", L.cls]);
await p.goBack();
await settle();
ok("Back returns to EM", path().startsWith(P2 + "emplifi.html"), path());
await p.goBack();
await settle();
ok("Back again returns to AG", path().startsWith(P2 + "alwaysgeeky.html"), path());
await p.goForward();
await settle();
await p.goForward();
await settle();
L = await landed();
ok(
  "Forward twice returns to Emplifi in the register",
  path() === P2 + "index.html#project-emplifi" && L.visible,
  JSON.stringify(L)
);

// 5. AG/EM bar Index -> register at that project; AG scene from index -> case
await p.goto(B + P2 + "alwaysgeeky.html");
await settle();
await p.click(".bar a:text-is('Index')");
await settle();
L = await landed();
ok(
  "AG bar Index lands on AlwaysGeeky",
  L.id === "project-alwaysgeeky" && L.visible,
  JSON.stringify(L)
);
await p.click("#project-alwaysgeeky .bay__go");
await settle();
ok("register: AG Scene opens the AG scene", path() === P2 + "alwaysgeeky.html", path());
// P1 register list: AG/EM go to the P2 sheets, never production
const others = [];
for (const pg of ["ledgerguard.html", "index.html"]) {
  await p.goto(B + P1 + pg);
  await settle();
  others.push(
    ...(await p.evaluate(() =>
      [...document.querySelectorAll("a")]
        .map((a) => a.getAttribute("href"))
        .filter((h) => /alwaysgeeky|emplifi/.test(h))
    ))
  );
}
await await p.evaluate(() =>
  [...document.querySelectorAll("a")]
    .map((a) => a.getAttribute("href"))
    .filter((h) => /alwaysgeeky|emplifi/.test(h))
);
ok(
  "LG pages send AG/EM to the P2 sheets",
  others.length > 0 && others.every((h) => h.startsWith("../../p2-portability/")),
  JSON.stringify(others)
);
console.log("CLS per landing:", JSON.stringify(clsLog));
ok("no page errors or failed requests", errs.length === 0, errs.slice(0, 5).join("; "));
console.log(fails ? `${fails} failed` : "all passed");
await b.close();
server.close();
