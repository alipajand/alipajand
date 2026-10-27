import { expect, type Page, test } from "@playwright/test";

import { horizontalOverflow, settle } from "./support";

/*
 * The /now ruler's label reads as year progress ("Week 43 of 52 · year progress"), not as a week
 * number, and stays inside the ruler at the first and last steps of the year.
 */
const WIDTHS = [1440, 390, 320] as const;

const DATES = [
  { at: "2026-01-01T12:00:00Z", text: "Week 1 of 52 · year progress" },
  { at: "2026-10-27T12:00:00Z", text: "Week 43 of 52 · year progress" },
  // ISO week 53 of 2026; the ruler's last step.
  { at: "2026-12-31T12:00:00Z", text: "Week 52 of 52 · year progress" },
] as const;

const labelInsideRuler = async (page: Page) => {
  const label = page.locator("[data-label]");
  const ruler = (await label.locator("..").boundingBox())!;
  const box = (await label.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(ruler.x - 0.5);
  expect(box.x + box.width).toBeLessThanOrEqual(ruler.x + ruler.width + 0.5);
};

for (const width of WIDTHS) {
  test.describe(`now ruler label at ${width}px`, () => {
    for (const { at, text } of DATES) {
      test(`reads "${text}" on ${at.slice(0, 10)} and stays inside the ruler`, async ({ page }) => {
        await page.clock.install({ time: new Date(at) });
        await page.setViewportSize({ width, height: 900 });
        await page.goto("/now");
        await settle(page);
        const label = page.locator("[data-label]");
        await expect(label).toHaveText(text);
        await expect(label).not.toHaveText(/\bwk\b/i);
        await labelInsideRuler(page);
        expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
      });
    }

    test("keeps the server label inside the ruler without JavaScript", async ({ browser }) => {
      const context = await browser.newContext({
        javaScriptEnabled: false,
        viewport: { width, height: 900 },
      });
      const page = await context.newPage();
      await page.goto("/now");
      await expect(page.locator("[data-label]")).toHaveText(/^Week \d{1,2} of 52 · year progress$/);
      await labelInsideRuler(page);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
      await context.close();
    });
  });
}
