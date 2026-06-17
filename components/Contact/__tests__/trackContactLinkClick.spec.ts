import { trackContactLinkClick } from "components/Contact/trackContactLinkClick";
import { trackGtagEvent } from "utils/analytics";

jest.mock("utils/analytics", () => ({
  trackGtagEvent: jest.fn(),
}));

describe("trackContactLinkClick", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should forward the channel label to the analytics helper", () => {
    trackContactLinkClick("LinkedIn");
    expect(trackGtagEvent).toHaveBeenCalledWith("contact_link_click", {
      link_label: "LinkedIn",
    });
  });
});
