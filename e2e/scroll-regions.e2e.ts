import {
  type Browser,
  type BrowserContext,
  type BrowserContextOptions,
  expect,
  type Locator,
  type Page,
  test as base,
} from "@playwright/test";

import { settle } from "./support";

/*
 * RG-A2: every region that scrolls inside the page can be reached and scrolled from the keyboard,
 * in Chromium and in Playwright WebKit (not Safari). Chromium lets the keyboard into any scroller;
 * WebKit only into one that is focusable itself or holds something focusable. The screenshot
 * dialog's image is covered with the dialog's own checks.
 *
 * Keys are held for 50ms, like a real key press: WebKit ignores an arrow key that goes down and up
 * in the same instant. WebKit's Tab skips links unless the reader turns on "Press Tab to highlight
 * each item", so the regions whose only focusable content is links are walked with Option+Tab
 * there, as Safari readers do.
 */

type BrowserName = "chromium" | "webkit";

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

const markScrollers = (page: Page) =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .filter((element) => {
        const style = getComputedStyle(element);
        const scrolls = (value: string) => value === "auto" || value === "scroll";
        const x = scrolls(style.overflowX) && element.scrollWidth > element.clientWidth + 1;
        const y = scrolls(style.overflowY) && element.scrollHeight > element.clientHeight + 1;
        return (
          (x || y) &&
          element.getClientRects().length > 0 &&
          element.tagName !== "TEXTAREA" &&
          !element.closest("dialog")
        );
      })
      .map((element, index) => {
        element.setAttribute("data-scroller", String(index));
        const focusable = element.querySelector(
          "a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])"
        );
        return {
          index,
          element: `${element.tagName.toLowerCase()}${element.className ? `.${String(element.className).split(" ")[0]}` : ""}`,
          tabindex: element.getAttribute("tabindex"),
          role: element.getAttribute("role"),
          name: element.getAttribute("aria-label") ?? element.getAttribute("aria-labelledby"),
          holdsFocusable: focusable != null,
        };
      })
  );

const ROUTE_WIDTHS = [320, 390, 768, 1024, 1440];

test.describe("every scroll region is keyboard reachable", () => {
  for (const width of ROUTE_WIDTHS) {
    test(`on every sitemap route at ${width}px`, async ({ page, request }) => {
      test.setTimeout(180_000);
      const sitemap = await (await request.get("/sitemap.xml")).text();
      const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
        (match) => new URL(match[1]).pathname
      );
      expect(paths.length).toBeGreaterThan(10);
      await page.setViewportSize({ width, height: 900 });
      const problems: string[] = [];
      for (const path of [...paths, "/this-page-does-not-exist"]) {
        await page.goto(path);
        await settle(page);
        for (const scroller of await markScrollers(page)) {
          const region = scroller.tabindex === "0" && scroller.role === "region" && !!scroller.name;
          if (!region && !scroller.holdsFocusable) problems.push(`${path} ${scroller.element}`);
        }
      }
      expect(problems).toEqual([]);
    });
  }
});

interface RegionCase {
  name: string;
  path: string;
  width: number;
  region: string;
}

const REGIONS: RegionCase[] = [
  {
    name: "post code block",
    path: "/writing/agent-instructions-are-code",
    width: 390,
    region: "[data-prose] pre",
  },
  {
    name: "post table",
    path: "/writing/why-i-automate-code-review-with-mcp",
    width: 390,
    region: "[data-prose] [data-table]",
  },
  { name: "install command", path: "/open-source", width: 390, region: "main pre[role='region']" },
  {
    name: "contribution calendar",
    path: "/open-source",
    width: 390,
    region: "main [role='region'][aria-label^='Contribution calendar']",
  },
];

interface ContainerCase {
  name: string;
  path: string;
  width: number;
  container: string;
}

