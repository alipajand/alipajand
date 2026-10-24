// Records the prototype as real motion: Chromium screencast frames, assembled with ffmpeg.
//   node capture/record.mjs <outDir> <desktop|mobile|reduce>
// Scrolling is native (window.scrollTo on an eased rAF loop, standing in for a reader's wheel or
// thumb). The cursor dot is injected by this script for legibility; it is not part of the prototype.
// Writes <name>.mp4 plus <name>-marks.json; the desktop run also writes the beat clips, and the
// desktop and mobile runs each write their match cut as its own clip.
import { createRequire } from "node:module";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "./serve.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const { chromium } = createRequire(join(process.env.NODE_PATH ?? ".", "noop.js"))(
  "playwright-core"
);
const [outArg, mode = "desktop"] = process.argv.slice(2);
const out = resolve(outArg);
const MODES = {
  desktop: { width: 1440, height: 900, scale: 1, reduce: false },
  mobile: { width: 390, height: 844, scale: 2, reduce: false, mobile: true },
  reduce: { width: 1440, height: 900, scale: 1, reduce: true },
};
const M = MODES[mode];
const name = { desktop: "desktop-full", mobile: "mobile-full", reduce: "reduced-motion" }[mode];
const frames = join(out, `.frames-${mode}`);
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames, { recursive: true });

const server = await serve(join(here, "../prototype"));
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const ctx = await browser.newContext({
  viewport: { width: M.width, height: M.height },
  deviceScaleFactor: M.scale,
  isMobile: !!M.mobile,
  hasTouch: !!M.mobile,
  reducedMotion: M.reduce ? "reduce" : "no-preference",
});
const page = await ctx.newPage();
await page.setContent('<body style="margin:0;background:#ebe6da"></body>');

// Screencast: every compositor frame, with its own timestamp.
const cdp = await ctx.newCDPSession(page);
const shots = [];
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

// Eased native scroll to an absolute y, or to an element's top (minus an offset).
async function glide(target, ms, offset = 0) {
  await page.evaluate(
    ([target, ms, offset]) =>
      new Promise((done) => {
        const el = typeof target === "string" ? document.querySelector(target) : null;
        const max = document.documentElement.scrollHeight - innerHeight;
        const to = Math.min(max, el ? el.getBoundingClientRect().top + scrollY - offset : target);
        const from = scrollY;
        const t0 = performance.now();
        const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
        (function step(now) {
          const k = Math.min(1, (now - t0) / ms);
          scrollTo(0, from + (to - from) * ease(k));
          if (k < 1) requestAnimationFrame(step);
          else done();
        })(t0);
      }),
    [target, ms, offset]
  );
}

// Scroll offset at a fraction of the way through beat C, the boundary and its workspace states.
function boundaryY(f) {
  const seq = document.getElementById("sequence");
  const a = seq.offsetTop + document.getElementById("boundary").offsetTop - innerHeight;
  const z =
    seq.offsetTop + document.querySelector('[data-beat="land"]').offsetTop - innerHeight * 1.1;
  return a + (z - a) * f;
}

async function tap(selector) {
  const box = await page.locator(selector).first().boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.evaluate(
    ([x, y]) =>
      (document.getElementById("rec-cursor").style.transform = `translate(${x}px,${y}px)`),
    [x, y]
  );
  await wait(520);
  await page.locator(selector).first().click({ noWaitAfter: true });
}

// ---- the run ----
mark("load");
await page.goto("http://localhost:4417/index.html");
await page.evaluate(() => document.fonts.ready);
await addCursor();
await wait(1400);

