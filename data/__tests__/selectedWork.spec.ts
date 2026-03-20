import type { SelectedWorkItem } from "data/selectedWork";
import { getSelectedWorkItemsWithImages } from "data/selectedWork";

describe("getSelectedWorkItemsWithImages", () => {
  it("returns only items with a non-empty imageSrc", () => {
    const items: SelectedWorkItem[] = [
      {
        id: "a",
        type: "ui",
        title: "With image",
        caption: "c",
        imageSrc: "/a.png",
      },
      {
        id: "b",
        type: "ui",
        title: "No image",
        caption: "c",
      },
      {
        id: "c",
        type: "ui",
        title: "Whitespace",
        caption: "c",
        imageSrc: "   ",
      },
    ];

    const visible = getSelectedWorkItemsWithImages(items);
    expect(visible).toHaveLength(1);
    expect(visible[0]?.id).toBe("a");
  });
});
