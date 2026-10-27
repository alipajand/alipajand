/**
 * Builds contact sheets and a compact summary from a responsive gate run:
 *
 *   RESPONSIVE_EVIDENCE=/tmp/responsive pnpm exec playwright test e2e/responsive.e2e.ts
 *   node e2e/responsive-sheet.mjs /tmp/responsive docs/audits/evidence/responsive
 *
 * Captures are emulated Chromium viewports, not real devices.
 */
import fs from "node:fs";
import path from "node:path";

import { chromium } from "@playwright/test";

const [source, target = "docs/audits/evidence/responsive"] = process.argv.slice(2);
if (!source) {
  console.error("usage: node e2e/responsive-sheet.mjs <evidence dir> [output dir]");
  process.exit(1);
}

const shots = path.join(source, "shots");
const data = path.join(source, "data");
fs.mkdirSync(target, { recursive: true });

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(data, file), "utf8"));
const asDataUri = (file) =>
  `data:image/jpeg;base64,${fs.readFileSync(path.join(shots, file)).toString("base64")}`;
const sizeOf = (name) => {
  const match = /(\d+)x(\d+)/.exec(name);
  return match ? { w: Number(match[1]), h: Number(match[2]) } : { w: 16, h: 9 };
};
const byWidth = (a, b) => sizeOf(a).w - sizeOf(b).w || sizeOf(a).h - sizeOf(b).h;

const sheetHtml = (title, files, label) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  body { margin: 0; padding: 20px; background: #f4f4f1; color: #111; font: 13px/1.35 system-ui, sans-serif; }
  h1 { margin: 0 0 4px; font-size: 18px; }
  p { margin: 0 0 14px; color: #555; }
  .grid { display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-end; }
  figure { margin: 0; }
  img { display: block; height: 220px; border: 1px solid #999; background: #000; }
  figcaption { margin-top: 4px; font-family: ui-monospace, monospace; font-size: 12px; }
</style></head><body>
  <h1>${title}</h1>
  <p>Emulated Chromium viewports (device scale 1, reduced motion), top of page. Not real devices.</p>
  <div class="grid">
    ${files
      .map(
        (file) =>
          `<figure><img src="${asDataUri(file)}" alt=""><figcaption>${label(file)}</figcaption></figure>`
      )
      .join("\n")}
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1680, height: 600 },
  deviceScaleFactor: 1,
});

const render = async (name, title, files, label) => {
  await page.setContent(sheetHtml(title, files, label));
  await page.screenshot({
    path: path.join(target, name),
    type: "jpeg",
    quality: 62,
    fullPage: true,
  });
  console.log(`wrote ${path.join(target, name)} (${files.length} captures)`);
};

const allShots = fs.readdirSync(shots).filter((file) => file.endsWith(".jpg"));
const routes = [...new Set(allShots.filter((f) => f.includes("__")).map((f) => f.split("__")[0]))]
  .filter((route) => !/^(menu-open|rotate|contact-errors|contact-sent)$/.test(route))
  .sort();

for (const route of routes) {
  const files = allShots.filter((file) => file.startsWith(`${route}__`)).sort(byWidth);
  await render(`sheet-${route}.jpg`, `/${route}`, files, (file) =>
    file.split("__")[1].replace(".jpg", "")
  );
}

const shellFiles = allShots
  .filter((file) => /^(menu-open|rotate|contact-errors|contact-sent)__/.test(file))
  .sort((a, b) => a.split("__")[0].localeCompare(b.split("__")[0]) || byWidth(a, b));
await render("sheet-shell-states.jpg", "Shell and form states", shellFiles, (file) =>
  file.replace(".jpg", "").replace("__", " ")
);

await browser.close();

const summary = {
  generatedFrom: "e2e/responsive.e2e.ts",
  emulated: true,
  layout: [],
  focus: [],
  stability: [],
};
for (const file of fs.readdirSync(data).sort()) {
  const record = readJson(file);
  if (file.startsWith("layout__")) {
    summary.layout.push({
      route: record.route,
      viewport: `${record.viewport.width}x${record.viewport.height}`,
      kind: record.viewport.kind,
      docOverflow: record.docOverflow,
      edgeOverflow: record.edgeOverflow.length,
      clippedText: record.clippedText.length,
      displayWordClipped: record.displayWordClipped.length,
      smallTargets: record.smallTargets,
      shellTargetsUnder44: record.shellTargetsUnder44,
      images: record.images.length,
      maxImageCrop: Math.max(0, ...record.images.map((image) => image.crop)),
    });
  } else if (file.startsWith("focus__")) {
    summary.focus.push({
      route: record.route,
      stops: record.stops.length,
      missing: record.missing,
    });
  } else if (file.startsWith("stability__")) {
    summary.stability.push({
      route: record.route,
      width: record.viewport.width,
      cls: record.cls,
      longTasks: record.longTasks,
    });
  }
}
fs.writeFileSync(path.join(target, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`wrote ${path.join(target, "summary.json")}`);
