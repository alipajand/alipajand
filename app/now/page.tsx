import type { Metadata } from "next";

import { NowPageContent } from "features/now/NowPageContent";
import { buildNowMetadata } from "utils/metadata";

export const metadata: Metadata = buildNowMetadata();

export default function NowPage() {
  return <NowPageContent />;
}
