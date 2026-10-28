import {
  type Browser,
  type BrowserContext,
  type BrowserContextOptions,
  expect,
  type Locator,
  type Page,
  test,
} from "@playwright/test";

import { settle } from "./support";

/*
 * Back and Forward return the reader to where they were. A link navigation still starts the next
 * page at the top.
 */

const scrollY = (page: Page) => page.evaluate(() => Math.round(window.scrollY));

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

/*
 * DM-02: pages with a scroll scene. The launch article's refactor scene and the portfolio's
 * operating-model scene are a tall runway while they can animate and one still frame otherwise.
 * The runway used to appear only once the scene script ran, so the server-rendered page was
 * 450–2,500px shorter than the hydrated one. On a cross-document Back or Forward the browser restored
 * the old offset against the short page, and scroll anchoring then carried the reader that far past
 * their place, further on every round trip. Each check records where a piece of content sits in the
 * viewport, leaves, comes back, and compares. Runs in Chromium and in Playwright WebKit (not Safari).
 */

type BrowserName = "chromium" | "webkit";
type OpenPage = (name: BrowserName, options?: BrowserContextOptions) => Promise<Page>;

/** A page in Chromium (the configured browser) or Playwright WebKit, launched once per worker. */
const sceneTest = test.extend<{ openPage: OpenPage }, { webkit: () => Promise<Browser> }>({
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

const LAUNCH = "/writing/agent-readiness-doctor";
const LAUNCH_SCENE = "section[data-step]";
/** The first article link after the scene. Article prose links are plain anchors: a full load. */
const LAUNCH_LINK = "main article a[href='/open-source']";
const PORTFOLIO_SCENE = "section[aria-labelledby='operating-model-heading']";
const TOLERANCE = 40;

interface Place {
  y: number;
  top: number;
}

/** The scroll offset, and where `anchor` sits in the viewport. */
const place = async (page: Page, anchor: Locator): Promise<Place> => ({
  y: await scrollY(page),
  top: Math.round(await anchor.evaluate((element) => element.getBoundingClientRect().top)),
});

/** Scrolls with the wheel from the top through the scene until `anchor` is on screen. */
const readTo = async (page: Page, anchor: Locator): Promise<Place> => {
  const vh = page.viewportSize()!.height;
  const target = await anchor.evaluate((element) => element.getBoundingClientRect().top);
  for (let y = 0; y < target - vh / 2; y += vh * 0.8) await page.mouse.wheel(0, vh * 0.8);
  await anchor.scrollIntoViewIfNeeded();
  await settle(page);
  return place(page, anchor);
};

/** Waits for the page to settle, then checks that `anchor` is back where it was. */
const expectRestored = async (page: Page, anchor: Locator, before: Place) => {
  await settle(page);
  const after = await place(page, anchor);
  expect(Math.abs(after.top - before.top), `content offset, was ${before.top}`).toBeLessThan(
    TOLERANCE
  );
  expect(Math.abs(after.y - before.y), `scrollY, was ${before.y}`).toBeLessThan(TOLERANCE);
};

/**
 * The scene is as tall in the server markup, before any script runs, as on the hydrated page, so a
 * restored offset never points at a different layout.
 */
const expectSameHeightBeforeScripts = async (page: Page, path: string, section: string) => {
  const height = (target: Page) =>
    target.evaluate(
      (selector) => Math.round(document.querySelector(selector)!.getBoundingClientRect().height),
      section
    );
  const hydrated = await height(page);
  const markupOnly = await page.context().newPage();
  await markupOnly.setViewportSize(page.viewportSize()!);
  await markupOnly.route("**/_next/static/**/*.js", (route) => route.abort());
  await markupOnly.goto(path);
  expect(await height(markupOnly)).toBe(hydrated);
  await markupOnly.close();
};

interface MotionState {
  name: string;
  options: BrowserContextOptions;
  paused?: boolean;
}

const MOTION_ON: MotionState = { name: "motion on", options: { reducedMotion: "no-preference" } };
const REDUCED: MotionState = { name: "reduced motion", options: { reducedMotion: "reduce" } };
/** The visitor paused automatic motion (MotionToggle); scroll-linked scenes still step. */
const PAUSED: MotionState = { ...MOTION_ON, name: "motion paused", paused: true };

for (const browserName of ["chromium", "webkit"] as const) {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    sceneTest.describe(`scroll scenes in ${browserName} at ${viewport.width}px`, () => {
      const open = async (openPage: OpenPage, state: MotionState) => {
        const page = await openPage(browserName, { viewport, ...state.options });
        if (state.paused) {
          await page.addInitScript(() => window.localStorage.setItem("motion-paused", "1"));
        }
        return page;
      };

      for (const state of [MOTION_ON, REDUCED, PAUSED]) {
        sceneTest(
          `launch article, ${state.name}: Back and Forward keep the place`,
          async ({ openPage }) => {
            const page = await open(openPage, state);
            await page.goto(LAUNCH);
            await settle(page);
            if (state.paused) {
              await expect(page.locator("html")).toHaveAttribute("data-motion-paused", "");
            }
            const anchor = page.locator(LAUNCH_LINK).first();
            const before = await readTo(page, anchor);
            expect(before.y).toBeGreaterThan(viewport.height);

            await anchor.click();
            await page.waitForURL("**/open-source");
            await page.goBack();
            await page.waitForURL(`**${LAUNCH}`);
            await expectRestored(page, anchor, before);

            // A second round trip must not add to the first.
            await page.goForward();
            await page.waitForURL("**/open-source");
            await page.goBack();
            await page.waitForURL(`**${LAUNCH}`);
            await expectRestored(page, anchor, before);
            await expectSameHeightBeforeScripts(page, LAUNCH, LAUNCH_SCENE);
          }
        );
      }

      sceneTest("launch article: quick Back and Forward keep the place", async ({ openPage }) => {
        const page = await open(openPage, MOTION_ON);
        await page.goto(LAUNCH);
        await settle(page);
        const anchor = page.locator(LAUNCH_LINK).first();
        const before = await readTo(page, anchor);

        await anchor.click();
        await page.waitForURL("**/open-source");
        // Each step starts as soon as the previous one has committed, before that page has loaded,
        // hydrated or settled. Waiting for the address rather than goBack's own promise matters:
        // Next replaces the history entry's state while hydrating, which Playwright can take for the
        // end of the traversal.
        // A step taken while the tab is between documents can fail to read the history list before
        // it navigates at all; try that step again rather than failing the place check.
        const step = async (go: () => Promise<unknown>, path: string) => {
          for (let attempt = 0; ; attempt += 1) {
            try {
              await go();
              break;
            } catch (error) {
              if (attempt >= 3 || !String(error).includes("Not attached to an active page")) {
                throw error;
              }
            }
          }
          await page.waitForURL(`**${path}`, { waitUntil: "commit" });
        };
        for (let round = 0; round < 3; round += 1) {
          await step(() => page.goBack({ waitUntil: "commit" }), LAUNCH);
          await step(() => page.goForward({ waitUntil: "commit" }), "/open-source");
        }
        await step(() => page.goBack({ waitUntil: "commit" }), LAUNCH);
        await expectRestored(page, anchor, before);
      });

      sceneTest(
        "launch article: Back after an in-app link keeps the place",
        async ({ openPage }) => {
          const page = await open(openPage, MOTION_ON);
          await page.goto(LAUNCH);
          await settle(page);
          const anchor = page.locator(LAUNCH_LINK).first();
          const before = await readTo(page, anchor);

          await page.evaluate(() =>
            document.querySelector<HTMLAnchorElement>("header a[href='/writing']")!.click()
          );
          await page.waitForURL((url) => url.pathname === "/writing");
          await settle(page);
          await expect.poll(() => scrollY(page)).toBe(0);
          await page.goBack();
          await page.waitForURL(`**${LAUNCH}`);
          await expectRestored(page, anchor, before);
        }
      );

      sceneTest("launch article: Back returns to a contents jump", async ({ openPage }) => {
        const page = await open(openPage, MOTION_ON);
        await page.goto(LAUNCH);
        await settle(page);
        const hash = "#where-the-mcp-server-and-plugins-fit";
        // Phones fold the contents into a disclosure. It is closed again before leaving, because a
        // full load does not keep it open and would move everything below it.
        const contents = page.locator("main aside");
        const fold = contents.locator("details > summary");
        const folded = await fold.isVisible();
        if (folded) await fold.click();
        await contents.locator(`a[href='${hash}']:visible`).first().click();
        await expect(page).toHaveURL(new RegExp(`${hash}$`));
        if (folded) await fold.click();
        await settle(page);
        const anchor = page.locator(hash);
        const before = await place(page, anchor);

        await page.goto("/now");
        await page.goBack();
        await expect(page).toHaveURL(new RegExp(`${LAUNCH}${hash}$`));
        await expectRestored(page, anchor, before);
      });

      for (const state of [MOTION_ON, REDUCED]) {
        sceneTest(
          `portfolio, ${state.name}: Back keeps the place below the scene`,
          async ({ openPage }) => {
            const page = await open(openPage, state);
            await page.goto("/portfolio");
            await settle(page);
            const anchor = page.locator("#portfolio-contact-heading");
            const before = await readTo(page, anchor);

            // A full load, as when following a link to another site.
            await page.goto("/now");
            await page.goBack();
            await page.waitForURL("**/portfolio");
            await expectRestored(page, anchor, before);
            await expectSameHeightBeforeScripts(page, "/portfolio", PORTFOLIO_SCENE);
          }
        );
      }
    });
  }
}
