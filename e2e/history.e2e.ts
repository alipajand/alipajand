import { expect, test } from "@playwright/test";

import { settle } from "./support";

/*
 * Back and Forward return the reader to where they were. A link navigation still starts the next
 * page at the top.
 */

const scrollY = (page: import("@playwright/test").Page) =>
  page.evaluate(() => Math.round(window.scrollY));

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test.describe(`history at ${viewport.width}px`, () => {
    test.use({ viewport });

    test("Back restores the scroll position after following a link", async ({ page }) => {
      await page.goto("/portfolio/ledgerguard");
      await settle(page);
      const link = page.locator("main a[href^='/writing/']").first();
      await link.scrollIntoViewIfNeeded();
      const before = await scrollY(page);
      expect(before).toBeGreaterThan(1000);

      await link.click();
      await page.waitForURL(/\/writing\//);
      await expect.poll(() => scrollY(page)).toBe(0);

      await page.goBack();
      await page.waitForURL("**/portfolio/ledgerguard");
      await expect.poll(async () => Math.abs((await scrollY(page)) - before)).toBeLessThan(40);
    });

    test("Back returns to an in-page section after leaving the page", async ({ page }) => {
      await page.goto("/portfolio/ledgerguard");
      await settle(page);
      await page.locator("main a[href='#context']").first().click();
      await expect(page).toHaveURL(/#context$/);
      const before = await scrollY(page);
      expect(before).toBeGreaterThan(300);

      await page.evaluate(() =>
        document.querySelector<HTMLAnchorElement>("header a[href='/']")!.click()
      );
      await page.waitForURL((url) => url.pathname === "/");
      await settle(page);
      await expect.poll(() => scrollY(page)).toBe(0);

      await page.goBack();
      await expect(page).toHaveURL(/\/portfolio\/ledgerguard#context$/);
      await expect.poll(async () => Math.abs((await scrollY(page)) - before)).toBeLessThan(40);
    });
  });
}
