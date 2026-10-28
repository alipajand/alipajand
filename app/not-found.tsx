import type { Metadata } from "next";

import { NotFoundPageContent } from "features/not-found/NotFoundPageContent";
import { NOT_FOUND_DESCRIPTION, NOT_FOUND_TITLE } from "data/notFound";
import { SITE_NAME } from "data/site";

export const metadata: Metadata = {
  title: NOT_FOUND_TITLE,
  description: NOT_FOUND_DESCRIPTION,
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: NOT_FOUND_TITLE,
    description: NOT_FOUND_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: NOT_FOUND_TITLE,
    description: NOT_FOUND_DESCRIPTION,
  },
};

export default function NotFound() {
  return <NotFoundPageContent />;
}
