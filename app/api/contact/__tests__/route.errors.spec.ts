/** @jest-environment node */

const send = jest.fn();
let configured = true;

jest.mock("utils/resend", () => ({
  ...jest.requireActual("utils/resend"),
  getResend: () => (configured ? { emails: { send } } : null),
  getFromEmail: () => "onboarding@resend.dev",
  getToEmail: () => "inbox@example.com",
}));

import { POST } from "../route";

function post() {
  return POST(
    new Request("https://alipajand.com/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Ada", email: "ada@example.com", message: "Hello" }),
    })
  );
}

describe("POST /api/contact provider errors", () => {
  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    configured = true;
    consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it.each([
    ["an account or quota message", "Internal detail: account team_1234 quota exceeded"],
    ["a sender setup message", "You can only send testing emails to your own email address"],
    ["a domain verification message", "The alipajand.com domain is not verified"],
  ])("should not show %s to the visitor", async (_label, providerMessage) => {
    send.mockResolvedValue({
      data: null,
      error: { name: "validation_error", message: providerMessage },
    });

    const res = await post();

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to send message" });
  });

  it("should log the provider error code and status for the owner", async () => {
    send.mockResolvedValue({
      data: null,
      error: { name: "rate_limit_exceeded", message: "Too many requests", statusCode: 429 },
    });

    await post();

    expect(consoleError).toHaveBeenCalledWith("Contact email send failed", {
      name: "rate_limit_exceeded",
      statusCode: 429,
    });
  });

  it("should keep the provider message, addresses and the visitor's text out of the log", async () => {
    send.mockResolvedValue({
      data: null,
      error: {
        name: "validation_error",
        message: "Invalid `reply_to`: ada@example.com. Sending to inbox@example.com failed.",
        statusCode: 422,
      },
    });

    await post();

    const logged = JSON.stringify(consoleError.mock.calls);
    expect(logged).not.toContain("ada@example.com");
    expect(logged).not.toContain("inbox@example.com");
    expect(logged).not.toContain("Hello");
    expect(logged).not.toContain("Invalid");
  });

  it("should still report success when the provider accepts the email", async () => {
    send.mockResolvedValue({ data: { id: "sent-1" }, error: null });
    const res = await post();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("should keep the 503 when the email service is not configured", async () => {
    configured = false;
    const res = await post();
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "Email service is not configured" });
  });
});
