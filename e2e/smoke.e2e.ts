import { expect, test } from "@playwright/test";

import { stubVercelScripts } from "./evidence";
import { settle } from "./support";

const sitemapPaths = async (request: import("@playwright/test").APIRequestContext) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
};

test("the sitemap lists every page family", async ({ request }) => {
  const paths = await sitemapPaths(request);
  for (const expected of [
    "/",
    "/portfolio",
    "/portfolio/ledgerguard",
    "/writing",
    "/writing/agent-readiness-doctor",
    "/open-source",
    "/engineering-principles",
    "/now",
  ]) {
    expect(paths, expected).toContain(expected);
  }
});

test("every sitemap page renders one h1, a main landmark and no page errors", async ({
  page,
  request,
}) => {
  test.slow();
  const paths = await sitemapPaths(request);
  expect(paths.length).toBeGreaterThan(20);
  await stubVercelScripts(page);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`${page.url()}: ${error.message}`));
  const problems: string[] = [];
  for (const path of paths) {
    const response = await page.goto(path);
    if (response?.status() !== 200) problems.push(`${path} answered ${response?.status()}`);
    await settle(page);
    const h1 = await page.locator("h1").count();
    if (h1 !== 1) problems.push(`${path} has ${h1} h1 elements`);
    if ((await page.locator("main#main-content").count()) !== 1)
      problems.push(`${path} lacks main`);
    if (!(await page.title())) problems.push(`${path} has no title`);
  }
  expect(problems).toEqual([]);
  expect(errors).toEqual([]);
});

test("unknown pages answer 404 with the site's not-found page", async ({ page }) => {
  const response = await page.goto("/portfolio/not-a-case-study");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("navigation", { name: "Primary" }).first()).toBeVisible();
});

for (const path of [
  "/writing/not-a-post",
  "/writing/not-a-post/opengraph-image",
  "/portfolio/not-a-case-study",
  "/portfolio/not-a-case-study/opengraph-image",
]) {
  test(`${path} answers an uncached 404`, async ({ request }) => {
    const response = await request.get(path);
    expect(response.status()).toBe(404);
    expect(response.headers()["cache-control"]).toMatch(/no-store/);
  });
}

for (const { path, type } of [
  { path: "/sitemap.xml", type: /xml/ },
  { path: "/robots.txt", type: /text\/plain/ },
  { path: "/feed.xml", type: /xml/ },
  { path: "/llms.txt", type: /text\/plain/ },
  { path: "/llms-full.txt", type: /text\/plain/ },
  { path: "/manifest.json", type: /json/ },
  { path: "/opengraph-image", type: /image\/png/ },
  { path: "/icon", type: /image\/png/ },
  { path: "/apple-icon", type: /image\/png/ },
  { path: "/writing/agent-readiness-doctor/opengraph-image", type: /image\/png/ },
  { path: "/portfolio/opengraph-image", type: /image\/png/ },
  { path: "/portfolio/ledgerguard/opengraph-image", type: /image\/png/ },
]) {
  test(`${path} answers 200 as ${type.source}`, async ({ request }) => {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toMatch(type);
    expect((await response.body()).length).toBeGreaterThan(20);
  });
}
