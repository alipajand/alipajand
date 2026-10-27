import { expect, type Page, test } from "@playwright/test";

import { capture, record } from "./evidence";
import { AUDIT_ROUTES, CASE_STUDY_SLUGS, horizontalOverflow, settle } from "./support";

/*
 * Touch and keyboard interactions on emulated phones and tablets: screenshot dialogs, the article
 * contents, the case-study chapter rail, the writing filters, and sticky positioning.
 */

const PHONE = { width: 390, height: 844 };
const TABLET = { width: 768, height: 1024 };
const TABLET_LANDSCAPE = { width: 1024, height: 768 };
const DESKTOP = { width: 1440, height: 900 };

const touchContext = (viewport: { width: number; height: number }) => ({
  viewport,
  isMobile: viewport.width < 768,
  hasTouch: viewport.width < 1280,
  reducedMotion: "reduce" as const,
});

const name = (viewport: { width: number; height: number }) =>
  `${viewport.width}x${viewport.height}`;

test.describe("screenshot dialogs", () => {
  for (const slug of CASE_STUDY_SLUGS) {
    for (const viewport of [PHONE, TABLET, TABLET_LANDSCAPE, DESKTOP]) {
      test(`${slug}: opens, fits, traps focus and closes at ${name(viewport)}`, async ({
        browser,
      }) => {
        const context = await browser.newContext(touchContext(viewport));
        const page = await context.newPage();
        await page.goto(`/portfolio/${slug}`);
        await settle(page);
        const openers = page.locator("button[aria-haspopup='dialog']");
        const count = await openers.count();
        expect(count, "every case study has at least one enlargeable screenshot").toBeGreaterThan(
          0
        );
        const opener = openers.first();
        await opener.scrollIntoViewIfNeeded();
        if (viewport.width < 1280) await opener.tap();
        else await opener.click();

        const dialog = page.locator("dialog[open]");
        await expect(dialog).toBeVisible();
        const fit = await dialog.evaluate((element) => {
          const box = element.getBoundingClientRect();
          const image = element.querySelector("img")!.getBoundingClientRect();
          const close = element.querySelector("button")!.getBoundingClientRect();
          const vw = document.documentElement.clientWidth;
          const vh = window.innerHeight;
          return {
            dialogInside:
              box.left >= -1 && box.top >= -1 && box.right <= vw + 1 && box.bottom <= vh + 1,
            imageInside:
              image.left >= box.left - 1 &&
              image.right <= box.right + 1 &&
              image.top >= box.top - 1 &&
              image.bottom <= box.bottom + 1,
            imageWidth: Math.round(image.width),
            close: { width: Math.round(close.width), height: Math.round(close.height) },
          };
        });
        await capture(page, `dialog-${slug}__${name(viewport)}`);

        // Focus starts in the dialog and Tab never reaches the page behind it.
        expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(
          true
        );
        const escaped: string[] = [];
        for (let index = 0; index < 4; index += 1) {
          await page.keyboard.press("Tab");
          const outside = await page.evaluate(() => {
            const active = document.activeElement;
            if (!active || active === document.body) return null;
            return active.closest("dialog[open]") ? null : active.outerHTML.slice(0, 80);
          });
          if (outside) escaped.push(outside);
        }

        // Background scroll while open: recorded, since the native dialog does not lock it.
        const scrollBefore = await page.evaluate(() => window.scrollY);
        await page.mouse.wheel(0, 400);
        await page.waitForTimeout(200);
        const scrollAfter = await page.evaluate(() => window.scrollY);

        record(`dialog__${slug}__${name(viewport)}`, {
          slug,
          viewport,
          openers: count,
          ...fit,
          focusEscaped: escaped,
          backgroundScrolled: scrollAfter !== scrollBefore,
        });

        expect(fit.dialogInside, "dialog fits the viewport").toBe(true);
        expect(fit.imageInside, "enlarged screenshot is not cut off").toBe(true);
        expect(fit.close.height, "close button height").toBeGreaterThanOrEqual(24);
        expect(fit.close.width, "close button width").toBeGreaterThanOrEqual(24);
        expect(escaped, "focus left the open dialog").toEqual([]);

        await page.keyboard.press("Escape");
        await expect(dialog).toBeHidden();
        await expect(opener).toBeFocused();

        // The close button and a tap on the backdrop close it too.
        await opener.click();
        await expect(page.locator("dialog[open]")).toBeVisible();
        await page.locator("dialog[open]").getByRole("button").first().click();
        await expect(page.locator("dialog[open]")).toHaveCount(0);
        await opener.click();
        await page.mouse.click(2, 2);
        await expect(page.locator("dialog[open]")).toHaveCount(0);
        expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
        await context.close();
      });
    }
  }
});

