/**
 * Builds contact sheets and a compact summary from a gate run:
 *
 *   RESPONSIVE_EVIDENCE=/tmp/gate pnpm exec playwright test \
 *     e2e/responsive.e2e.ts e2e/interactions.e2e.ts e2e/a11y.e2e.ts e2e/vitals.e2e.ts
 *   node e2e/responsive-sheet.mjs /tmp/gate test-results/responsive-sheet \
 *     [--base http://localhost:3000]
 *
 * With `--base`, it also renders each pinned design page in docs/design/pages next to the running
 * build. Scroll recordings become frame strips when ffmpeg is on the PATH.
 *
 * Captures are emulated Chromium viewports, not real devices.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const baseIndex = args.indexOf("--base");
const base = baseIndex >= 0 ? args.splice(baseIndex, 2)[1] : null;
const [source, target = "test-results/responsive-sheet"] = args;
if (!source) {
  console.error("usage: node e2e/responsive-sheet.mjs <evidence dir> [output dir] [--base url]");
  process.exit(1);
}

const shots = path.join(source, "shots");
const data = path.join(source, "data");
const videos = path.join(source, "videos");
fs.mkdirSync(target, { recursive: true });

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(data, file), "utf8"));
const dataUri = (file, type = "jpeg") =>
  `data:image/${type};base64,${fs.readFileSync(file).toString("base64")}`;
const sizeOf = (name) => {
  const match = /(\d+)x(\d+)/.exec(name);
  return match ? { w: Number(match[1]), h: Number(match[2]) } : { w: 16, h: 9 };
};
const byWidth = (a, b) => sizeOf(a).w - sizeOf(b).w || sizeOf(a).h - sizeOf(b).h;

const page_ = (title, note, body, imageHeight = 220) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  body { margin: 0; padding: 20px; background: #f4f4f1; color: #111; font: 13px/1.35 system-ui, sans-serif; }
  h1 { margin: 0 0 4px; font-size: 18px; }
  h2 { margin: 18px 0 6px; font-size: 14px; }
  p { margin: 0 0 14px; color: #555; }
  .grid { display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-end; }
  figure { margin: 0; }
  img { display: block; height: ${imageHeight}px; border: 1px solid #999; background: #000; }
  figcaption { margin-top: 4px; font-family: ui-monospace, monospace; font-size: 12px; }
</style></head><body><h1>${title}</h1><p>${note}</p>${body}</body></html>`;

const figure = (src, caption) =>
  `<figure><img src="${src}" alt=""><figcaption>${caption}</figcaption></figure>`;

const EMULATED =
  "Emulated Chromium viewports (device scale 1, reduced motion unless noted), top of page. Not real devices.";

const browser = await chromium.launch();
const sheet = await browser.newPage({
  viewport: { width: 1680, height: 600 },
  deviceScaleFactor: 1,
});

const render = async (name, html) => {
  await sheet.setContent(html);
  await sheet.screenshot({
    path: path.join(target, name),
    type: "jpeg",
    quality: 62,
    fullPage: true,
  });
  console.log(`wrote ${path.join(target, name)}`);
};

const allShots = fs.readdirSync(shots).filter((file) => file.endsWith(".jpg"));
const STATE = /^(menu-open|rotate|contact-errors|contact-sent|dialog-.+|contents-.+|filters)$/;
const prefix = (file) => file.split("__")[0];
const routes = [...new Set(allShots.filter((f) => f.includes("__")).map(prefix))]
  .filter((route) => !STATE.test(route))
  .sort();

for (const route of routes) {
  const files = allShots.filter((file) => prefix(file) === route).sort(byWidth);
  await render(
    `sheet-${route}.jpg`,
    page_(
      route,
      EMULATED,
      `<div class="grid">${files
        .map((file) =>
          figure(dataUri(path.join(shots, file)), file.split("__")[1].replace(".jpg", ""))
        )
        .join("")}</div>`
    )
  );
}

const stateSheet = async (name, title, test) => {
  const files = allShots
    .filter((file) => test.test(prefix(file)))
    .sort((a, b) => prefix(a).localeCompare(prefix(b)) || byWidth(a, b));
  if (files.length === 0) return;
  await render(
    name,
    page_(
      title,
      EMULATED,
      `<div class="grid">${files
        .map((file) =>
          figure(dataUri(path.join(shots, file)), file.replace(".jpg", "").replace("__", " "))
        )
        .join("")}</div>`
    )
  );
};
await stateSheet(
  "sheet-shell-states.jpg",
  "Shell and form states",
  /^(menu-open|rotate|contact-.+)$/
);
await stateSheet("sheet-dialogs.jpg", "Screenshot dialogs", /^dialog-.+$/);
await stateSheet(
  "sheet-contents-filters.jpg",
  "Article contents and writing filters",
  /^(contents-.+|filters)$/
);

// Scroll recordings: eight evenly spaced frames from each video.
const hasFfmpeg = (() => {
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();
if (hasFfmpeg && fs.existsSync(videos)) {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "strips-"));
  const rows = [];
  for (const file of fs
    .readdirSync(videos)
    .filter((f) => f.endsWith(".webm"))
    .sort()) {
    const input = path.join(videos, file);
    const seconds = Number(
      execFileSync("ffprobe", [
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "csv=p=0",
        input,
      ]).toString()
    );
    const output = path.join(scratch, file.replace(".webm", ".jpg"));
    execFileSync("ffmpeg", [
      "-v",
      "error",
      "-y",
      "-i",
      input,
      "-vf",
      `fps=8/${seconds.toFixed(2)},scale=-2:300,tile=8x1:padding=6:color=white`,
      "-frames:v",
      "1",
      "-q:v",
      "6",
      output,
    ]);
    rows.push(
      `<h2>${file.replace(".webm", "")} (${seconds.toFixed(1)} s)</h2>${figure(dataUri(output), "")}`
    );
  }
  await render(
    "sheet-scroll-recordings.jpg",
    page_(
      "Scroll recordings",
      "Playwright recordVideo of a slow wheel scroll top to bottom, motion on. Eight evenly spaced frames per recording. Emulated Chromium, not real devices.",
      rows.join(""),
      300
    )
  );
  fs.rmSync(scratch, { recursive: true, force: true });
}

// Pinned design pages beside the running build, first screen at a phone and a desktop width.
const DESIGN_PAIRS = [
  ["home.html", "/"],
  ["portfolio.html", "/portfolio"],
  ...[
    "ledgerguard",
    "tallyfolio",
    "alwaysgeeky",
    "emplifi",
    "controltech",
    "agent-tooling",
    "mapbylaw",
  ].map((slug) => [`case-${slug}.html`, `/portfolio/${slug}`]),
  ["writing.html", "/writing"],
  ["writing-reader.html", "/writing/agent-instructions-are-code"],
  ["agent-readiness-doctor.html", "/writing/agent-readiness-doctor"],
  ["open-source.html", "/open-source"],
  ["engineering-principles.html", "/engineering-principles"],
  ["now.html", "/now"],
  ["not-found.html", "/portfolio/not-a-case-study"],
];
if (base) {
  const designDir = path.resolve("docs/design/pages");
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ]) {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    const tab = await context.newPage();
    const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "design-"));
    const rows = [];
    for (const [design, route] of DESIGN_PAIRS) {
      const designFile = path.join(designDir, design);
      if (!fs.existsSync(designFile)) continue;
      const shot = async (url, name) => {
        await tab.goto(url, { waitUntil: "load" });
        await tab.evaluate(() => document.fonts.ready);
        await tab.waitForTimeout(400);
        const file = path.join(scratch, name);
        await tab.screenshot({ path: file, type: "jpeg", quality: 70 });
        return dataUri(file);
      };
      const left = await shot(pathToFileURL(designFile).href, `d-${design}.jpg`);
      const right = await shot(new URL(route, base).href, `b-${design}.jpg`);
      rows.push(
        `<h2>${design} vs ${route}</h2><div class="grid">${figure(left, "design artifact")}${figure(right, "build")}</div>`
      );
    }
    await render(
      `sheet-design-compare-${viewport.width}.jpg`,
      page_(
        `Design artifacts vs build at ${viewport.width}x${viewport.height}`,
        "Left: pinned page in docs/design/pages. Right: the production build. First screen only, reduced motion, emulated Chromium.",
        rows.join(""),
        viewport.width < 768 ? 360 : 240
      )
    );
    fs.rmSync(scratch, { recursive: true, force: true });
    await context.close();
  }
}

await browser.close();

const files = fs.readdirSync(data).sort();
const of = (kind) => files.filter((file) => file.startsWith(`${kind}__`)).map(readJson);
const summary = {
  generatedFrom: [
    "e2e/responsive.e2e.ts",
    "e2e/interactions.e2e.ts",
    "e2e/a11y.e2e.ts",
    "e2e/vitals.e2e.ts",
  ],
  emulated: true,
  layout: of("layout").map((record) => ({
    route: record.route,
    viewport: `${record.viewport.width}x${record.viewport.height}`,
    kind: record.viewport.kind,
    docOverflow: record.docOverflow,
    edgeOverflow: record.edgeOverflow.length,
    clippedText: record.clippedText.length,
    displayWordClipped: record.displayWordClipped.length,
    smallTargets: record.smallTargets.length,
    coveredShellTargets: record.shellTargets.filter((target) => target.covered).length,
    shellTargetsUnder44: record.shellTargets
      .filter((target) => target.height < 44)
      .map((target) => `${target.target} ${target.width}x${target.height}`),
    images: record.images.length,
    maxImageCrop: Math.max(0, ...record.images.map((image) => image.crop ?? 0)),
  })),
  focus: of("focus").map(({ route, stops, missing }) => ({ route, stops: stops.length, missing })),
  dialogs: of("dialog"),
  sticky: of("sticky"),
  rail: of("rail"),
  axe: of("axe").map(({ label, violations, knownFindings }) => ({
    label,
    violations: violations.map(({ id, impact, nodes }) => ({ id, impact, nodes })),
    knownFindings: knownFindings ?? [],
  })),
  motion: of("motion"),
  vitals: of("vitals").map(({ route, viewport, lcp, cls, inp, longTasks }) => ({
    route,
    width: viewport.width,
    lcp,
    cls,
    inp,
    longestTask: Math.max(0, ...longTasks),
  })),
  scroll: of("scroll").map(({ route, viewport, pageHeight, longTasks }) => ({
    route,
    width: viewport.width,
    pageHeight,
    longestTask: Math.max(0, ...longTasks),
  })),
};
fs.writeFileSync(path.join(target, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`wrote ${path.join(target, "summary.json")}`);
