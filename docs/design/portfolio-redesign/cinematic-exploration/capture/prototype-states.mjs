// Captures states of a LedgerGuard design prototype (fictional data) by driving its review bar.
//   node capture/prototype-states.mjs <prototype.html> <outDir> <name>=<Label>:<value>,<Label>:<value> ...
// Example, the three workspace states used in the A–A step:
//   node capture/prototype-states.mjs prototype/workspace.html /tmp/ws \
//     ready=Theme:dark,Scenario:normal,State:ready partial=Theme:dark,Scenario:normal,State:partial
// The review bar is hidden before each capture; the prototype's own "Fictional sample" labels stay.
// Captures are 1600×1000 PNG; the prototype media are WebP made from them with cwebp -q 80.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

// playwright-core is deliberately not a project dependency: resolve it from NODE_PATH.
const { chromium } = createRequire(join(process.env.NODE_PATH ?? ".", "noop.js"))(
  "playwright-core"
);
const [file, out, ...jobs] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const page = await browser.newPage({
  viewport: { width: 1600, height: 1000 },
  colorScheme: "dark",
});

for (const job of jobs) {
  const [name, spec] = job.split("=");
  await page.goto(pathToFileURL(resolve(file)).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  for (const pair of spec.split(",")) {
    const [label, value] = pair.split(":");
    await page.locator(".rb label", { hasText: label }).locator("select").selectOption(value);
    await page.waitForTimeout(250);
  }
  const hide = await page.addStyleTag({ content: ".rb, .aa-back { display: none !important; }" });
  await page.waitForTimeout(700);
  await page.screenshot({ path: join(out, `${name}.png`) });
  await hide.evaluate((el) => el.remove());
  console.log(name);
}
await browser.close();
