import { expect, type Request as PlaywrightRequest, test } from "@playwright/test";

import { horizontalOverflow, PAGES, scrollThrough, settle, VIEWPORTS } from "./support";

const collectConsoleProblems = (page: import("@playwright/test").Page) => {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") problems.push(message.text());
  });
  page.on("pageerror", (error) => problems.push(error.message));
  return problems;
};

for (const { name, path } of PAGES) {
  test.describe(name, () => {
    test("renders without console errors or hydration warnings", async ({ page }) => {
      await page.route("**/_vercel/**", (route) =>
        route.fulfill({ status: 200, contentType: "text/javascript", body: "" })
      );
      const problems = collectConsoleProblems(page);
      await page.goto(path);
      await settle(page);
      await scrollThrough(page);
      expect(problems).toEqual([]);
    });

    test("has exactly one h1 and a labelled main landmark", async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main#main-content")).toHaveCount(1);
      await expect(page.getByRole("navigation", { name: "Primary" }).first()).toBeVisible();
    });

    for (const viewport of VIEWPORTS) {
      test(`never scrolls sideways at ${viewport.width}px`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(path);
        await settle(page);
        expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
      });
    }

    test("keeps cumulative layout shift under 0.05 through a full scroll", async ({ page }) => {
      await page.addInitScript(() => {
        (window as unknown as { __cls: number }).__cls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as unknown as Array<{
            value: number;
            hadRecentInput: boolean;
          }>) {
            if (!entry.hadRecentInput)
              (window as unknown as { __cls: number }).__cls += entry.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
      });
      await page.goto(path);
      await settle(page);
      await scrollThrough(page);
      const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
      expect(cls).toBeLessThan(0.05);
    });

    test("goes idle once scrolling stops (no unconditional animation loop)", async ({ page }) => {
      await page.addInitScript(() => {
        const original = window.requestAnimationFrame.bind(window);
        (window as unknown as { __frames: number }).__frames = 0;
        window.requestAnimationFrame = (callback) => {
          (window as unknown as { __frames: number }).__frames += 1;
          return original(callback);
        };
      });
      await page.goto(path);
      await settle(page);
      await scrollThrough(page);
      await page.waitForTimeout(1500);
      const before = await page.evaluate(
        () => (window as unknown as { __frames: number }).__frames
      );
      await page.waitForTimeout(1000);
      const after = await page.evaluate(() => (window as unknown as { __frames: number }).__frames);
      expect(after - before).toBe(0);
    });

    test("leaves scroll-driven motion at rest under reduced motion", async ({ browser }) => {
      const context = await browser.newContext({ reducedMotion: "reduce" });
      const page = await context.newPage();
      await page.goto(path);
      await settle(page);
      await page.mouse.wheel(0, 900);
      await page.waitForTimeout(400);
      const transforms = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLElement>("[data-word]")).map(
          (word) => word.style.transform
        )
      );
      expect(transforms.every((value) => value === "")).toBe(true);
      await context.close();
    });

    test("keeps content, navigation and the contact route usable without JavaScript", async ({
      browser,
    }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("#case-studies")).toBeVisible();
      await expect(page.locator("#contact")).toBeVisible();
      const primary = page.getByRole("navigation", { name: "Primary" }).first();
      await expect(primary.getByRole("link")).toHaveCount(5);
      await context.close();
    });

    test("shows the primary links on a phone without JavaScript", async ({ browser }) => {
      const context = await browser.newContext({
        javaScriptEnabled: false,
        viewport: { width: 390, height: 844 },
      });
      const page = await context.newPage();
      await page.goto(path);
      await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();
      const primary = page.getByRole("navigation", { name: "Primary" }).first();
      for (const link of await primary.getByRole("link").all()) await expect(link).toBeVisible();
      expect(await horizontalOverflow(page)).toBe(0);
      await context.close();
    });

    test("links only to pages and anchors that exist", async ({ page, request }) => {
      await page.goto(path);
      const hrefs = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]")).map(
          (a) => a.getAttribute("href") ?? ""
        )
      );
      const internal = [...new Set(hrefs.filter((href) => href.startsWith("/")))];
      for (const href of internal) {
        const [pathname, hash] = href.split("#");
        const response = await request.get(pathname || path);
        expect(response.status(), href).toBeLessThan(400);
        if (hash) expect(await response.text(), `${href} anchor`).toContain(`id="${hash}"`);
      }
      const anchors = hrefs.filter((href) => href.startsWith("#") && href.length > 1);
      for (const anchor of new Set(anchors)) {
        await expect(page.locator(anchor), anchor).toHaveCount(1);
      }
    });
  });
}

