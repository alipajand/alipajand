import { expect, test } from "@playwright/test";

import { settle } from "./support";

/*
 * /now is dated by the hand-set NOW_UPDATED (data/now.ts), not by the build or the visitor's clock:
 * the title year, the visible "Updated" line, the WebPage dateModified and the sitemap lastmod all
 * carry the same date, and none of them moves when the year rolls over.
 */
const NOW_UPDATED = "2026-05-08";
const UPDATED_TEXT = "Updated May 8, 2026";

for (const { timezoneId, at } of [
  { timezoneId: "America/Toronto", at: "2027-01-01T05:30:00Z" },
  { timezoneId: "Pacific/Auckland", at: "2026-12-31T11:30:00Z" },
]) {
  test(`keeps NOW_UPDATED's year after New Year in ${timezoneId}`, async ({ browser }) => {
    const context = await browser.newContext({ timezoneId });
    const page = await context.newPage();
    // 00:30 on January 1, 2027, local time.
    await page.clock.install({ time: new Date(at) });
    await page.goto("/now");
    await settle(page);
    expect(await page.evaluate(() => new Date().getFullYear())).toBe(2027);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Now 2026");
    await expect(page.locator("[data-now-updated]")).toHaveText(UPDATED_TEXT);
    await context.close();
  });
}

test("shows the Updated line and the same dateModified without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/now");
  const line = page.locator("[data-now-updated]");
  await expect(line).toBeVisible();
  await expect(line).toHaveText(UPDATED_TEXT);
  await expect(line.locator("time")).toHaveAttribute("datetime", NOW_UPDATED);

  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent ?? "{}")));
  const webPage = blocks.find((block) => block["@type"] === "WebPage");
  expect(webPage?.dateModified).toBe(NOW_UPDATED);
  await context.close();
});

test("dates /now in the sitemap with NOW_UPDATED", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const entry = /<url>\s*<loc>[^<]*\/now<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/.exec(xml);
  expect(entry?.[1]).toBe(NOW_UPDATED);
});