if (M.reduce) {
  await glide("#work", 1600);
  await wait(1400);
  await glide("#anatomy", 1200);
  await wait(900);
  await glide(".strata--static", 900, 90);
  await wait(500);
  await tap('[data-layer-to="3"]');
  await wait(1300);
  await tap('[data-layer-to="3"]');
  await wait(700);
  await glide("#boundary", 2200);
  await wait(600);
  await glide(".wsx__fig", 900, 90);
  await wait(500);
  await glide(".wsx__states", 700, M.height * 0.5);
  await tap('[data-ws-to="partial"]');
  await wait(1100);
  await tap('[data-ws-to="confirmed"]');
  await wait(1200);
  await glide("#project-ledgerguard", 2000);
  await wait(1400);
  await glide('#project-ledgerguard a[href="ledgerguard.html"]', 1200, M.height * 0.6);
  await wait(400);
  await tap('#project-ledgerguard a[href="ledgerguard.html"]');
  await page.waitForURL(/ledgerguard/);
  await addCursor();
  await wait(1600);
  await tap(".cs__back");
  await page.waitForURL(/index\.html#project/);
  await addCursor();
  await wait(1600);
} else {
  const slow = M.mobile ? 1.15 : 1;
  mark("opening");
  await glide("#work", 2300 * slow);
  await wait(600);
  // B: the anatomy, then one layer picked out by hand and put back
  mark("anatomy");
  await glide("#anatomy", 2400 * slow, M.mobile ? M.height * 0.6 : 0);
  await wait(400);
  await glide('[data-layer-to="4"]', 900 * slow, M.height * 0.7);
  await wait(300);
  await tap('[data-layer-to="4"]');
  await wait(1200);
  await tap('[data-layer-to="4"]');
  await wait(500);
  // C: the boundary uncovers the workspace; scrolling plays its review states
  mark("boundary");
  await glide(await page.evaluate(boundaryY, 0.15), 1600 * slow);
  await wait(300);
  await glide(await page.evaluate(boundaryY, 0.95), 3400 * slow);
  await wait(600);
  // D: the match cut, slow enough to follow the one screenshot into the story
  mark("matchcut");
  await glide("#project-ledgerguard", 3600 * slow);
  await wait(900);
  mark("landed");
  await glide('#project-ledgerguard a[href="ledgerguard.html"]', 1300, M.height * 0.62);
  await wait(400);
  mark("detail");
  await wait(200);
  await tap('#project-ledgerguard a[href="ledgerguard.html"]');
  await page.waitForURL(/ledgerguard/);
  await addCursor();
  await wait(1300);
  await glide(M.height * 0.7, 1200);
  await wait(500);
  await glide(0, 900);
  await wait(300);
  await tap(".cs__back");
  await page.waitForURL(/index\.html#project/);
  await addCursor();
  await wait(1000);
}
mark("end");

await cdp.send("Page.stopScreencast");
await browser.close();
server.close();

// ---- assemble: hold each frame until the next one, then resample to a constant 30 fps ----
const list = [];
const start = marks.load;
const usable = shots.filter((s) => s.t >= start);
usable.forEach((s, i) => {
  const next = usable[i + 1]?.t ?? marks.end;
  list.push(`file '${s.file}'`, `duration ${Math.max(0.001, next - s.t).toFixed(4)}`);
});
list.push(`file '${usable.at(-1).file}'`);
writeFileSync(join(frames, "list.txt"), list.join("\n") + "\n");

const video = join(out, `${name}.mp4`);
const ff = (args) => {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    stdio: "inherit",
  });
  if (r.status !== 0) throw new Error("ffmpeg failed: " + args.join(" "));
};
const even = "scale=trunc(iw/2)*2:trunc(ih/2)*2";
ff([
  ...["-f", "concat", "-safe", "0", "-i", join(frames, "list.txt")],
  ...["-vf", `${even},fps=30`, "-c:v", "libx264", "-crf", "27", "-preset", "veryslow"],
  ...["-pix_fmt", "yuv420p", "-movflags", "+faststart", video],
]);

const rel = Object.fromEntries(Object.entries(marks).map(([k, v]) => [k, +(v - start).toFixed(2)]));
writeFileSync(join(out, `${name}-marks.json`), JSON.stringify(rel, null, 2) + "\n");
console.log(name, `${usable.length} frames`, `${rel.end}s`, rel);

// The desktop run also yields one clip per beat; desktop and mobile each yield their match cut.
if (mode !== "reduce") {
  const clips =
    mode === "desktop"
      ? [
          ["01-cut-reveal", 0, rel.anatomy],
          ["02-anatomy", rel.anatomy - 0.2, rel.boundary],
          ["03-review-boundary", rel.boundary - 0.2, rel.matchcut],
          ["04-match-cut", rel.matchcut - 0.3, rel.landed],
          ["05-into-the-case-study", rel.landed - 0.3, rel.end],
        ]
      : [["mobile-match-cut", rel.matchcut - 0.3, rel.landed]];
  for (const [clip, a, b] of clips) {
    ff([
      "-ss",
      String(a),
      "-to",
      String(b),
      "-i",
      video,
      "-c:v",
      "libx264",
      "-crf",
      "27",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      join(out, `${clip}.mp4`),
    ]);
  }
}
rmSync(frames, { recursive: true, force: true });
