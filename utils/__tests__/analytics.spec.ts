import { trackGtagEvent } from "utils/analytics";

describe("trackGtagEvent", () => {
  it("no-ops when gtag is missing", () => {
    expect(() => trackGtagEvent("test_event", { foo: "bar" })).not.toThrow();
  });

  it("calls gtag when present", () => {
    const gtag = jest.fn();
    (window as unknown as { gtag: typeof gtag }).gtag = gtag;
    trackGtagEvent("contact_link_click", { link_label: "Email" });
    expect(gtag).toHaveBeenCalledWith("event", "contact_link_click", { link_label: "Email" });
    Reflect.deleteProperty(window as unknown as object, "gtag");
  });
});