const CONTAINERS: ContainerCase[] = [
  {
    name: "case study chapter rail",
    path: "/portfolio/ledgerguard",
    width: 390,
    container: "main nav[aria-label] > ol",
  },
  {
    name: "article contents",
    path: "/writing/how-i-would-build-a-real-time-backgammon-platform",
    width: 1024,
    container: "aside:has([data-toc-link]) > div",
  },
];

const firstOverflowing = async (page: Page, selector: string): Promise<Locator> => {
  const found = await page.evaluate((selector) => {
    const element = Array.from(document.querySelectorAll<HTMLElement>(selector)).find(
      (candidate) =>
        candidate.scrollWidth > candidate.clientWidth + 1 ||
        candidate.scrollHeight > candidate.clientHeight + 1
    );
    element?.setAttribute("data-probe", "");
    return element != null;
  }, selector);
  expect(found, `${selector} overflows`).toBe(true);
  return page.locator("[data-probe]");
};

const tabInto = async (page: Page, target: Locator, key: string) => {
  for (let presses = 0; presses < 400; presses++) {
    await page.keyboard.press(key);
    if (await target.evaluate((element) => element.contains(document.activeElement))) return;
  }
  throw new Error(`${key} never reached the region`);
};

const scrollPosition = (target: Locator) =>
  target.evaluate((element) => ({
    left: element.scrollLeft,
    top: element.scrollTop,
    maxLeft: element.scrollWidth - element.clientWidth,
  }));

const focusRing = (page: Page) =>
  page.evaluate(() => {
    const element = document.activeElement as HTMLElement;
    const style = getComputedStyle(element);
    return {
      focusVisible: element.matches(":focus-visible"),
      outline: style.outlineStyle !== "none" && parseFloat(style.outlineWidth) >= 2,
    };
  });

for (const browserName of ["chromium", "webkit"] as const) {
  test.describe(`keyboard scrolling in ${browserName}`, () => {
    for (const item of REGIONS) {
      test(`Tab reaches the ${item.name} and arrow keys scroll it`, async ({ openPage }) => {
        const page = await openPage(browserName, { viewport: { width: item.width, height: 844 } });
        await page.goto(item.path);
        await settle(page);
        const region = await firstOverflowing(page, item.region);
        await expect(region).toHaveAttribute("tabindex", "0");
        await expect(region).toHaveAttribute("role", "region");
        await expect(region).toHaveAttribute("aria-label", /\S/);

        await tabInto(page, region, "Tab");
        await expect(region).toBeFocused();
        expect(await focusRing(page)).toEqual({ focusVisible: true, outline: true });

        // The calendar opens on the latest week, at its right edge; everything else at the left.
        const before = await scrollPosition(region);
        const atEnd = before.left >= before.maxLeft - 1;
        await page.keyboard.press(atEnd ? "ArrowLeft" : "ArrowRight", KEY_HOLD);
        await expect
          .poll(async () => (await scrollPosition(region)).left)
          [atEnd ? "toBeLessThan" : "toBeGreaterThan"](before.left);
        await expect(region).toBeFocused();
      });
    }

    for (const item of CONTAINERS) {
      test(`the ${item.name} scrolls to each link the keyboard reaches`, async ({ openPage }) => {
        const page = await openPage(browserName, { viewport: { width: item.width, height: 844 } });
        await page.goto(item.path);
        await settle(page);
        const container = await firstOverflowing(page, item.container);
        const key = browserName === "webkit" ? "Alt+Tab" : "Tab";

        await tabInto(page, container, key);
        expect(await focusRing(page)).toEqual({ focusVisible: true, outline: true });
        const start = await scrollPosition(container);
        let moved = false;
        for (let presses = 0; presses < 40 && !moved; presses++) {
          await page.keyboard.press(key);
          if (!(await container.evaluate((element) => element.contains(document.activeElement))))
            break;
          const now = await scrollPosition(container);
          moved = now.left !== start.left || now.top !== start.top;
        }
        expect(moved, "focus moving through the links scrolls the container").toBe(true);
      });
    }
  });
}
