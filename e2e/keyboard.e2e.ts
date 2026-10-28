import {
  type Browser,
  type BrowserContext,
  type BrowserContextOptions,
  expect,
  type Locator,
  type Page,
  test as base,
} from "@playwright/test";

import { record } from "./evidence";
import { settle } from "./support";

/*
 * Keyboard access and focus management, in Chromium and in Playwright WebKit (not Safari):
 *
 * - On every sitemap route and the 404 page, at 320, 768 and 1024px, Tab from the top reaches every
 *   visible focusable element, no element uses a positive tabindex, and each focused element is at
 *   least partly visible (WCAG 2.4.11). At 1024px each focus on the routes listed below (every
 *   page family, including the launch article) also changes the pixels around the element, so
 *   every stop has a visible indicator (WCAG 2.4.7), whichever way it is drawn.
 * - The skip link, route changes and the 404 page move focus to <main>.
 * - The site menu and the screenshot dialog take focus, keep it, close on Escape and give it back,
 *   and the dialog leaves the page where it was.
 *
 * WebKit's Tab skips links unless the reader turns on "Press Tab to highlight each item", so WebKit
 * walks with Option+Tab, as Safari readers do. Keys are held for 50ms, like a real key press.
 */

type BrowserName = "chromium" | "webkit";
const BROWSERS: readonly BrowserName[] = ["chromium", "webkit"];

/** A page in Chromium (the configured browser) or Playwright WebKit, launched once per worker. */
const test = base.extend<
  { openPage: (name: BrowserName, options?: BrowserContextOptions) => Promise<Page> },
  { webkit: () => Promise<Browser> }
>({
  webkit: [
    async ({ playwright }, provide) => {
      let launched: Promise<Browser> | undefined;
      await provide(() => (launched ??= playwright.webkit.launch()));
      if (launched) await (await launched).close();
    },
    { scope: "worker" },
  ],
  openPage: async ({ browser, webkit, baseURL }, provide) => {
    const contexts: BrowserContext[] = [];
    await provide(async (name, options) => {
      const target = name === "webkit" ? await webkit() : browser;
      const context = await target.newContext({
        baseURL,
        locale: "en-US",
        timezoneId: "UTC",
        ...options,
      });
      contexts.push(context);
      return context.newPage();
    });
    for (const context of contexts) await context.close();
  },
});

const KEY_HOLD = { delay: 50 };
const tabKey = (browserName: BrowserName, shift = false) =>
  `${shift ? "Shift+" : ""}${browserName === "webkit" ? "Alt+" : ""}Tab`;

/** Every non-article route the sitemap lists, one article, and a missing page. */
const ROUTES = [
  "/",
  "/portfolio",
  "/portfolio/ledgerguard",
  "/portfolio/tallyfolio",
  "/portfolio/alwaysgeeky",
  "/portfolio/emplifi",
  "/portfolio/controltech",
  "/portfolio/agent-tooling",
  "/portfolio/mapbylaw",
  "/writing",
  "/writing/agent-readiness-doctor",
  "/open-source",
  "/engineering-principles",
  "/now",
  "/this-page-does-not-exist",
];

/**
 * Marks every element a reader should be able to Tab to with `data-kb="<n>"`: rendered, not
 * disabled, not inert, and not taken out of the order with a negative tabindex.
 */
const markTabbables = (page: Page) =>
  page.evaluate(() => {
    const selector = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled]):not([type='hidden'])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "summary",
      "[tabindex]",
      "[contenteditable='true']",
    ].join(",");
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
      (element) =>
        element.tabIndex >= 0 &&
        !element.closest("[inert]") &&
        element.getClientRects().length > 0 &&
        element.checkVisibility({ visibilityProperty: true }) &&
        // A summary is only focusable as its details' first summary.
        (element.tagName !== "SUMMARY" || element.parentElement?.tagName === "DETAILS")
    );
    elements.forEach((element, index) => element.setAttribute("data-kb", String(index)));
    return {
      count: elements.length,
      positive: elements
        .filter((element) => element.tabIndex > 0)
        .map((element) => element.outerHTML.slice(0, 100)),
    };
  });

