import {
  expect,
  type Page,
  type PageAssertionsToHaveScreenshotOptions,
  test,
} from "@playwright/test";

export const visualBaseline = (name: string) =>
  ({ tag: "@visual", annotation: { type: "baseline", description: `${name}.png` } }) as const;

export const expectBaseline = async (
  page: Page,
  options: PageAssertionsToHaveScreenshotOptions = {}
): Promise<void> => {
  const baselines = test.info().annotations.filter((annotation) => annotation.type === "baseline");
  if (baselines.length !== 1 || !baselines[0].description) {
    throw new Error("Declare exactly one baseline with visualBaseline(name)");
  }
  await expect(page).toHaveScreenshot(baselines[0].description, options);
};

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

export const scrollThrough = async (page: Page): Promise<void> => {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = await page.evaluate(() => window.innerHeight * 0.8);
  for (let y = 0; y < height; y += step) {
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(60);
  }
  await page.evaluate(async () => {
    const rest = async () => {
      let last = Number.NaN;
      while (last !== window.scrollY) {
        last = window.scrollY;
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    };
    for (let attempt = 0; attempt < 10; attempt += 1) {
      await rest();
      if (window.scrollY === 0) return;
      window.scrollTo(0, 0);
    }
  });
  await page.waitForFunction(() => {
    const progress = document.querySelector<HTMLElement>('header [style*="--p"]');
    return (
      window.scrollY === 0 && (!progress || Number(progress.style.getPropertyValue("--p")) === 0)
    );
  });
  await page.waitForTimeout(200);
};

export interface AuditRoute {
  name: string;
  path: string;
  status?: number;
  family:
    | "home"
    | "portfolio"
    | "case-study"
    | "writing"
    | "article"
    | "open-source"
    | "engineering-principles"
    | "now"
    | "not-found";
}

export const CASE_STUDY_SLUGS = [
  "ledgerguard",
  "tallyfolio",
  "alwaysgeeky",
  "emplifi",
  "controltech",
  "agent-tooling",
  "mapbylaw",
] as const;

export const AUDIT_ARTICLE_SLUGS = [
  "agent-readiness-doctor",
  "agent-instructions-are-code",
  "why-i-automate-code-review-with-mcp",
  "mapbylaw-ai-recommendations",
] as const;

export const AUDIT_ROUTES: readonly AuditRoute[] = [
  { name: "home", path: "/", family: "home" },
  { name: "portfolio", path: "/portfolio", family: "portfolio" },
  ...CASE_STUDY_SLUGS.map((slug) => ({
    name: `case-${slug}`,
    path: `/portfolio/${slug}`,
    family: "case-study" as const,
  })),
  { name: "writing", path: "/writing", family: "writing" },
  ...AUDIT_ARTICLE_SLUGS.map((slug) => ({
    name: `post-${slug}`,
    path: `/writing/${slug}`,
    family: "article" as const,
  })),
  { name: "open-source", path: "/open-source", family: "open-source" },
  {
    name: "engineering-principles",
    path: "/engineering-principles",
    family: "engineering-principles",
  },
  { name: "now", path: "/now", family: "now" },
  { name: "not-found", path: "/this-page-does-not-exist", status: 404, family: "not-found" },
];

export const FAMILY_ROUTES: readonly AuditRoute[] = AUDIT_ROUTES.filter(
  (route, index) => AUDIT_ROUTES.findIndex((other) => other.family === route.family) === index
);

export interface AuditViewport {
  width: number;
  height: number;
  kind: "mobile" | "tablet" | "desktop";
}

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

export const horizontalOverflow = (page: Page): Promise<number> =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
