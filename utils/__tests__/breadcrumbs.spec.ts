/** @jest-environment node */

import {
  engineeringPrinciplesBreadcrumbs,
  notFoundBreadcrumbs,
  nowBreadcrumbs,
  openSourceBreadcrumbs,
  portfolioIndexBreadcrumbs,
  writingIndexBreadcrumbs,
} from "data/breadcrumbs";
import { CANONICAL_URL } from "data/site";
import { toBreadcrumbJsonLdItems } from "utils/breadcrumbs";

describe("utils/breadcrumbs", () => {
  it("should map breadcrumb items to absolute JSON-LD urls", () => {
    const items = toBreadcrumbJsonLdItems(
      portfolioIndexBreadcrumbs(),
      `${CANONICAL_URL}/portfolio`
    );

    expect(items).toEqual([
      { name: "Home", url: CANONICAL_URL },
      { name: "Case studies", url: `${CANONICAL_URL}/portfolio` },
    ]);
  });

  it("should expose breadcrumb builders for each non-home page", () => {
    expect(writingIndexBreadcrumbs()).toHaveLength(2);
    expect(engineeringPrinciplesBreadcrumbs()).toHaveLength(2);
    expect(nowBreadcrumbs()).toHaveLength(2);
    expect(openSourceBreadcrumbs()).toHaveLength(2);
    expect(notFoundBreadcrumbs()).toHaveLength(2);
  });
});
