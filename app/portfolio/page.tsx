import type { Metadata } from "next";

import { PortfolioPageContent } from "features/portfolio/PortfolioPageContent";
import { buildPortfolioMetadata } from "utils/metadata";

export const metadata: Metadata = buildPortfolioMetadata();

export default function PortfolioPage() {
  return <PortfolioPageContent />;
}
