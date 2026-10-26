// Records the P2 prototype as real motion.
//   node capture/record.mjs <outDir> <desktop|mobile|reduce|lg-flat|webkit-lg-flat>
// Chromium runs use screencast frames (every compositor frame, with its timestamp), assembled
// with ffmpeg at a constant 30 fps. The WebKit run uses Playwright's own video recorder, the
// only one WebKit offers; it is headless WebKit, not shipping Safari.
// Scrolling is native (window.scrollTo on an eased rAF loop, standing in for a reader's wheel or
// thumb). The cursor dot is injected by this script for legibility; it is not part of the
// prototype. Writes <name>.mp4 and <name>-marks.json, and cuts the named clips.
import { createRequire } from "node:module";
import { mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "./serve.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const req = createRequire(join(process.env.NODE_PATH ?? ".", "noop.js"));
const { chromium } = req("playwright-core");
const engines = process.env.ENGINES_NODE_PATH
  ? createRequire(join(process.env.ENGINES_NODE_PATH, "noop.js"))("playwright-core")
  : req("playwright-core");
const [outArg, mode = "desktop"] = process.argv.slice(2);
const out = resolve(outArg);
const MODES = {
  desktop: { width: 1440, height: 900, scale: 1 },
  mobile: { width: 390, height: 844, scale: 2, mobile: true },
  reduce: { width: 1440, height: 900, scale: 1, reduce: true },
  "lg-flat": { width: 1440, height: 900, scale: 1 },
  "webkit-lg-flat": { width: 1440, height: 900, scale: 1, webkit: true },
};
const M = MODES[mode];
const name = {
  desktop: "desktop-full",
  mobile: "mobile-full",
  reduce: "reduced-motion",
  "lg-flat": "ledgerguard-flat-depth",
  "webkit-lg-flat": "webkit-ledgerguard-flat-depth",
}[mode];
const frames = join(out, `.frames-${mode}`);
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames, { recursive: true });

const P2 = "http://localhost:4417/p2-portability/prototype/";
const P1 = "http://localhost:4417/cinematic-exploration/prototype/";
const server = await serve(join(here, "../.."));
const browser = M.webkit
  ? await engines.webkit.launch()
  : await chromium.launch({ executablePath: process.env.CHROME_PATH });
const ctx = await browser.newContext({
  viewport: { width: M.width, height: M.height },
  deviceScaleFactor: M.scale,
  isMobile: !!M.mobile,
  hasTouch: !!M.mobile,
  reducedMotion: M.reduce ? "reduce" : "no-preference",
  ...(M.webkit ? { recordVideo: { dir: frames, size: { width: M.width, height: M.height } } } : {}),
});
const page = await ctx.newPage();
await page.setContent('<body style="margin:0;background:#ebe6da"></body>');

const shots = [];
let cdp = null;
if (!M.webkit) {
  cdp = await ctx.newCDPSession(page);
  cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
    const file = join(frames, `f${String(shots.length).padStart(5, "0")}.jpg`);
    writeFileSync(file, Buffer.from(data, "base64"));
    shots.push({ file, t: metadata.timestamp });
    await cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", {
    format: "jpeg",
    quality: 90,
    maxWidth: M.width * M.scale,
    maxHeight: M.height * M.scale,
    everyNthFrame: 1,
  });
}

const t0 = Date.now() / 1000;
const marks = {};
const mark = (k) => (marks[k] = Date.now() / 1000);
const wait = (ms) => page.waitForTimeout(ms);

const CURSOR = `(() => {
  const d = document.createElement("div");
  d.id = "rec-cursor";
  d.setAttribute("aria-hidden", "true");
  d.style.cssText = "position:fixed;left:0;top:0;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;" +
    "background:rgba(22,20,15,.55);box-shadow:0 0 0 2px #ebe6da;z-index:2147483647;pointer-events:none;" +
    "transform:translate(" + innerWidth * 0.62 + "px," + innerHeight * 0.7 + "px);transition:transform .45s cubic-bezier(.3,.7,.2,1)";
  document.documentElement.appendChild(d);
})()`;
const addCursor = () => page.evaluate(CURSOR);