/** Where focus is now: its `data-kb` index, and whether any of it is visible and uncovered. */
const focusState = (page: Page) =>
  page.evaluate(() => {
    const active = document.activeElement as HTMLElement | null;
    if (!active || active === document.body || active === document.documentElement) return null;
    const box = active.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const points: [number, number][] = [];
    for (const fx of [0.1, 0.5, 0.9])
      for (const fy of [0.2, 0.5, 0.8])
        points.push([box.left + box.width * fx, box.top + box.height * fy]);
    const visible = points.some(([x, y]) => {
      if (x < 0 || y < 0 || x >= vw || y >= vh) return false;
      const hit = document.elementFromPoint(x, y);
      return hit != null && (active === hit || active.contains(hit));
    });
    return {
      index: active.getAttribute("data-kb"),
      describe: `${active.tagName.toLowerCase()} "${(active.textContent || active.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 40)}"`,
      visible,
      box: { x: box.left, y: box.top, width: box.width, height: box.height },
    };
  });

const finishTransitions = (page: Page) =>
  page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.playState === "running" &&
            animation.effect?.getTiming().iterations !== Infinity
        )
        .map((animation) => animation.finished.catch(() => undefined))
    )
  );

/** True when the pixels around the focused element change once focus leaves it. */
const showsFocus = async (
  page: Page,
  box: { x: number; y: number; width: number; height: number }
) => {
  const viewport = page.viewportSize()!;
  const x = Math.max(0, box.x - 6);
  const y = Math.max(0, box.y - 6);
  const clip = {
    x,
    y,
    width: Math.min(viewport.width, box.x + box.width + 6) - x,
    height: Math.min(viewport.height, box.y + box.height + 6) - y,
  };
  if (clip.width < 1 || clip.height < 1) return false;
  await finishTransitions(page);
  const focused = await page.screenshot({ clip, animations: "disabled" });
  const restore = await page.evaluate(() => {
    const active = document.activeElement as HTMLElement;
    active.blur();
    return active.getAttribute("data-kb");
  });
  await finishTransitions(page);
  const unfocused = await page.screenshot({ clip, animations: "disabled" });
  await page.evaluate((index) => {
    document.querySelector<HTMLElement>(`[data-kb="${index}"]`)?.focus({ preventScroll: true });
  }, restore);
  return !focused.equals(unfocused);
};

const viewportFor = (width: number) => ({ width, height: width === 1024 ? 768 : 900 });

interface WalkResult {
  positive: string[];
  missed: string[];
  hidden: string[];
  noIndicator: string[];
  unmarked: string[];
}

const CLEAN_WALK: WalkResult = {
  positive: [],
  missed: [],
  hidden: [],
  noIndicator: [],
  unmarked: [],
};

/**
 * Loads `path` and Tabs through it from the top. Returns what must be empty: controls Tab never
 * reached, stops that were entirely hidden or covered, stops with no visible change (checked at
 * 1024px), focus landing on something that is not a control, and positive tabindex values.
 */
const walk = async (
  page: Page,
  browserName: BrowserName,
  path: string,
  width: number,
  checkIndicator = width === 1024
): Promise<WalkResult> => {
  await page.goto(path);
  await settle(page);
  const { count, positive } = await markTabbables(page);
  // Start from the document itself, as a reader arriving on the page does.
  await page.evaluate(() => {
    (document.activeElement as HTMLElement | null)?.blur();
    window.scrollTo(0, 0);
  });
  const reached = new Set<string>();
  const hidden: string[] = [];
  const noIndicator: string[] = [];
  const unmarked: string[] = [];
  for (let step = 0; step < count * 2 + 10; step += 1) {
    await page.keyboard.press(tabKey(browserName), KEY_HOLD);
    const state = await focusState(page);
    // Past the last control focus goes to the browser's own controls (the body, to the page), then
    // back to the first. A page that focused its content on load starts mid-way, so keep going
    // round until a control comes up a second time.
    if (!state) continue;
    if (state.index === null) {
      unmarked.push(state.describe);
      continue;
    }
    if (reached.has(state.index)) break;
    reached.add(state.index);
    if (!state.visible) hidden.push(state.describe);
    else if (checkIndicator && !(await showsFocus(page, state.box))) {
      noIndicator.push(state.describe);
    }
  }
  const missed = await page.evaluate(
    (seen) =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-kb]"))
        .filter((element) => !seen.includes(element.getAttribute("data-kb")!))
        .map((element) => element.outerHTML.slice(0, 120)),
    [...reached]
  );
  const result = { positive, missed, hidden, noIndicator, unmarked };
  record(`keyboard__${browserName}__${width}__${path.replace(/\//g, "_")}`, {
    count,
    reached: reached.size,
    ...result,
  });
  return result;
};

