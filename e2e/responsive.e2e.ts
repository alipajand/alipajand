import { expect, test } from "@playwright/test";

import { capture, record, stubVercelScripts } from "./evidence";
import { auditLayout } from "./layout-audit";
import {
  AUDIT_ROUTES,
  AUDIT_VIEWPORTS,
  type AuditViewport,
  FAMILY_ROUTES,
  horizontalOverflow,
  settle,
} from "./support";

/*
 * Responsive gate: every implemented route at 13 emulated viewports (Chromium device emulation,
 * not real devices), plus the shell's menu, rotation, history and the contact form.
 */

const viewportName = (viewport: { width: number; height: number }) =>
  `${viewport.width}x${viewport.height}`;

const contextFor = (viewport: AuditViewport) => ({
  viewport: { width: viewport.width, height: viewport.height },
  isMobile: viewport.kind === "mobile",
  hasTouch: viewport.kind !== "desktop",
  deviceScaleFactor: 1,
  reducedMotion: "reduce" as const,
});

for (const route of AUDIT_ROUTES) {
  test.describe(`layout ${route.name}`, () => {
    for (const viewport of AUDIT_VIEWPORTS) {
      test(`lays out cleanly at ${viewportName(viewport)} (${viewport.kind}, emulated)`, async ({
        browser,
      }) => {
        const context = await browser.newContext(contextFor(viewport));
        const page = await context.newPage();
        await stubVercelScripts(page);
        const response = await page.goto(route.path);
        expect(response?.status()).toBe(route.status ?? 200);
        await settle(page);
        await capture(page, `${route.name}__${viewportName(viewport)}`);

        const report = await auditLayout(page);
        record(`layout__${route.name}__${viewportName(viewport)}`, {
          route: route.path,
          family: route.family,
          viewport,
          ...report,
        });

        expect(report.docOverflow, "page scrolls sideways").toBeLessThanOrEqual(0);
        expect(report.edgeOverflow, "elements spill past the viewport edge").toEqual([]);
        expect(report.clippedText, "text cut off inside its box").toEqual([]);
        expect(report.displayWordClipped, "display word clipped at rest").toEqual([]);
        expect(report.smallTargets, "targets under 24x24 without spacing (WCAG 2.5.8)").toEqual([]);
        expect(
          report.shellTargets.filter((target) => target.covered).map((target) => target.target),
          "header or footer controls covered by page content"
        ).toEqual([]);
        expect(report.images.filter((image) => image.broken)).toEqual([]);
        expect(report.images.filter((image) => image.spills)).toEqual([]);
        await context.close();
      });
    }
  });
}

test.describe("focus visibility", () => {
  for (const route of FAMILY_ROUTES) {
    test(`${route.name} shows a ring on the first 18 keyboard stops`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(route.path);
      await settle(page);
      const missing: string[] = [];
      const stops: string[] = [];
      for (let index = 0; index < 18; index += 1) {
        await page.keyboard.press("Tab");
        const state = await page.evaluate(() => {
          const element = document.activeElement as HTMLElement | null;
          if (!element || element === document.body) return null;
          // Rows draw the ring on themselves (`:has(:focus-visible)`), so ancestors count too.
          const hasRing = (node: Element) => {
            const style = getComputedStyle(node);
            return (
              (style.outlineStyle !== "none" && parseFloat(style.outlineWidth) >= 1) ||
              style.boxShadow !== "none"
            );
          };
          let ring = false;
          for (let node: Element | null = element, depth = 0; node && depth < 4; depth += 1) {
            if (hasRing(node)) ring = true;
            node = node.parentElement;
          }
          const name = (element.getAttribute("aria-label") ?? element.textContent ?? "").trim();
          return { ring, label: `${element.tagName.toLowerCase()} "${name.slice(0, 28)}"` };
        });
        if (!state) continue;
        stops.push(state.label);
        if (!state.ring) missing.push(state.label);
      }
      record(`focus__${route.name}`, { route: route.path, stops, missing });
      expect(stops.length).toBeGreaterThan(3);
      expect(missing, "keyboard stops without a visible focus indicator").toEqual([]);
    });
  }
});

const MENU_VIEWPORTS = AUDIT_VIEWPORTS.filter((viewport) => viewport.width <= 520);