test.describe("site menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens from the keyboard, closes on Escape and returns focus", async ({ page }) => {
    await page.goto("/portfolio");
    await settle(page);
    const button = page.getByRole("button", { name: "Open menu" });
    await button.focus();
    await page.keyboard.press("Enter");
    const panel = page.locator("#site-menu");
    await expect(panel).toBeVisible();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    await page.keyboard.press("Tab");
    await expect(panel.getByRole("link").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  });

  test("moves focus to the main content after linking to the open page", async ({
    browser,
    playwright,
    baseURL,
  }) => {
    const webkit = await playwright.webkit.launch();
    try {
      for (const [name, engine] of [
        ["chromium", browser],
        ["webkit", webkit],
      ] as const) {
        const context = await engine.newContext({ baseURL, viewport: { width: 390, height: 844 } });
        const page = await context.newPage();
        await page.goto("/portfolio");
        await settle(page);
        await page.getByRole("button", { name: "Open menu" }).focus();
        await page.keyboard.press("Enter", { delay: 50 });
        const panel = page.locator("#site-menu");
        await panel.getByRole("link", { name: "Portfolio" }).focus();
        await page.keyboard.press("Enter", { delay: 50 });
        await expect(panel).toBeHidden();
        await expect(page.locator("#main-content"), name).toBeFocused();
        await page.keyboard.press(name === "webkit" ? "Alt+Tab" : "Tab", { delay: 50 });
        const inMain = await page.evaluate(() =>
          document.getElementById("main-content")!.contains(document.activeElement)
        );
        expect(inMain, `${name}: the next Tab continues in the main content`).toBe(true);
        await context.close();
      }
    } finally {
      await webkit.close();
    }
  });
});

