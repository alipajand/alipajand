import fs from "node:fs";
import path from "node:path";

import { expect, type Page, test } from "@playwright/test";

import { AUDIT_ROUTES, AUDIT_VIEWPORTS, type AuditViewport, scrollThrough, settle } from "./support";

/*
 * Responsive gate for every route and the shared shell, in emulated viewports (Chromium device
 * emulation, not real devices). Set RESPONSIVE_EVIDENCE=<dir> to also write per-check JSON and
 * top-of-page JPEG captures; e2e/responsive-sheet.mjs turns those into contact sheets and the
 * findings table.
 */

const EVIDENCE_DIR = process.env.RESPONSIVE_EVIDENCE;

const record = (name: string, data: unknown) => {
  if (!EVIDENCE_DIR) return;
  const dir = path.join(EVIDENCE_DIR, "data");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${name}.json`), JSON.stringify(data, null, 2));
};

const capture = async (page: Page, name: string) => {
  if (!EVIDENCE_DIR) return;
  const dir = path.join(EVIDENCE_DIR, "shots");
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, `${name}.jpg`), type: "jpeg", quality: 70 });
};

const stubVercelScripts = (page: Page) =>
  page.route("**/_vercel/**", (route) =>
    route.fulfill({ status: 200, contentType: "text/javascript", body: "" })
  );

interface LayoutReport {
  docOverflow: number;
  edgeOverflow: string[];
  clippedText: string[];
  displayWordClipped: string[];
  smallTargets: { target: string; width: number; height: number }[];
  shellTargetsUnder44: { target: string; width: number; height: number }[];
  images: { src: string; broken: boolean; crop: number; spills: boolean }[];
}

/** Measures layout problems the eye catches on a phone: sideways spill, clipped words, tiny targets. */
const auditLayout = (page: Page): Promise<LayoutReport> =>
  page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const describe = (element: Element) => {
      const id = element.id ? `#${element.id}` : "";
      const cls =
        typeof element.className === "string" && element.className
          ? `.${element.className.trim().split(/\s+/)[0]}`
          : "";
      const text = (element.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 32);
      return `${element.tagName.toLowerCase()}${id}${cls}${text ? ` "${text}"` : ""}`;
    };
    const isVisible = (element: Element) => {
      const style = getComputedStyle(element);
      if (style.visibility === "hidden" || style.display === "none") return false;
      const rect = element.getBoundingClientRect();
      return rect.width > 1 && rect.height > 1;
    };
    const clips = (element: Element) => {
      const style = getComputedStyle(element);
      return /(hidden|clip|auto|scroll)/.test(style.overflowX);
    };
    const insideClipper = (element: Element) => {
      for (let node = element.parentElement; node; node = node.parentElement) {
        if (node === document.body || node === document.documentElement) return false;
        if (clips(node)) return true;
      }
      return false;
    };

    const all = Array.from(document.body.querySelectorAll("*"));

    const edgeOverflow = all
      .filter((element) => {
        if (!isVisible(element) || insideClipper(element)) return false;
        const rect = element.getBoundingClientRect();
        return rect.right > vw + 1 || rect.left < -1;
      })
      .map(describe);

    // Text cut off inside a box that hides overflow. Tickers and the display line clip on purpose.
    const clippedText = all
      .filter((element) => {
        if (!isVisible(element) || !clips(element)) return false;
        if (element.closest("[class*='ticker'], [class*='display']")) return false;
        const hasText = Array.from(element.childNodes).some(
          (child) => child.nodeType === Node.TEXT_NODE && child.textContent?.trim()
        );
        return hasText && element.scrollWidth > element.clientWidth + 1;
      })
      .map(describe);

    const displayWordClipped: string[] = [];
    for (const word of Array.from(document.querySelectorAll<HTMLElement>("[data-word]"))) {
      const box = word.parentElement!.getBoundingClientRect();
      const rect = word.getBoundingClientRect();
      if (rect.left < box.left - 1 || rect.right > box.right + 1) displayWordClipped.push(describe(word));
    }

    const interactive = all.filter(
      (element) =>
        element.matches(
          "a[href], button, input:not([type='hidden']), select, textarea, summary, [role='button'], [tabindex]:not([tabindex='-1'])"
        ) &&
        isVisible(element) &&
        !element.closest("[aria-hidden='true']")
    );
    const rects = interactive.map((element) => element.getBoundingClientRect());
    const isInline = (element: Element) => {
      if (getComputedStyle(element).display !== "inline") return false;
      const parent = element.parentElement;
      if (!parent) return false;
      return Array.from(parent.childNodes).some(
        (child) => child !== element && child.nodeType === Node.TEXT_NODE && child.textContent?.trim()
      );
    };
    const smallTargets: LayoutReport["smallTargets"] = [];
    interactive.forEach((element, index) => {
      const rect = rects[index];
      if ((rect.width >= 24 && rect.height >= 24) || isInline(element)) return;
      // WCAG 2.5.8 spacing exception: a 24px circle on the target's centre touches no other target.
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const crowded = rects.some((other, otherIndex) => {
        if (otherIndex === index) return false;
        const nx = Math.max(other.left, Math.min(cx, other.right));
        const ny = Math.max(other.top, Math.min(cy, other.bottom));
        return Math.hypot(cx - nx, cy - ny) < 12;
      });
      if (crowded) {
        smallTargets.push({
          target: describe(element),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
      }
    });

    const shellTargetsUnder44 = interactive
      .filter((element) => element.closest("header, footer"))
      .map((element) => ({ element, rect: element.getBoundingClientRect() }))
      .filter(({ rect }) => rect.width < 44 || rect.height < 44)
      .map(({ element, rect }) => ({
        target: describe(element),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      }));

    const images = Array.from(document.images)
      .filter((image) => isVisible(image))
      .map((image) => {
        const rect = image.getBoundingClientRect();
        const style = getComputedStyle(image);
        let crop = 0;
        if (style.objectFit === "cover" && image.naturalWidth && image.naturalHeight) {
          const natural = image.naturalWidth / image.naturalHeight;
          const box = rect.width / rect.height;
          crop = 1 - Math.min(natural / box, box / natural);
        }
        const parent = image.parentElement!.getBoundingClientRect();
        return {
          src: (image.currentSrc || image.src).replace(location.origin, "").slice(0, 80),
          broken: image.complete && image.naturalWidth === 0,
          crop: Number(crop.toFixed(3)),
          spills: rect.right > parent.right + 1 || rect.left < parent.left - 1,
        };
      });

    return {
      docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      edgeOverflow: edgeOverflow.slice(0, 12),
      clippedText: clippedText.slice(0, 12),
      displayWordClipped,
      smallTargets,
      shellTargetsUnder44,
      images,
    };
  });