test.describe("site menu (emulated phones)", () => {
  for (const viewport of MENU_VIEWPORTS) {
    test(`opens, moves focus in order, closes on Escape and link at ${viewportName(viewport)}`, async ({
      browser,
    }) => {
      const context = await browser.newContext({ ...contextFor(viewport), reducedMotion: null });
      const page = await context.newPage();
      await page.goto("/writing");
      await settle(page);
      const openButton = page.getByRole("button", { name: "Open menu" });
      await expect(openButton).toBeVisible();
      expect((await openButton.boundingBox())!.height).toBeGreaterThanOrEqual(44);

      await openButton.tap();
      const panel = page.locator("#site-menu");
      await expect(panel).toBeVisible();
      const closeButton = page.getByRole("button", { name: "Close menu" });
      await expect(closeButton).toHaveAttribute("aria-expanded", "true");
      await expect(closeButton).toHaveAttribute("aria-controls", "site-menu");

      // A non-modal disclosure: Tab walks the panel in reading order, then leaves it.
      const links = panel.getByRole("link");
      const count = await links.count();
      await closeButton.focus();
      for (let index = 0; index < count; index += 1) {
        await page.keyboard.press("Tab");
        await expect(links.nth(index)).toBeFocused();
        expect((await links.nth(index).boundingBox())!.height).toBeGreaterThanOrEqual(44);
      }
      await page.keyboard.press("Tab");
      expect(await panel.evaluate((element) => element.contains(document.activeElement))).toBe(
        false
      );

      // The panel pushes content down instead of covering it, so the page keeps scrolling.
      expect(await page.evaluate(() => getComputedStyle(document.body).overflowY)).not.toBe(
        "hidden"
      );
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
      await capture(page, `menu-open__${viewportName(viewport)}`);

      await links.first().focus();
      await page.keyboard.press("Escape");
      await expect(panel).toBeHidden();
      await expect(openButton).toBeFocused();

      await openButton.tap();
      await panel.getByRole("link", { name: /portfolio/i }).tap();
      await expect(page).toHaveURL(/\/portfolio$/);
      await expect(panel).toBeHidden();
      await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute(
        "aria-expanded",
        "false"
      );
      await context.close();
    });
  }

  test("closes and restores the link row when a phone rotates to landscape", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await settle(page);
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.locator("#site-menu")).toBeVisible();
    await page.mouse.wheel(0, 600);

    await page.setViewportSize({ width: 844, height: 390 });
    await expect(page.locator("#site-menu")).toBeHidden();
    const primary = page.getByRole("navigation", { name: "Primary" }).first();
    await expect(primary.getByRole("link").first()).toBeVisible();
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
    await capture(page, "rotate__390x844-to-844x390");

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    await expect(page.locator("#site-menu")).toBeHidden();
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});

test.describe("history (emulated phone)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("Back and Forward restore each page and its heading", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    const homeHeading = await page.locator("h1").textContent();

    await page.getByRole("button", { name: "Open menu" }).click();
    await page
      .locator("#site-menu")
      .getByRole("link", { name: /portfolio/i })
      .click();
    await expect(page).toHaveURL(/\/portfolio$/);
    const portfolioHeading = await page.locator("h1").textContent();

    const firstCase = page.locator("main a[href^='/portfolio/']").first();
    const caseHref = await firstCase.getAttribute("href");
    await firstCase.click();
    await expect(page).toHaveURL(new RegExp(`${caseHref}$`));

    await page.goBack();
    await expect(page).toHaveURL(/\/portfolio$/);
    await expect(page.locator("h1")).toHaveText(portfolioHeading ?? "");
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("h1")).toHaveText(homeHeading ?? "");
    await page.goForward();
    await expect(page).toHaveURL(/\/portfolio$/);
    await expect(page.locator("#site-menu")).toBeHidden();
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
});

test.describe("contact form states (emulated)", () => {
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    test(`shows errors, failure and success without spilling at ${viewportName(viewport)}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      let calls = 0;
      await page.route("**/api/contact", async (route) => {
        calls += 1;
        await route.fulfill(
          calls === 1
            ? { status: 500, contentType: "application/json", body: '{"error":"x"}' }
            : { status: 200, contentType: "application/json", body: '{"success":true}' }
        );
      });
      await page.goto("/");
      await settle(page);
      const submit = page.getByRole("button", { name: /send message/i });
      await submit.scrollIntoViewIfNeeded();
      await submit.click();
      await expect(page.getByRole("link", { name: "Enter your name" })).toBeVisible();
      const report = await auditLayout(page);
      expect(report.edgeOverflow).toEqual([]);
      expect(report.smallTargets).toEqual([]);
      await page.locator("#contact").scrollIntoViewIfNeeded();
      await capture(page, `contact-errors__${viewportName(viewport)}`);

      await page.locator("#contact-name").fill("Jane Doe");
      await page.locator("#contact-email").fill("jane@example.com");
      await page.locator("#contact-message").fill("A long message ".repeat(20));
      await submit.click();
      await expect(page.getByRole("alert").or(page.getByRole("status")).first()).not.toBeEmpty();
      expect((await auditLayout(page)).edgeOverflow).toEqual([]);

      await submit.click();
      await expect(page.getByRole("status").first()).not.toBeEmpty();
      expect((await auditLayout(page)).edgeOverflow).toEqual([]);
      await page.getByRole("status").first().scrollIntoViewIfNeeded();
      await capture(page, `contact-sent__${viewportName(viewport)}`);
    });
  }
});