for (const browserName of BROWSERS) {
  test.describe(`keyboard in ${browserName}`, () => {
    for (const width of [320, 768, 1024]) {
      for (const path of ROUTES) {
        test(`Tab reaches every control on ${path} at ${width}px`, async ({ openPage }) => {
          test.setTimeout(120_000);
          const page = await openPage(browserName, { viewport: viewportFor(width) });
          expect(await walk(page, browserName, path, width)).toEqual(CLEAN_WALK);
        });
      }

      test(`Tab reaches every control on every article at ${width}px`, async ({
        openPage,
        request,
      }) => {
        test.setTimeout(300_000);
        const sitemap = await (await request.get("/sitemap.xml")).text();
        const articles = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
          .map((match) => new URL(match[1]).pathname)
          .filter((path) => path.startsWith("/writing/"));
        expect(articles.length).toBeGreaterThan(0);
        const page = await openPage(browserName, { viewport: viewportFor(width) });
        const failures: Record<string, WalkResult> = {};
        for (const path of articles) {
          // The focus indicator is checked on the launch article above; articles share its parts.
          const result = await walk(page, browserName, path, width, false);
          if (JSON.stringify(result) !== JSON.stringify(CLEAN_WALK)) failures[path] = result;
        }
        expect(failures).toEqual({});
      });
    }

    test("the skip link is the first stop and moves focus to the main content", async ({
      openPage,
    }) => {
      const page = await openPage(browserName, { viewport: { width: 390, height: 844 } });
      await page.goto("/portfolio");
      await settle(page);
      await page.keyboard.press(tabKey(browserName), KEY_HOLD);
      const skip = page.getByRole("link", { name: /skip to/i });
      await expect(skip).toBeFocused();
      await expect(skip).toBeInViewport();
      await page.keyboard.press("Enter", KEY_HOLD);
      await expect(page.locator("#main-content")).toBeFocused();
    });

    test("a route change moves focus to the new page's main content", async ({ openPage }) => {
      const page = await openPage(browserName, { viewport: { width: 1024, height: 768 } });
      await page.goto("/");
      await settle(page);
      const link = page.locator("header nav").getByRole("link", { name: "Writing", exact: true });
      await link.focus();
      await page.keyboard.press("Enter", KEY_HOLD);
      await expect(page).toHaveURL(/\/writing$/);
      await expect(page.locator("#main-content")).toBeFocused();
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      // The next Tab continues from the top of the new page's content, not the old link.
      await page.keyboard.press(tabKey(browserName), KEY_HOLD);
      const next = await page.evaluate(
        () =>
          !!document.activeElement &&
          document.getElementById("main-content")!.contains(document.activeElement)
      );
      expect(next, "Tab after a route change stays in the new main content").toBe(true);
    });

    test("the 404 page focuses its main content and keeps the site navigation", async ({
      openPage,
    }) => {
      const page = await openPage(browserName, { viewport: { width: 390, height: 844 } });
      const response = await page.goto("/this-page-does-not-exist");
      expect(response?.status()).toBe(404);
      await settle(page);
      await expect(page.locator("#main-content")).toBeFocused();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.keyboard.press(tabKey(browserName), KEY_HOLD);
      const inMain = await page.evaluate(() =>
        document.getElementById("main-content")!.contains(document.activeElement)
      );
      expect(inMain, "Tab from the focused 404 content stays in it").toBe(true);
    });

    // The links fold behind the menu button at 520px and below.
    for (const width of [320, 520]) {
      test(`the site menu takes focus, closes on Escape and returns focus at ${width}px`, async ({
        openPage,
      }) => {
        const page = await openPage(browserName, { viewport: { width, height: 900 } });
        await page.goto("/portfolio");
        await settle(page);
        const open = page.getByRole("button", { name: "Open menu" });
        await open.focus();
        await page.keyboard.press("Enter", KEY_HOLD);
        const panel = page.locator("#site-menu");
        await expect(panel).toBeVisible();
        const close = page.getByRole("button", { name: "Close menu" });
        await expect(close).toHaveAttribute("aria-expanded", "true");
        await page.keyboard.press(tabKey(browserName), KEY_HOLD);
        await expect(panel.getByRole("link").first()).toBeFocused();
        await page.keyboard.press("Escape", KEY_HOLD);
        await expect(panel).toBeHidden();
        await expect(open).toBeFocused();

        // Following a menu link closes the menu and lands focus in the new page.
        await page.keyboard.press("Enter", KEY_HOLD);
        await expect(panel).toBeVisible();
        await panel.getByRole("link", { name: "Writing" }).focus();
        await page.keyboard.press("Enter", KEY_HOLD);
        await expect(page).toHaveURL(/\/writing$/);
        await expect(panel).toBeHidden();
        await expect(page.locator("#main-content")).toBeFocused();
      });
    }

    for (const viewport of [
      { width: 390, height: 844 },
      { width: 1440, height: 900 },
    ]) {
      test(`the screenshot dialog traps focus, pans by key and restores the page at ${viewport.width}px`, async ({
        openPage,
      }) => {
        const page = await openPage(browserName, { viewport });
        await page.goto("/portfolio/ledgerguard");
        await settle(page);
        const opener = page.locator("button[aria-haspopup='dialog']").nth(1);
        await opener.focus();
        await finishTransitions(page);
        const scrollY = await page.evaluate(() => window.scrollY);
        await page.keyboard.press("Enter", KEY_HOLD);
        const dialog = page.locator("dialog[open]");
        await expect(dialog).toBeVisible();
        const close = dialog.getByRole("button");
        const pane: Locator = dialog.locator("div:has(> img)");
        await expect(close).toBeFocused();

        // Tab and Shift+Tab cycle between the close button and the image, never the page behind.
        // Past the last stop a native modal dialog hands focus to the browser's own controls,
        // which the page sees as the body; the next Tab comes back into the dialog.
        const stops: string[] = [];
        for (const shift of [false, false, false, true, true]) {
          await page.keyboard.press(tabKey(browserName, shift), KEY_HOLD);
          stops.push(
            await page.evaluate(() => {
              const active = document.activeElement;
              if (!active || active === document.body) return "body";
              if (!active.closest("dialog[open]")) return `outside: ${active.tagName}`;
              return active.tagName === "BUTTON" ? "close" : "image";
            })
          );
        }
        expect(stops.filter((stop) => stop.startsWith("outside"))).toEqual([]);
        expect(stops).toContain("image");

        // Arrow keys pan the image when it is wider than the dialog.
        await pane.focus();
        await expect(pane).toBeFocused();
        const wide = await pane.evaluate((element) => element.scrollWidth > element.clientWidth);
        if (wide) {
          for (let index = 0; index < 3; index += 1)
            await page.keyboard.press("ArrowRight", KEY_HOLD);
          await expect
            .poll(() => pane.evaluate((element) => element.scrollLeft))
            .toBeGreaterThan(0);
        }

        await page.keyboard.press("Escape", KEY_HOLD);
        await expect(dialog).toHaveCount(0);
        await expect(opener).toBeFocused();
        expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);

        // A click on the backdrop closes it too, with the same focus return and scroll position.
        await page.keyboard.press("Enter", KEY_HOLD);
        await expect(dialog).toBeVisible();
        const box = (await dialog.boundingBox())!;
        const outside =
          box.y > 4
            ? { x: box.x + box.width / 2, y: box.y / 2 }
            : { x: box.x / 2, y: box.y + box.height / 2 };
        await page.mouse.click(outside.x, outside.y);
        await expect(dialog).toHaveCount(0);
        await expect(opener).toBeFocused();
        expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
      });
    }
  });
}
