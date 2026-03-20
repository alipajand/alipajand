import { render, screen } from "@testing-library/react";
import { GalleryCard } from "components/SelectedWorkGallery/GalleryCard";
import type { SelectedWorkItem } from "data/selectedWork";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
    const { fill: _fill, ...imgProps } = props;
    return <img src={src} alt={alt} {...imgProps} />;
  },
}));

const mockItem: SelectedWorkItem = {
  id: "test-item",
  type: "ui",
  title: "Test Title",
  caption: "Test Caption",
};

describe("GalleryCard", () => {
  describe("basic rendering", () => {
    it("should render title", () => {
      render(<GalleryCard item={mockItem} />);
      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("should render caption", () => {
      render(<GalleryCard item={mockItem} />);
      expect(screen.getByText("Test Caption")).toBeInTheDocument();
    });

    it("should have data-selected-work-card attribute", () => {
      const { container } = render(<GalleryCard item={mockItem} />);
      expect(container.querySelector("[data-selected-work-card]")).toBeInTheDocument();
    });
  });

  describe("image rendering", () => {
    it("should render image when imageSrc is provided", () => {
      const itemWithImage: SelectedWorkItem = {
        ...mockItem,
        imageSrc: "/test-image.jpg",
      };

      const { container } = render(<GalleryCard item={itemWithImage} />);
      const image = container.querySelector("img");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "/test-image.jpg");
      expect(image).toHaveAttribute("alt", "Test Title — sample");
    });

    it("should render blur overlay when blurData is true and image exists", () => {
      const itemWithBlur: SelectedWorkItem = {
        ...mockItem,
        imageSrc: "/test-image.jpg",
        blurData: true,
      };

      render(<GalleryCard item={itemWithBlur} />);
      expect(screen.getByText("Data blurred")).toBeInTheDocument();
    });

    it("should not render blur overlay when blurData is false", () => {
      const itemWithoutBlur: SelectedWorkItem = {
        ...mockItem,
        imageSrc: "/test-image.jpg",
        blurData: false,
      };

      render(<GalleryCard item={itemWithoutBlur} />);
      expect(screen.queryByText("Data blurred")).not.toBeInTheDocument();
    });

    it("should not render blur overlay when imageSrc is not provided", () => {
      const itemWithoutImage: SelectedWorkItem = {
        ...mockItem,
        blurData: true,
      };

      render(<GalleryCard item={itemWithoutImage} />);
      expect(screen.queryByText("Data blurred")).not.toBeInTheDocument();
    });

    it("should render illustrative fallback when imageSrc is not provided", () => {
      const { container } = render(<GalleryCard item={mockItem} />);
      expect(container.querySelector('[data-gallery-fallback="ui"]')).toBeInTheDocument();
      expect(screen.getByText(/illustrative · not a live screenshot/i)).toBeInTheDocument();
    });

    it("should render illustrative fallback when imageSrc is empty string", () => {
      const itemWithEmptyImage: SelectedWorkItem = {
        ...mockItem,
        imageSrc: "",
      };

      const { container } = render(<GalleryCard item={itemWithEmptyImage} />);
      expect(container.querySelector('[data-gallery-fallback="ui"]')).toBeInTheDocument();
    });

    it("should render illustrative fallback when imageSrc is whitespace only", () => {
      const itemWithWhitespaceImage: SelectedWorkItem = {
        ...mockItem,
        imageSrc: "   ",
      };

      const { container } = render(<GalleryCard item={itemWithWhitespaceImage} />);
      expect(container.querySelector('[data-gallery-fallback="ui"]')).toBeInTheDocument();
    });

    it("should not render illustrative fallback when imageSrc is provided", () => {
      const itemWithImage: SelectedWorkItem = {
        ...mockItem,
        imageSrc: "/test-image.jpg",
      };

      const { container } = render(<GalleryCard item={itemWithImage} />);
      expect(container.querySelector("[data-gallery-fallback]")).not.toBeInTheDocument();
    });
  });

  describe("blur overlay", () => {
    it("should have aria-hidden on blur overlay", () => {
      const itemWithBlur: SelectedWorkItem = {
        ...mockItem,
        imageSrc: "/test-image.jpg",
        blurData: true,
      };

      const { container } = render(<GalleryCard item={itemWithBlur} />);
      const blurOverlay = container.querySelector('[aria-hidden="true"]');
      expect(blurOverlay).toBeInTheDocument();
    });

    it("should have correct classes on blur overlay", () => {
      const itemWithBlur: SelectedWorkItem = {
        ...mockItem,
        imageSrc: "/test-image.jpg",
        blurData: true,
      };

      const { container } = render(<GalleryCard item={itemWithBlur} />);
      const blurOverlay = container.querySelector('[aria-hidden="true"]');
      expect(blurOverlay).toHaveClass("absolute", "inset-0");
    });
  });
});