async function glide(target, ms, offset = 0) {
  await page.evaluate(
    ([target, ms, offset]) =>
      new Promise((done) => {
        const el = typeof target === "string" ? document.querySelector(target) : null;
        const max = document.documentElement.scrollHeight - innerHeight;
        const to = Math.min(max, el ? el.getBoundingClientRect().top + scrollY - offset : target);
        const from = scrollY;
        const s = performance.now();
        const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
        (function step(now) {
          const k = Math.min(1, (now - s) / ms);
          scrollTo(0, from + (to - from) * ease(k));
          if (k < 1) requestAnimationFrame(step);
          else done();
        })(s);
      }),
    [target, ms, offset]
  );
}

// the scroll offset at a fraction of a scene's sequence
const seqY = (f) =>
  page.evaluate((f) => {
    const s = document.querySelector("[data-scene], #sequence");
    return s.offsetTop + (s.offsetHeight - innerHeight) * f;
  }, f);

async function point(selector) {
  const box = await page.locator(selector).first().boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.evaluate(
    ([x, y]) =>
      (document.getElementById("rec-cursor").style.transform = `translate(${x}px,${y}px)`),
    [x, y]
  );
  await wait(480);
  return { x, y };
}

async function hover(selector) {
  const { x, y } = await point(selector);
  await page.mouse.move(x, y);
}

async function tap(selector) {
  await point(selector);
  await page.locator(selector).first().click({ noWaitAfter: true });
}

async function arrive(re) {
  await page.waitForURL(re);
  await page.evaluate(() => document.fonts.ready);
  await addCursor();
}

// ---- the runs ----
mark("load");
if (mode === "lg-flat" || mode === "webkit-lg-flat") {
  // the LedgerGuard sequence in its default, flat presentation (3D runs only with ?depth=3d)
  await page.goto(P1 + "index.html");
  await page.evaluate(() => document.fonts.ready);
  await addCursor();
  await wait(1300);
  mark("opening");
  await glide(await seqY(0.18), 2300);
  await wait(500);
  mark("section");
  await glide(await seqY(0.42), 2600);
  await wait(500);
  mark("boundary");
  await glide(await seqY(0.72), 3200);
  await wait(500);
  mark("matchcut");
  await glide(await seqY(1), 3400);
  await wait(1200);
} else {
  const slow = M.mobile ? 1.15 : 1;
  await page.goto(P2 + "index.html");
  await page.evaluate(() => document.fonts.ready);
  await addCursor();
  await wait(1400);
  mark("index");
  // the pinned condensation, at reading speed: the identity block slides away, then the bays
  // close toward the cut until they are the register's top row
  const condensed = await page.evaluate(() => {
    const t = window.ScrollTrigger && ScrollTrigger.getAll()[0];
    return t ? t.end : document.getElementById("work").offsetTop;
  });
  await glide(condensed, 3000 * slow);
  await wait(700);
  mark("condensed");
  if (!M.mobile) {
    for (const slug of ["alwaysgeeky", "emplifi", "ledgerguard"]) {
      await hover(`.bay[data-row="${slug}"] .bay__sect`);
      await wait(700);
    }
  }
  await glide(".sup", 1500 * slow, M.mobile ? 90 : 120);
  await wait(900);
  await glide(".caps", 900, M.mobile ? 200 : 260);
  await tap('[data-cap-to="systems"]');
  await wait(1400);
  await tap('[data-cap-to="systems"]');
  await wait(500);
  await glide(condensed, 1400);
  await wait(400);
  // the optional path: the bay's Scene link
  await tap('.bay[data-row="alwaysgeeky"] .bay__go');
  await arrive(/alwaysgeeky/);
  await wait(1300);
  mark("ag");
  if (M.reduce) {
    for (const id of ["#detail", "#assembly", "#gates", "#case"]) {
      await glide(id, 1500, 60);
      await wait(1200);
    }
  } else {
    await glide(await seqY(0.24), 2600 * slow);
    await wait(500);
    await glide(await seqY(0.5), 2600 * slow);
    await wait(500);
    await glide(await seqY(0.74), 3000 * slow);
    await wait(400);
    mark("ag-land");
    await glide(await seqY(1), 3200 * slow);
    await wait(900);
    mark("ag-landed");
  }
  await glide(".sheetnav", 2400 * slow, M.height * 0.5);
  await wait(400);
  // the next sheet is Emplifi's case study; its register link returns to Emplifi in the
  // condensed register, and Emplifi's Scene link opens the scene
  await tap(".sheetnav__a--next");
  await arrive(/emplifi\.html#case/);
  await wait(1300);
  mark("em-case");
  await glide(".sheetnav", 1800 * slow, M.height * 0.5);
  await wait(400);
  await tap('.sheetnav a[href="index.html#project-emplifi"]');
  await arrive(/index\.html#project-emplifi/);
  await wait(1500);
  mark("return");
  await tap('.bay[data-row="emplifi"] .bay__go');
  await arrive(/emplifi\.html$/);
  await wait(1300);
  mark("em");
  if (M.reduce) {
    for (const id of ["#chart", "#path", "#composition", "#budget", "#case"]) {
      await glide(id, 1500, 60);
      await wait(1200);
    }
  } else {
    await glide(await seqY(0.2), 2400 * slow);
    await wait(400);
    await glide(await seqY(0.42), 2600 * slow);
    await wait(400);
    await glide(await seqY(0.62), 2600 * slow);
    await wait(400);
    await glide(await seqY(0.8), 2600 * slow);
    await wait(500);
    mark("em-land");
    await glide(await seqY(1), 3200 * slow);
    await wait(900);
    mark("em-landed");
  }
  await glide(M.height * 0.4 + (await page.evaluate(() => scrollY)), 1200);
  await wait(800);
}
mark("end");

let video = join(out, `${name}.mp4`);
const ff = (args) => {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    stdio: "inherit",
  });
  if (r.status !== 0) throw new Error("ffmpeg failed: " + args.join(" "));
};
const even = "scale=trunc(iw/2)*2:trunc(ih/2)*2";
const enc = ["-c:v", "libx264", "-crf", "27", "-preset", "veryslow", "-pix_fmt", "yuv420p"];
const start = marks.load;

