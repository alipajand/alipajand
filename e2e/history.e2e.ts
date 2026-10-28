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

    // Back pressed right after an in-app link, before the next page has rendered: that page still
    // commits after the popstate and used to scroll to the top. Runs in Chromium and in Playwright
    // WebKit (not Safari).
    for (const [engine, path, mark] of [
      ["chromium", "/portfolio/ledgerguard", "main a[href^='/writing/']"],
      ["webkit", "/portfolio/ledgerguard", "main a[href^='/writing/']"],
      ["chromium", "/writing/agent-readiness-doctor", "main article a[href='/open-source']"],
      ["webkit", "/writing/agent-readiness-doctor", "main article a[href='/open-source']"],
    ] as const) {
      test(`Back before the next page renders keeps the place on ${path} in ${engine}`, async ({
        browser,
        playwright,
        baseURL,
      }) => {
        const target = engine === "webkit" ? await playwright.webkit.launch() : browser;
        const context = await target.newContext({ baseURL, viewport });
        try {
          const page = await context.newPage();
          await page.goto(path);
          await settle(page);
          await page.locator(mark).first().scrollIntoViewIfNeeded();
          await settle(page);
          const before = await scrollY(page);
          expect(before).toBeGreaterThan(1000);

          await page.evaluate(() =>
            document.querySelector<HTMLAnchorElement>("header a[href='/writing']")!.click()
          );
          await page.waitForURL((url) => url.pathname === "/writing");
          await page.goBack();
          await page.waitForURL(`**${path}`);
          await settle(page);
          expect(Math.abs((await scrollY(page)) - before)).toBeLessThan(40);
          await expect(page.locator("#main-content")).toBeFocused();
        } finally {
          await context.close();
          if (target !== browser) await target.close();
        }
      });
    }

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
