import { render } from "@testing-library/react";

import { GalleryThumbnailFallback } from "components/SelectedWorkGallery/GalleryThumbnailFallback";

describe("GalleryThumbnailFallback", () => {
  it.each([
    ["ui", "storybook · component"],
    ["dashboard", ""],
    ["diagram", "Trigger"],
  ] as const)("renders type %s with data attribute and expected content", (type, snippet) => {
    const { container } = render(<GalleryThumbnailFallback type={type} />);

    const root = container.querySelector(`[data-gallery-fallback="${type}"]`);
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("aria-hidden");

    if (snippet) {
      expect(container.textContent).toContain(snippet);
    }
  });

  it("renders diagram fallback with an inline svg", () => {
    const { container } = render(<GalleryThumbnailFallback type="diagram" />);

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 400 200");
  });
});
