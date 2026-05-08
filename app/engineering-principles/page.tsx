import type { Metadata } from "next";

import { EngineeringPrinciplesPageContent } from "features/engineering-principles/EngineeringPrinciplesPageContent";
import { buildEngineeringPrinciplesMetadata } from "utils/metadata";

export const metadata: Metadata = buildEngineeringPrinciplesMetadata();

export default function EngineeringPrinciplesPage() {
  return <EngineeringPrinciplesPageContent />;
}
