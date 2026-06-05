/** @jest-environment node */

import { trackGtagEvent } from "utils/analytics";

describe("trackGtagEvent in node", () => {
  it("no-ops when window is undefined", () => {
    expect(() => trackGtagEvent("server_side_event", { foo: "bar" })).not.toThrow();
  });
});
