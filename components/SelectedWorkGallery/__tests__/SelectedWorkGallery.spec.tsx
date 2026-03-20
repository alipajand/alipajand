import { render, screen } from "@testing-library/react";

import { SelectedWorkGallery } from "components/SelectedWorkGallery/SelectedWorkGallery";
import { SELECTED_WORK_ITEMS } from "data/selectedWork";

describe("SelectedWorkGallery", () => {
  it("renders section, heading, description, and one card per configured item", () => {
    render(<SelectedWorkGallery />);

    const section = screen.getByRole("region", { name: /selected work/i });
    expect(section).toBeInTheDocument();

    expect(screen.getByText(/Quick visual read/i)).toBeInTheDocument();

    const list = screen.getByRole("list");
    const items = screen.getAllByRole("listitem");
    expect(list).toBeInTheDocument();
    expect(items).toHaveLength(SELECTED_WORK_ITEMS.length);
  });
});