const viewportName = (viewport: AuditViewport) => `${viewport.width}x${viewport.height}`;

for (const route of AUDIT_ROUTES) {
  test.describe(`responsive ${route.name}`, () => {
    for (const viewport of AUDIT_VIEWPORTS) {
      test(`lays out cleanly at ${viewportName(viewport)} (${viewport.kind}, emulated)`, async ({
        browser,
      }) => {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          isMobile: viewport.kind === "mobile",
          hasTouch: viewport.kind !== "desktop",
          deviceScaleFactor: 1,
          reducedMotion: "reduce",
        });
        const page = await context.newPage();
        await stubVercelScripts(page);
        const response = await page.goto(route.path);
        expect(response?.status()).toBe(route.status ?? 200);
        await settle(page);
        await capture(page, `${route.name}__${viewportName(viewport)}`);

        const report = await auditLayout(page);
        record(`layout__${route.name}__${viewportName(viewport)}`, {
          route: route.path,
          viewport,
          ...report,
        });

        expect(report.docOverflow, "page scrolls sideways").toBeLessThanOrEqual(0);
        expect(report.edgeOverflow, "elements spill past the viewport edge").toEqual([]);
        expect(report.clippedText, "text cut off inside its box").toEqual([]);
        expect(report.displayWordClipped, "display word clipped at rest").toEqual([]);
        expect(report.smallTargets, "targets under 24x24 without spacing (WCAG 2.5.8)").toEqual(
          []
        );
        expect(report.images.filter((image) => image.broken)).toEqual([]);
        expect(report.images.filter((image) => image.spills)).toEqual([]);
        await context.close();
      });
    }

    test("shows a focus ring on every keyboard stop in the shell and the first content links", async ({
      page,
    }) => {
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
          const style = getComputedStyle(element);
          const ring =
            (style.outlineStyle !== "none" && parseFloat(style.outlineWidth) >= 1) ||
            style.boxShadow !== "none";
          const label = `${element.tagName.toLowerCase()} "${(element.getAttribute("aria-label") ?? element.textContent ?? "").trim().slice(0, 28)}"`;
          return { ring, label };
        });
        if (!state) continue;
        stops.push(state.label);
        if (!state.ring) missing.push(state.label);
      }
      record(`focus__${route.name}`, { route: route.path, stops, missing });
      expect(stops.length).toBeGreaterThan(3);
      expect(missing, "keyboard stops without a visible focus indicator").toEqual([]);
    });

    for (const viewport of [
      { width: 390, height: 844 },
      { width: 1440, height: 900 },
    ]) {
      test(`stays stable through a scroll at ${viewport.width}px (CLS, long tasks)`, async ({
        page,
      }) => {
        await stubVercelScripts(page);
        await page.setViewportSize(viewport);
        await page.addInitScript(() => {
          const win = window as unknown as { __cls: number; __long: number[] };
          win.__cls = 0;
          win.__long = [];
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as unknown as Array<{
              value: number;
              hadRecentInput: boolean;
            }>) {
              if (!entry.hadRecentInput) win.__cls += entry.value;
            }
          }).observe({ type: "layout-shift", buffered: true });
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) win.__long.push(Math.round(entry.duration));
          }).observe({ type: "longtask" });
        });
        await page.goto(route.path);
        await settle(page);
        // Only long tasks during the scroll count; the first load is measured separately by CLS.
        await page.evaluate(() => {
          (window as unknown as { __long: number[] }).__long = [];
        });
        await scrollThrough(page);
        const { cls, long } = await page.evaluate(() => {
          const win = window as unknown as { __cls: number; __long: number[] };
          return { cls: win.__cls, long: win.__long };
        });
        record(`stability__${route.name}__${viewport.width}`, {
          route: route.path,
          viewport,
          cls: Number(cls.toFixed(4)),
          longTasks: long,
        });
        expect(cls).toBeLessThan(0.1);
        // Headless CPU timing is noisy; only a long freeze fails the gate.
        expect(long.filter((duration) => duration >= 250)).toEqual([]);
      });
    }

    test("keeps scroll-linked motion at rest under reduced motion", async ({ browser }) => {
      const context = await browser.newContext({
        reducedMotion: "reduce",
        viewport: { width: 390, height: 844 },
      });
      const page = await context.newPage();
      await page.goto(route.path);
      await settle(page);
      await page.mouse.wheel(0, 1200);
      await page.waitForTimeout(400);
      const moved = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll<HTMLElement>("[data-word], [data-star], [class*='track']")
        )
          .filter((element) => element.style.transform !== "")
          .map((element) => element.className || element.tagName)
      );
      expect(moved).toEqual([]);
      await context.close();
    });
  });
}

