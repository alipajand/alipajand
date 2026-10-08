import type { Metadata } from "next";

import { NotFoundPageContent } from "features/not-found/NotFoundPageContent";
import { NOT_FOUND_DESCRIPTION, NOT_FOUND_TITLE } from "data/notFound";

export const metadata: Metadata = {
  title: NOT_FOUND_TITLE,
  description: NOT_FOUND_DESCRIPTION,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundPageContent />;
}
