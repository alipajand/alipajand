/** @jest-environment node */

jest.mock("data/site", () => ({
  ...jest.requireActual("data/site"),
  TWITTER_HANDLE: "alipajand",
}));

import { buildWritingIndexMetadata } from "utils/metadata";

describe("utils/metadata twitter extras", () => {
  it("adds creator and site handles when TWITTER_HANDLE is set", () => {
    const m = buildWritingIndexMetadata();
    const twitter = m.twitter as { creator?: string; site?: string };
    expect(twitter.creator).toBe("@alipajand");
    expect(twitter.site).toBe("@alipajand");
  });
});
