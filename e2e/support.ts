import type { Page } from "@playwright/test";

export const PAGES = [
  { name: "home", path: "/" },
  { name: "portfolio", path: "/portfolio" },
] as const;

export const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 375, height: 812 },
  { width: 320, height: 720 },
] as const;

/** Waits for web fonts and a settled layout so screenshots and measurements are stable. */
export const settle = async (page: Page): Promise<void> => {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      )
  );
};

/** Scrolls to the bottom in viewport steps, then back to the top, so scroll-driven islands run. */
export const scrollThrough = async (page: Page): Promise<void> => {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = await page.evaluate(() => window.innerHeight * 0.8);
  for (let y = 0; y < height; y += step) {
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
};

/**
 * Every route family: the redesigned pages, the legacy-styled pages that share the shell, and a
 * 404. Used by the responsive gate; visual baselines stay on the smaller PAGES set.
 */
export const AUDIT_ROUTES: ReadonlyArray<{ name: string; path: string; status?: number }> = [
  { name: "home", path: "/" },
  { name: "portfolio", path: "/portfolio" },
  { name: "case-study", path: "/portfolio/ledgerguard" },
  { name: "writing", path: "/writing" },
  { name: "article", path: "/writing/agent-readiness-doctor" },
  { name: "open-source", path: "/open-source" },
  { name: "engineering-principles", path: "/engineering-principles" },
  { name: "now", path: "/now" },
  { name: "not-found", path: "/this-page-does-not-exist", status: 404 },
];

export interface AuditViewport {
  width: number;
  height: number;
  kind: "mobile" | "tablet" | "desktop";
}

/** Emulated device classes: phones (portrait and landscape), tablets both ways, desktops. */
export const AUDIT_VIEWPORTS: readonly AuditViewport[] = [
  { width: 320, height: 568, kind: "mobile" },
  { width: 375, height: 812, kind: "mobile" },
  { width: 390, height: 844, kind: "mobile" },
  { width: 430, height: 932, kind: "mobile" },
  { width: 568, height: 320, kind: "mobile" },
  { width: 844, height: 390, kind: "mobile" },
  { width: 768, height: 1024, kind: "tablet" },
  { width: 820, height: 1180, kind: "tablet" },
  { width: 1024, height: 768, kind: "tablet" },
  { width: 1180, height: 820, kind: "tablet" },
  { width: 1280, height: 800, kind: "desktop" },
  { width: 1440, height: 900, kind: "desktop" },
  { width: 1920, height: 1080, kind: "desktop" },
];

export const horizontalOverflow =(page: Page): Promise<number> =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