test.describe("shell tap areas", () => {
  const tapsAt44 = (locator: import("@playwright/test").Locator) =>
    locator.evaluate((element) => {
      element.scrollIntoView({ block: "center" });
      const rect = element.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      return [-21, 0, 21].every((dy) => {
        const hit = document.elementFromPoint(x, y + dy);
        return Boolean(hit && (hit === element || element.contains(hit)));
      });
    });

  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 768, height: 1024 },
  ]) {
    test(`gives each header link a 44px-tall tap area at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await settle(page);
      const links = page.getByRole("navigation", { name: "Primary" }).first().getByRole("link");
      for (const link of await links.all())
        expect(await tapsAt44(link), await link.innerText()).toBe(true);
    });
  }

  test("gives the footer motion control a 44px-tall tap area", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await settle(page);
    expect(await tapsAt44(page.getByRole("button", { name: "Pause automatic motion" }))).toBe(true);
  });
});

test.describe("contact form", () => {
  test("posts the same payload to /api/contact and announces success", async ({ page }) => {
    let payload: unknown = null;
    await page.route("**/api/contact", async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });
    await page.goto("/");
    await page.locator("#contact-name").fill("Jane Doe");
    await page.locator("#contact-email").fill("jane@example.com");
    await page.locator("#contact-company").fill("Example Co");
    await page.locator("#contact-message").fill("Hello there");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByRole("status")).not.toBeEmpty();
    expect(payload).toEqual({
      name: "Jane Doe",
      email: "jane@example.com",
      message: expect.stringContaining("Hello there"),
    });
  });

  test("links each validation error to its field", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /send message/i }).click();
    const summaryLink = page.getByRole("link", { name: "Enter your name" });
    await expect(summaryLink).toBeVisible();
    await summaryLink.click();
    await expect(page.locator("#contact-name")).toBeFocused();
  });

  test("sends a JSON request under the API's size cap, then shows sending and success", async ({
    page,
  }) => {
    let release: () => void = () => {};
    const held = new Promise<void>((resolve) => (release = resolve));
    const captured: PlaywrightRequest[] = [];
    await page.route("**/api/contact", async (route) => {
      captured.push(route.request());
      await held;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: '{"success":true}',
      });
    });
    await page.goto("/");
    await page.locator("#contact-name").fill("Jane Doe");
    await page.locator("#contact-email").fill("jane@example.com");
    await page.locator("#contact-company").fill("Example Co");
    await page.locator("#contact-message").fill("\u{1F600}".repeat(4_990));
    const count = page.locator("#contact-message-count");
    await expect(count).toHaveText("10,001 / 10,000 characters, including company");

    await page.locator("#contact-message").blur();
    await expect(
      page.getByRole("link", {
        name: "Keep your message and company to 10,000 characters combined",
      })
    ).toBeVisible();
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.locator("#contact-message-error")).toBeVisible();
    expect(captured).toHaveLength(0);

    await page.locator("#contact-message").fill("\u{1F600}".repeat(4_989) + "x");
    await expect(count).toHaveText("10,000 / 10,000 characters, including company");
    await expect(page.locator("#contact-message-error")).toHaveCount(0);
    await page.getByRole("button", { name: /send message/i }).click();

    await expect(page.getByRole("button", { name: /sending/i })).toBeDisabled();
    await expect(page.locator("#contact-form")).toHaveAttribute("aria-busy", "true");
    await expect.poll(() => captured.length).toBe(1);
    const [request] = captured;
    expect(request.method()).toBe("POST");
    expect(await request.headerValue("content-type")).toBe("application/json");
    expect(request.postDataBuffer()?.byteLength ?? Infinity).toBeLessThan(64 * 1024);
    expect(request.postDataJSON()).toEqual({
      name: "Jane Doe",
      email: "jane@example.com",
      message: `Company: Example Co\n\n${"\u{1F600}".repeat(4_989)}x`,
    });

    release();
    await expect(page.getByRole("status")).toHaveText("Message sent. Thanks for reaching out.");
    await expect(page.locator("#contact-message")).toHaveValue("");
    await expect(count).toHaveText("0 / 10,000 characters");
  });

  test("blocks over-limit fields in the browser and sends nothing", async ({ page }) => {
    let requests = 0;
    await page.route("**/api/contact", (route) => {
      requests += 1;
      return route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });
    await page.goto("/");
    await page.locator("#contact-name").fill("N".repeat(201));
    await page.locator("#contact-email").fill("jane@example.com");
    await page.locator("#contact-message").fill("M".repeat(10_001));
    const count = page.locator("#contact-message-count");
    await expect(count).toHaveText("10,001 / 10,000 characters");
    await expect(count).toHaveAttribute("data-over", "");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(
      page.getByRole("link", { name: "Keep your name to 200 characters or fewer" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Keep your message to 10,000 characters or fewer" })
    ).toBeVisible();
    await expect(page.locator("#contact-message")).toHaveAttribute(
      "aria-describedby",
      "contact-message-hint contact-message-count contact-message-error"
    );
    expect(requests).toBe(0);
  });

  test("keeps the fields out of the URL when submitted without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    const urls: string[] = [];
    const posts: Array<{ url: string; status: number }> = [];
    page.on("request", (request) => {
      if (request.isNavigationRequest()) urls.push(request.url());
    });
    page.on("response", (response) => {
      if (response.request().method() === "POST") {
        posts.push({ url: response.url(), status: response.status() });
      }
    });
    await page.goto("/");
    await page.locator("#contact-name").fill("NoScriptName");
    await page.locator("#contact-email").fill("noscript@example.com");
    await page.locator("#contact-company").fill("NoScriptCompany");
    await page.locator("#contact-message").fill("NoScriptMessage");
    await Promise.all([
      page.waitForURL("**/#contact"),
      page.getByRole("button", { name: /send message/i }).click(),
    ]);

    expect(posts).toEqual([{ url: expect.stringMatching(/\/$/), status: 200 }]);
    await expect(page.locator("#contact-form")).toBeVisible();
    await expect(page.getByText("NoScriptMessage")).toHaveCount(0);
    for (const url of [...urls, page.url()]) {
      expect(url).not.toMatch(/NoScript|noscript%40|noscript@/i);
      expect(url).not.toContain("?");
    }
    await context.close();
  });

  test("shows the generic message when the server answers 400", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: '{"error":"Message is too long"}',
      })
    );
    await page.goto("/");
    await page.locator("#contact-name").fill("Jane Doe");
    await page.locator("#contact-email").fill("jane@example.com");
    await page.locator("#contact-message").fill("Hello there");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByText("Something went wrong. Please try again.")).toBeVisible();
    await expect(page.getByText("Message is too long")).toHaveCount(0);
  });
});
