import type { Metadata } from "next";

import { OpenSourcePageContent } from "features/open-source/OpenSourcePageContent";
import { buildOpenSourceMetadata } from "utils/metadata";

export const metadata: Metadata = buildOpenSourceMetadata();

export default function OpenSourcePage() {
  return <OpenSourcePageContent />;
}