test.describe("article contents", () => {
  for (const viewport of [PHONE, TABLET]) {
    test(`reader contents jump to a section and mark it at ${name(viewport)}`, async ({
      browser,
    }) => {
      const context = await browser.newContext({ ...touchContext(viewport), reducedMotion: null });
      const page = await context.newPage();
      await page.goto("/writing/agent-instructions-are-code");
      await settle(page);
      const toc = page.getByRole("complementary", { name: "Table of contents" });
      const link = toc.getByRole("link").nth(2);
      const href = (await link.getAttribute("href"))!;
      await link.scrollIntoViewIfNeeded();
      await link.tap();
      await expect(page).toHaveURL(new RegExp(`${href}$`));
      const heading = page.locator(`[id="${href.slice(1)}"]`);
      await expect(heading).toBeInViewport();
      await expect(link).toHaveAttribute("aria-current", "location");
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
      await context.close();
    });

    test(`launch contents fold into a disclosure and still navigate at ${name(viewport)}`, async ({
      browser,
    }) => {
      const context = await browser.newContext(touchContext(viewport));
      const page = await context.newPage();
      await page.goto("/writing/agent-readiness-doctor");
      await settle(page);
      const fold = page.locator("details").filter({ has: page.locator("[data-toc-link]") });
      await expect(fold).toHaveCount(1);
      const summary = fold.locator("summary");
      await summary.scrollIntoViewIfNeeded();
      expect((await summary.boundingBox())!.height).toBeGreaterThanOrEqual(24);
      await summary.tap();
      await expect(fold).toHaveAttribute("open", "");
      const link = fold.locator("[data-toc-link]").nth(1);
      const href = (await link.getAttribute("href"))!;
      await link.tap();
      await expect(page).toHaveURL(new RegExp(`${href}$`));
      await expect(page.locator(`[id="${href.slice(1)}"]`)).toBeInViewport();
      await capture(page, `contents-launch__${name(viewport)}`);
      await context.close();
    });
  }
});

test.describe("case-study chapter rail", () => {
  for (const viewport of [PHONE, TABLET, DESKTOP]) {
    test(`lands each chapter below the sticky rail at ${name(viewport)}`, async ({ browser }) => {
      const context = await browser.newContext(touchContext(viewport));
      const page = await context.newPage();
      await page.goto("/portfolio/ledgerguard");
      await settle(page);
      const rail = page.locator("nav[aria-label]").filter({ has: page.locator("a[href^='#']") });
      const links = rail.first().locator("a[href^='#']");
      const count = await links.count();
      expect(count).toBeGreaterThan(3);
      const hidden: string[] = [];
      for (const index of [1, Math.floor(count / 2), count - 1]) {
        const link = links.nth(index);
        const href = (await link.getAttribute("href"))!;
        await link.scrollIntoViewIfNeeded();
        if (viewport.width < 1280) await link.tap();
        else await link.click();
        await expect(page).toHaveURL(new RegExp(`${href}$`));
        await page.waitForTimeout(150);
        const overlap = await page.evaluate((id) => {
          const target = document.getElementById(id)!;
          const top = target.getBoundingClientRect().top;
          const covers = Array.from(document.querySelectorAll<HTMLElement>("*"))
            .filter((element) => getComputedStyle(element).position === "sticky")
            .map((element) => element.getBoundingClientRect())
            .filter((box) => box.top <= 1 && box.bottom > top + 4);
          return covers.length ? `${id} starts at ${Math.round(top)}px under a sticky bar` : null;
        }, href.slice(1));
        if (overlap) hidden.push(overlap);
      }
      record(`rail__${name(viewport)}`, { viewport, chapters: count, hidden });
      expect(hidden, "chapter starts hidden under a sticky bar").toEqual([]);
      await context.close();
    });
  }
});

