import { expect, test } from "@playwright/test";

const OUT = "docs/audits/evidence/contact-validation";
const SIZES = [
  { label: "1440x900", viewport: { width: 1440, height: 900 }, isMobile: false },
  { label: "390x844-emulated", viewport: { width: 390, height: 844 }, isMobile: true },
];

test.use({ reducedMotion: "reduce" });

for (const size of SIZES) {
  test(`count and error states at ${size.label}`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: size.viewport,
      isMobile: size.isMobile,
      hasTouch: size.isMobile,
      deviceScaleFactor: 2,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    let requests = 0;
    await page.route("**/api/contact", (route) => {
      requests += 1;
      return route.abort();
    });
    await page.goto("/");
    const form = page.locator("#contact-form");
    await form.scrollIntoViewIfNeeded();

    await page.locator("#contact-name").fill("Jane Doe");
    await page.locator("#contact-email").fill("jane@example.com");
    await page.locator("#contact-company").fill("Example Co");
    await page
      .locator("#contact-message")
      .fill(
        "Senior frontend role on a design-systems team, remote within Canada. React, TypeScript and Node.js; the main problem is keeping a large component library accessible and fast."
      );
    await expect(page.locator("#contact-message-count")).toContainText("including company");
    await form.screenshot({ path: `${OUT}/count-${size.label}.png` });

    await page.locator("#contact-company").fill("");
    await page.locator("#contact-name").fill("N".repeat(201));
    await page.locator("#contact-message").fill("Long message. ".repeat(715));
    await page.locator("#contact-message").blur();
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.locator("#contact-message-count")).toHaveAttribute("data-over", "");
    await expect(page.locator("#contact-message-error")).toBeVisible();
    await page.locator("#contact-message").evaluate((el) => (el.scrollTop = 0));
    await form.screenshot({ path: `${OUT}/error-${size.label}.png` });
    expect(requests).toBe(0);
    await context.close();
  });
}

test("real submit through to the server and the mocked provider", async ({ page }) => {
  let contentType: string | null = null;
  let bytes = 0;
  await page.route("**/api/contact", async (route) => {
    contentType = await route.request().headerValue("content-type");
    bytes = route.request().postDataBuffer()?.byteLength ?? 0;
    await route.continue();
  });
  await page.goto("/");
  await page.locator("#contact-name").fill("Evidence Name Zeta");
  await page.locator("#contact-email").fill("evidence.zeta@example.test");
  await page.locator("#contact-company").fill("Evidence Company Zeta");
  await page.locator("#contact-message").fill("Evidence message body zeta");
  const response = page.waitForResponse("**/api/contact");
  await page.getByRole("button", { name: /send message/i }).click();
  const res = await response;
  console.log("passthrough", res.status(), contentType, bytes, await res.text());
  await expect(page.locator("#contact-form [role=status], #contact-form [role=alert]").last()).not.toBeEmpty();
  console.log("ui", await page.locator("#contact-form .\\_status, #contact-form p[role]").allTextContents());
});
