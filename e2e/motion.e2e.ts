import { expect, type Locator, type Page, test } from "@playwright/test";

import { settle } from "./support";

/*
 * The footer's automatic-motion control and the frame-loop lifecycle behind it: what the pause
 * stops, what it leaves alone, how it persists, and that navigation leaves no loops or listeners
 * behind. Runs against a production build (`pnpm build`, then `pnpm start`).
 */

const PAUSE = "Pause automatic motion";
const RESUME = "Resume automatic motion";
const REDUCED = "Automatic motion off";

/** Every route with a motion island, including the idle loops on open-source, principles and now. */
const ROUTES = [
  "/",
  "/portfolio",
  "/open-source",
  "/engineering-principles",
  "/now",
  "/this-page-does-not-exist",
] as const;
const NOT_FOUND = "/this-page-does-not-exist";

interface MotionProbe {
  requested: number;
  pending: Set<number>;
  maxPending: number;
  listeners: Map<string, Set<unknown>>;
  observers: number;
}

type ProbeWindow = Window & { __probe: MotionProbe };

/**
 * Counts animation-frame requests, frames still pending, live IntersectionObservers and the
 * window/document listeners the motion code adds, before any page script runs.
 */
const installProbe = (page: Page) =>
  page.addInitScript(() => {
    const probe = {
      requested: 0,
      pending: new Set<number>(),
      maxPending: 0,
      listeners: new Map<string, Set<unknown>>(),
      observers: 0,
    };
    (window as unknown as { __probe: typeof probe }).__probe = probe;

    const request = window.requestAnimationFrame.bind(window);
    const cancel = window.cancelAnimationFrame.bind(window);
    window.requestAnimationFrame = (callback) => {
      const id = request((time) => {
        probe.pending.delete(id);
        callback(time);
      });
      probe.requested += 1;
      probe.pending.add(id);
      probe.maxPending = Math.max(probe.maxPending, probe.pending.size);
      return id;
    };
    window.cancelAnimationFrame = (id) => {
      probe.pending.delete(id);
      cancel(id);
    };

    const tracked = new Set(["scroll", "resize", "visibilitychange", "pageshow", "storage"]);
    const keyFor = (target: EventTarget, type: string) =>
      `${target === window ? "window" : "document"}:${type}`;
    const add = EventTarget.prototype.addEventListener;
    const remove = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      if ((this === window || this === document) && tracked.has(type) && listener) {
        const key = keyFor(this, type);
        if (!probe.listeners.has(key)) probe.listeners.set(key, new Set());
        probe.listeners.get(key)?.add(listener);
      }
      return add.call(this, type, listener, options);
    };
    EventTarget.prototype.removeEventListener = function (type, listener, options) {
      if ((this === window || this === document) && tracked.has(type) && listener) {
        probe.listeners.get(keyFor(this, type))?.delete(listener);
      }
      return remove.call(this, type, listener, options);
    };

    const Native = window.IntersectionObserver;
    window.IntersectionObserver = class extends Native {
      private live = false;
      observe(target: Element) {
        if (!this.live) {
          this.live = true;
          probe.observers += 1;
        }
        super.observe(target);
      }
      disconnect() {
        if (this.live) {
          this.live = false;
          probe.observers -= 1;
        }
        super.disconnect();
      }
    };
  });

const snapshot = (page: Page) =>
  page.evaluate(() => {
    const probe = (window as unknown as ProbeWindow).__probe;
    const listeners: Record<string, number> = {};
    probe.listeners.forEach((set, key) => {
      listeners[key] = set.size;
    });
    return { listeners, observers: probe.observers };
  });

/** Animation frames requested during `ms`, and the most that were ever pending at once. */
const framesDuring = async (page: Page, ms: number) => {
  const start = await page.evaluate(() => {
    const probe = (window as unknown as ProbeWindow).__probe;
    probe.maxPending = probe.pending.size;
    return probe.requested;
  });
  await page.waitForTimeout(ms);
  return page.evaluate((from) => {
    const probe = (window as unknown as ProbeWindow).__probe;
    return { requested: probe.requested - from, maxPending: probe.maxPending };
  }, start);
};

/** The display-type stack ticker on /now (CSS module class names keep their local name). */
const NOW_TICKER = "main [class$='_ticker']";

const footerControl = (page: Page): Locator => page.locator("footer [data-motion-control]");

/** Toggles without scrolling, so islands at the top of the page stay on screen. */
const toggleInPlace = (page: Page) => footerControl(page).dispatchEvent("click");

const setTabHidden = (page: Page, hidden: boolean) =>
  page.evaluate((next) => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => (next ? "hidden" : "visible"),
    });
    Object.defineProperty(document, "hidden", { configurable: true, get: () => next });
    document.dispatchEvent(new Event("visibilitychange"));
  }, hidden);

const dotAnimation = (page: Page) =>
  page.evaluate(() => {
    const dot = document.querySelector("header [aria-hidden='true'][class*='dot']");
    return dot ? getComputedStyle(dot).animationName : "missing";
  });

