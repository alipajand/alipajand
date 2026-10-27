/** @jest-environment node */

import { getFromEmail, isValidEmail } from "utils/resend";

describe("isValidEmail", () => {
  it.each(["ada@example.com", "first.last+tag@example.co.uk", "o'brien@example.ie"])(
    "accepts %s",
    (value) => {
      expect(isValidEmail(value)).toBe(true);
    }
  );

  it.each([
    "",
    "no-at.example.com",
    "a@b@c.com",
    "a@nodot",
    "a b@example.com",
    '"x",other@example.com',
    "a@b.co,c@d.co",
    "a@b.co;c@d.co",
    "Name <a@b.co>",
    "a(comment)@b.co",
    "a\\b@c.co",
    `${"a".repeat(250)}@b.co`,
  ])("rejects %j", (value) => {
    expect(isValidEmail(value)).toBe(false);
  });
});

describe("getFromEmail", () => {
  const original = process.env.RESEND_FROM;
  afterEach(() => {
    if (original === undefined) delete process.env.RESEND_FROM;
    else process.env.RESEND_FROM = original;
  });

  it("keeps a display-name sender on a verified domain unchanged", () => {
    process.env.RESEND_FROM = "Ali Pajand <hello@alipajand.com>";
    expect(getFromEmail()).toBe("Ali Pajand <hello@alipajand.com>");
  });

  it("keeps a bare sender on a verified domain unchanged", () => {
    process.env.RESEND_FROM = "hello@alipajand.com";
    expect(getFromEmail()).toBe("hello@alipajand.com");
  });

  it("falls back to the Resend onboarding sender when unset", () => {
    delete process.env.RESEND_FROM;
    expect(getFromEmail()).toBe("onboarding@resend.dev");
  });
});
