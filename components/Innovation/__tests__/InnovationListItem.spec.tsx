import { render, screen } from "@testing-library/react";

import { InnovationListItem } from "components/Innovation/InnovationListItem";
import { INNOVATION_VIDEO_LINK_DEFAULT, type InnovationItem } from "data/innovation";

const baseItem: InnovationItem = {
  id: "test-item",
  title: "Test innovation",
  description: "A short description of the experiment.",
};

describe("InnovationListItem", () => {
  it("renders the title and description", () => {
    render(
      <ul>
        <InnovationListItem item={baseItem} />
      </ul>
    );
    expect(screen.getByRole("heading", { name: baseItem.title })).toBeInTheDocument();
    expect(screen.getByText(baseItem.description)).toBeInTheDocument();
  });

  it("renders a video link when videoUrl is set", () => {
    render(
      <ul>
        <InnovationListItem
          item={{
            ...baseItem,
            videoUrl: "https://example.com/demo",
            videoLabel: "Custom label",
          }}
        />
      </ul>
    );

    const link = screen.getByRole("link", { name: /custom label/i });
    expect(link).toHaveAttribute("href", "https://example.com/demo");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("falls back to the default video label when videoUrl is set without a label", () => {
    render(
      <ul>
        <InnovationListItem
          item={{
            ...baseItem,
            videoUrl: "https://example.com/demo",
          }}
        />
      </ul>
    );

    expect(screen.getByRole("link", { name: INNOVATION_VIDEO_LINK_DEFAULT })).toBeInTheDocument();
  });

  it("renders a muted label paragraph when videoLabel is set without a url", () => {
    render(
      <ul>
        <InnovationListItem
          item={{
            ...baseItem,
            videoLabel: "Demo coming soon",
          }}
        />
      </ul>
    );

    expect(screen.getByText("Demo coming soon")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