const MENU_VIEWPORTS = AUDIT_VIEWPORTS.filter((viewport) => viewport.width <= 520);

test.describe("site menu (emulated phones)", () => {
  for (const viewport of MENU_VIEWPORTS) {
    test(`opens, moves focus in order, closes on Escape and link at ${viewportName(viewport)}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/writing");
      await settle(page);
      const openButton = page.getByRole("button", { name: "Open menu" });
      await expect(openButton).toBeVisible();
      const box = (await openButton.boundingBox())!;
      expect(box.height).toBeGreaterThanOrEqual(44);

      await openButton.click();
      const panel = page.locator("#site-menu");
      await expect(panel).toBeVisible();
      const closeButton = page.getByRole("button", { name: "Close menu" });
      await expect(closeButton).toHaveAttribute("aria-expanded", "true");
      await expect(closeButton).toHaveAttribute("aria-controls", "site-menu");

      // Non-modal disclosure: Tab walks the panel in reading order, then leaves it.
      const links = panel.getByRole("link");
      const count = await links.count();
      await closeButton.focus();
      for (let index = 0; index < count; index += 1) {
        await page.keyboard.press("Tab");
        await expect(links.nth(index)).toBeFocused();
        const linkBox = (await links.nth(index).boundingBox())!;
        expect(linkBox.height).toBeGreaterThanOrEqual(44);
      }
      await page.keyboard.press("Tab");
      expect(await panel.evaluate((element) => element.contains(document.activeElement))).toBe(
        false
      );

      // The panel pushes content down rather than covering it, so the page may still scroll.
      expect(await page.evaluate(() => getComputedStyle(document.body).overflowY)).not.toBe(
        "hidden"
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        )
      ).toBeLessThanOrEqual(0);
      await capture(page, `menu-open__${viewportName(viewport)}`);

      await links.first().focus();
      await page.keyboard.press("Escape");
      await expect(panel).toBeHidden();
      await expect(openButton).toBeFocused();

      await openButton.click();
      await panel.getByRole("link", { name: /portfolio/i }).click();
      await expect(page).toHaveURL(/\/portfolio$/);
      await expect(panel).toBeHidden();
      await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute(
        "aria-expanded",
        "false"
      );
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
    await page.waitForTimeout(200);
    await expect(page.locator("#site-menu")).toBeHidden();
    const primary = page.getByRole("navigation", { name: "Primary" }).first();
    await expect(primary.getByRole("link").first()).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      )
    ).toBeLessThanOrEqual(0);
    await capture(page, "rotate__390x844-to-844x390");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(200);
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    await expect(page.locator("#site-menu")).toBeHidden();
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
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      )
    ).toBeLessThanOrEqual(0);
  });
});

test.describe("contact form states (emulated)", () => {
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    test(`shows errors, failure and success without spilling at ${viewportName({ ...viewport, kind: "mobile" })}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      let calls = 0;
      await page.route("**/api/contact", async (route) => {
        calls += 1;
        await route.fulfill(
          calls === 1
            ? { status: 500, contentType: "application/json", body: '{"error":"x"}' }
            : { status: 200, contentType: "application/json", body: "{}" }
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
      await capture(page, `contact-errors__${viewport.width}x${viewport.height}`);

      await page.locator("#contact-name").fill("Jane Doe");
      await page.locator("#contact-email").fill("jane@example.com");
      await page.locator("#contact-message").fill("A long message ".repeat(20));
      await submit.click();
      await expect(page.getByRole("alert").or(page.getByRole("status")).first()).not.toBeEmpty();
      expect((await auditLayout(page)).edgeOverflow).toEqual([]);

      await submit.click();
      await expect(page.getByRole("status")).not.toBeEmpty();
      expect((await auditLayout(page)).edgeOverflow).toEqual([]);
      await capture(page, `contact-sent__${viewport.width}x${viewport.height}`);
    });
  }
});