test.describe("writing filters", () => {
  for (const viewport of [PHONE, TABLET]) {
    test(`filter by touch and reset at ${name(viewport)}`, async ({ browser }) => {
      const context = await browser.newContext(touchContext(viewport));
      const page = await context.newPage();
      await page.goto("/writing");
      await settle(page);
      const group = page.getByRole("group", { name: "Filter by topic" });
      const chips = group.getByRole("button");
      const total = await page.locator("#posts article").count();
      for (const chip of await chips.all()) {
        const box = (await chip.boundingBox())!;
        expect(box.height, await chip.innerText()).toBeGreaterThanOrEqual(24);
      }
      await chips.nth(1).scrollIntoViewIfNeeded();
      await chips.nth(1).tap();
      await expect(chips.nth(1)).toHaveAttribute("aria-pressed", "true");
      const shown = await page.locator("#posts article").count();
      expect(shown).toBeLessThan(total);
      await expect(group.getByRole("status")).toContainText(`${shown} of ${total}`);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
      await capture(page, `filters__${name(viewport)}`);
      await chips.first().tap();
      await expect(page.locator("#posts article")).toHaveCount(total);
      await context.close();
    });
  }
});

/** Scrolls each sticky element's container past the top and checks it pins, uncovered. */
const auditSticky = (page: Page) =>
  page.evaluate(async () => {
    const sleep = () =>
      new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 30)));
    const describe = (element: Element) =>
      `${element.tagName.toLowerCase()}.${String(element.className).split(" ")[0]}`;
    const stickies = Array.from(document.querySelectorAll<HTMLElement>("*")).filter((element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.position === "sticky" && style.display !== "none" && box.height > 0;
    });
    const results = [];
    for (const element of stickies) {
      const parent = element.parentElement!;
      const room = parent.getBoundingClientRect().height - element.getBoundingClientRect().height;
      if (room < 240) {
        results.push({ element: describe(element), applies: false });
        continue;
      }
      const offset = parseFloat(getComputedStyle(element).top) || 0;
      const parentTop = parent.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, parentTop + room / 2);
      await sleep();
      const box = element.getBoundingClientRect();
      const probeY = Math.min(
        box.top + Math.min(box.height, window.innerHeight - box.top) / 2,
        window.innerHeight - 2
      );
      const hit = document.elementFromPoint(box.left + Math.min(box.width / 2, 40), probeY);
      results.push({
        element: describe(element),
        applies: true,
        expectedTop: offset,
        top: Math.round(box.top),
        pinned: Math.abs(box.top - offset) <= 2,
        covered: !(hit && (hit === element || element.contains(hit))),
        coveredBy: hit && !element.contains(hit) ? describe(hit) : null,
      });
    }
    window.scrollTo(0, 0);
    return results;
  });

const STICKY_ROUTES = AUDIT_ROUTES.filter((route) =>
  [
    "case-ledgerguard",
    "post-agent-instructions-are-code",
    "post-agent-readiness-doctor",
    "engineering-principles",
    "open-source",
  ].includes(route.name)
);

test.describe("sticky positioning", () => {
  for (const route of STICKY_ROUTES) {
    for (const viewport of [PHONE, TABLET, TABLET_LANDSCAPE, DESKTOP]) {
      test(`${route.name} pins its sticky parts uncovered at ${name(viewport)}`, async ({
        browser,
      }) => {
        const context = await browser.newContext(touchContext(viewport));
        const page = await context.newPage();
        await page.goto(route.path);
        await settle(page);
        const results = await auditSticky(page);
        record(`sticky__${route.name}__${name(viewport)}`, {
          route: route.path,
          viewport,
          results,
        });
        const applied = results.filter((result) => result.applies);
        expect(
          applied.filter((result) => !result.pinned).map((result) => result.element),
          "sticky elements that did not pin"
        ).toEqual([]);
        expect(
          applied
            .filter((result) => result.covered)
            .map((result) => `${result.element} under ${result.coveredBy}`),
          "sticky elements covered by other content"
        ).toEqual([]);
        await context.close();
      });
    }
  }
});