const clickNav = async (page: Page, href: string) => {
  await page.locator(`header nav a[href="${href}"]`).first().click();
  await page.waitForURL((url) => url.pathname === href);
  await settle(page);
};

test.use({ viewport: { width: 1440, height: 900 } });

test.describe("motion control", () => {
  test("names the action, keeps visible text equal to the accessible name, no aria-pressed", async ({
    page,
  }) => {
    await page.goto("/");
    await settle(page);
    const button = page.getByRole("button", { name: PAUSE, exact: true });
    await expect(button).toBeVisible();
    await expect(button).not.toHaveAttribute("aria-pressed");
    expect((await button.innerText()).toLowerCase()).toBe(PAUSE.toLowerCase());
    const runningWidth = (await button.boundingBox())?.width;
    expect(await dotAnimation(page)).not.toBe("none");

    await button.click();
    const resume = page.getByRole("button", { name: RESUME, exact: true });
    await expect(resume).toBeVisible();
    await expect(resume).not.toHaveAttribute("aria-pressed");
    expect((await resume.innerText()).toLowerCase()).toBe(RESUME.toLowerCase());
    await expect(resume).toBeFocused();
    expect((await resume.boundingBox())?.width).toBe(runningWidth);
    await expect(page.locator("html")).toHaveAttribute("data-motion-paused", "");
    expect(await dotAnimation(page)).toBe("none");

    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: PAUSE, exact: true })).toBeFocused();
    await expect(page.locator("html")).not.toHaveAttribute("data-motion-paused");
  });

  test("remembers the pause across reloads", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    await page.getByRole("button", { name: PAUSE, exact: true }).click();
    expect(await page.evaluate(() => localStorage.getItem("motion-paused"))).toBe("1");

    await page.reload();
    await settle(page);
    await expect(page.getByRole("button", { name: RESUME, exact: true })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-motion-paused", "");
    expect(await dotAnimation(page)).toBe("none");
  });

  test("keeps working without errors when storage is blocked", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        get: () => {
          throw new DOMException("The operation is insecure.", "SecurityError");
        },
      });
    });
    await page.goto("/");
    await settle(page);
    await page.getByRole("button", { name: PAUSE, exact: true }).click();
    await expect(page.getByRole("button", { name: RESUME, exact: true })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-motion-paused", "");

    await page.reload();
    await settle(page);
    // Nothing could be stored, so a reload starts running again; nothing throws.
    await expect(page.getByRole("button", { name: PAUSE, exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("defers to reduced motion and follows live changes to it", async ({ browser }) => {
    const context = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    await page.goto("/");
    await settle(page);
    const footer = page.locator("footer");
    await expect(footer.getByRole("button")).toHaveCount(0);
    await expect(footer.getByText(REDUCED, { exact: true })).toBeVisible();
    expect(await dotAnimation(page)).toBe("none");

    await page.emulateMedia({ reducedMotion: "no-preference" });
    const pause = footer.getByRole("button", { name: PAUSE, exact: true });
    await expect(pause).toBeVisible();
    expect(await dotAnimation(page)).not.toBe("none");
    await pause.click();
    await expect(footer.getByRole("button", { name: RESUME, exact: true })).toBeVisible();

    // Reduced motion comes back on: no control can re-enable motion, the stored pause is kept.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(footer.getByRole("button")).toHaveCount(0);
    await expect(footer.getByText(REDUCED, { exact: true })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem("motion-paused"))).toBe("1");

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(footer.getByRole("button", { name: RESUME, exact: true })).toBeVisible();
    await context.close();
  });
});

test.describe("automatic motion loop", () => {
  test.beforeEach(async ({ page }) => {
    await installProbe(page);
  });

  for (const path of ["/open-source", "/engineering-principles", "/now"]) {
    test(`${path}: one shared loop that stops on pause and while the tab is hidden`, async ({
      page,
    }) => {
      await page.goto(path);
      await settle(page);
      // Bring an idle-motion island on screen (the now ticker sits below the fold).
      if (path === "/now") {
        await page
          .locator(NOW_TICKER)
          .evaluate((element) => element.scrollIntoView({ block: "center" }));
        await page.waitForTimeout(300);
      }

      const running = await framesDuring(page, 800);
      expect(running.requested).toBeGreaterThan(10);
      expect(running.maxPending).toBeLessThanOrEqual(1);

      await setTabHidden(page, true);
      await page.waitForTimeout(100);
      expect((await framesDuring(page, 800)).requested).toBe(0);
      await setTabHidden(page, false);
      expect((await framesDuring(page, 500)).requested).toBeGreaterThan(5);

      await toggleInPlace(page);
      await expect(footerControl(page)).toHaveAccessibleName(RESUME);
      await page.waitForTimeout(100);
      expect((await framesDuring(page, 1000)).requested).toBe(0);

      await toggleInPlace(page);
      await expect(footerControl(page)).toHaveAccessibleName(PAUSE);
      const resumed = await framesDuring(page, 500);
      expect(resumed.requested).toBeGreaterThan(5);
      expect(resumed.maxPending).toBeLessThanOrEqual(1);
    });
  }

  test("scroll-linked motion keeps working while paused", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    await toggleInPlace(page);
    await expect(footerControl(page)).toHaveAccessibleName(RESUME);
    const progress = () =>
      page.evaluate(() => {
        const line = Array.from(
          document.querySelectorAll<HTMLElement>("header [aria-hidden]")
        ).find((element) => element.style.getPropertyValue("--p") !== "");
        return Number(line?.style.getPropertyValue("--p") ?? 0);
      });
    expect(await progress()).toBe(0);
    await page.mouse.wheel(0, 1600);
    await page.waitForTimeout(400);
    expect(await progress()).toBeGreaterThan(0);
    // ...and goes idle again once the scroll settles.
    await page.waitForTimeout(1200);
    expect((await framesDuring(page, 800)).requested).toBe(0);
  });

  test("the now ticker drifts while running, and only moves with scroll while paused", async ({
    page,
  }) => {
    await page.goto("/now");
    await settle(page);
    const trackTransform = () =>
      page
        .locator(`${NOW_TICKER} > div`)
        .evaluate((track) => (track as HTMLElement).style.transform);
    await page
      .locator(NOW_TICKER)
      .evaluate((element) => element.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(600);
    const a = await trackTransform();
    await page.waitForTimeout(400);
    expect(await trackTransform()).not.toBe(a);

    await toggleInPlace(page);
    await page.waitForTimeout(200);
    const still = await trackTransform();
    await page.waitForTimeout(800);
    expect(await trackTransform()).toBe(still);

    // The ticker sits near the end of the page, so scroll up to move it.
    await page.mouse.wheel(0, -300);
    await page.waitForTimeout(300);
    expect(await trackTransform()).not.toBe(still);
  });
});

test.describe("navigation lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    await installProbe(page);
  });

  test("Back and Forward between home and portfolio keep the pause and leave no stale loop", async ({
    page,
  }) => {
    await page.goto("/");
    await settle(page);
    await page.getByRole("button", { name: PAUSE, exact: true }).click();

    await clickNav(page, "/portfolio");
    await expect(footerControl(page)).toHaveAccessibleName(RESUME);
    await page.goBack();
    await page.waitForURL((url) => url.pathname === "/");
    await settle(page);
    await expect(footerControl(page)).toHaveAccessibleName(RESUME);
    await expect(page.locator("html")).toHaveAttribute("data-motion-paused", "");
    await page.goForward();
    await page.waitForURL((url) => url.pathname === "/portfolio");
    await settle(page);
    await expect(footerControl(page)).toHaveAccessibleName(RESUME);

    // Resume on a page with an idle loop, then leave it: the loop must not follow.
    await clickNav(page, "/open-source");
    await page.evaluate(() => window.scrollTo(0, 0));
    await toggleInPlace(page);
    await expect(footerControl(page)).toHaveAccessibleName(PAUSE);
    expect((await framesDuring(page, 500)).requested).toBeGreaterThan(5);

    await page.goBack();
    await page.waitForURL((url) => url.pathname === "/portfolio");
    await settle(page);
    await page.waitForTimeout(1500);
    expect((await framesDuring(page, 1000)).requested).toBe(0);
    await page.goBack();
    await page.waitForURL((url) => url.pathname === "/");
    await settle(page);
    await page.waitForTimeout(1500);
    expect((await framesDuring(page, 1000)).requested).toBe(0);
    await expect(footerControl(page)).toHaveAccessibleName(PAUSE);
  });

  for (const path of ROUTES.filter((route) => route !== NOT_FOUND)) {
    test(`${path}: client navigation away and back restores the same listener and observer counts`, async ({
      page,
    }) => {
      await page.goto(path);
      await settle(page);
      await page.waitForTimeout(500);
      const baseline = await snapshot(page);

      for (let round = 0; round < 2; round += 1) {
        await page.locator("header a[href='/']").first().click();
        await page.waitForURL((url) => url.pathname === "/");
        await settle(page);
        if (path !== "/portfolio") await clickNav(page, "/portfolio");
        else await clickNav(page, "/open-source");
        await page.goBack();
        if (path !== "/") {
          await page.goBack();
        }
        await page.waitForURL((url) => url.pathname === path);
        await settle(page);
        await page.waitForTimeout(500);
        expect(await snapshot(page), `round ${round + 1}`).toEqual(baseline);
      }
    });
  }

  test("leaving the 404 client-side tears its islands down", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    await page.waitForTimeout(500);
    const home = await snapshot(page);

    await page.goto(NOT_FOUND);
    await settle(page);
    // Header links on the 404 do not navigate client-side (a separate, pre-existing issue), so
    // leave through the page's own "Home" link.
    await page.locator("main a[href='/']").first().click();
    await page.waitForURL((url) => url.pathname === "/");
    await settle(page);
    await page.waitForTimeout(500);
    expect(await snapshot(page)).toEqual(home);
    await page.waitForTimeout(1000);
    expect((await framesDuring(page, 1000)).requested).toBe(0);
  });
});
