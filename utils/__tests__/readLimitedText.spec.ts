/** @jest-environment node */

import { readLimitedText } from "utils/readLimitedText";

const post = (body?: BodyInit, headers?: Record<string, string>) =>
  new Request("https://example.com/", { method: "POST", body, headers });

describe("readLimitedText", () => {
  it("returns the decoded body when it fits", async () => {
    await expect(readLimitedText(post("héllo"), 16)).resolves.toBe("héllo");
  });

  it("returns an empty string when there is no body", async () => {
    await expect(
      readLimitedText(new Request("https://example.com/", { method: "POST" }), 16)
    ).resolves.toBe("");
  });

  it("returns null when the declared length is over the limit", async () => {
    await expect(readLimitedText(post("x", { "content-length": "100" }), 16)).resolves.toBeNull();
  });

  it("returns null when the streamed body grows past the limit", async () => {
    await expect(readLimitedText(post(new Blob(["x".repeat(17)])), 16)).resolves.toBeNull();
  });

  it("counts bytes, not characters", async () => {
    await expect(readLimitedText(post("é".repeat(9)), 16)).resolves.toBeNull();
  });
});
