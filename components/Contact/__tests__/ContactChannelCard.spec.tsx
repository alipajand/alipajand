import { fireEvent, render, screen } from "@testing-library/react";

import { ContactChannelCard } from "components/Contact/ContactChannelCard";
import { trackContactLinkClick } from "components/Contact/trackContactLinkClick";

jest.mock("components/Contact/trackContactLinkClick", () => ({
  trackContactLinkClick: jest.fn(),
}));

describe("ContactChannelCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render an email channel with a mailto href and no target", () => {
    render(
      <ul>
        <ContactChannelCard
          channel={{
            label: "Email",
            value: "alipajand@gmail.com",
            href: "mailto:alipajand@gmail.com",
          }}
        />
      </ul>
    );

    const link = screen.getByRole("link", { name: /email/i });
    expect(link).toHaveAttribute("href", "mailto:alipajand@gmail.com");
    expect(link).not.toHaveAttribute("target");
    expect(screen.getByText("alipajand@gmail.com")).toBeInTheDocument();
  });

  it("should render an external channel with safe target and rel attributes", () => {
    render(
      <ul>
        <ContactChannelCard
          channel={{
            label: "LinkedIn",
            value: "linkedin.com/in/alipajand",
            href: "https://linkedin.com/in/alipajand",
          }}
        />
      </ul>
    );

    const link = screen.getByRole("link", { name: /linkedin/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAttribute(
      "aria-label",
      "LinkedIn: linkedin.com/in/alipajand (opens in new tab)"
    );
  });

  it("should track a click with the channel label", () => {
    render(
      <ul>
        <ContactChannelCard
          channel={{
            label: "GitHub",
            value: "github.com/alipajand",
            href: "https://github.com/alipajand",
          }}
        />
      </ul>
    );

    fireEvent.click(screen.getByRole("link", { name: /github/i }));
    expect(trackContactLinkClick).toHaveBeenCalledWith("GitHub");
  });
});