if (M.webkit) {
  await page.close();
  await ctx.close();
  await browser.close();
  server.close();
  const webm = readdirSync(frames).find((f) => f.endsWith(".webm"));
  renameSync(join(frames, webm), join(frames, "raw.webm"));
  // the recorder starts with the context; trim to the page's first load
  ff([
    ...["-ss", String(Math.max(0, start - t0)), "-i", join(frames, "raw.webm")],
    ...["-vf", `${even},fps=30`, ...enc, "-movflags", "+faststart", video],
  ]);
} else {
  await cdp.send("Page.stopScreencast");
  await browser.close();
  server.close();
  const list = [];
  const usable = shots.filter((s) => s.t >= start);
  usable.forEach((s, i) => {
    const next = usable[i + 1]?.t ?? marks.end;
    list.push(`file '${s.file}'`, `duration ${Math.max(0.001, next - s.t).toFixed(4)}`);
  });
  list.push(`file '${usable.at(-1).file}'`);
  writeFileSync(join(frames, "list.txt"), list.join("\n") + "\n");
  ff([
    ...["-f", "concat", "-safe", "0", "-i", join(frames, "list.txt")],
    ...["-vf", `${even},fps=30`, ...enc, "-movflags", "+faststart", video],
  ]);
  console.log(`${usable.length} frames`);
}

const rel = Object.fromEntries(Object.entries(marks).map(([k, v]) => [k, +(v - start).toFixed(2)]));
writeFileSync(join(out, `${name}-marks.json`), JSON.stringify(rel, null, 2) + "\n");
console.log(name, `${rel.end}s`, rel);

const clips = {
  desktop: [
    ["01-index", rel.index - 0.2, rel.ag],
    ["02-alwaysgeeky-scene", rel.ag - 0.2, rel["ag-land"]],
    ["03-alwaysgeeky-match-cut", rel["ag-land"] - 0.3, rel["ag-landed"]],
    ["04-emplifi-scene", rel.em - 0.2, rel["em-land"]],
    ["05-emplifi-match-cut", rel["em-land"] - 0.3, rel["em-landed"]],
    ["06-case-to-register", rel["em-case"] - 0.2, rel.em],
  ],
  mobile: [
    ["mobile-index", rel.index - 0.2, rel.ag],
    ["mobile-alwaysgeeky", rel.ag - 0.2, rel["ag-landed"]],
    ["mobile-emplifi", rel.em - 0.2, rel["em-landed"]],
    ["mobile-case-to-register", rel["em-case"] - 0.2, rel.em],
  ],
}[mode];
for (const [clip, a, b] of clips ?? []) {
  ff([
    "-ss",
    String(a),
    "-to",
    String(b),
    "-i",
    video,
    ...enc,
    "-movflags",
    "+faststart",
    join(out, `${clip}.mp4`),
  ]);
}
rmSync(frames, { recursive: true, force: true });
