import type { Metadata } from "next";

import { NotFoundPageContent } from "features/not-found/NotFoundPageContent";
import { NOT_FOUND_DESCRIPTION, NOT_FOUND_TITLE } from "data/notFound";
import { SITE_NAME } from "data/site";

export const metadata: Metadata = {
  title: NOT_FOUND_TITLE,
  description: NOT_FOUND_DESCRIPTION,
  robots: { index: false, follow: true },
  // Its own Open Graph block, without a URL, so a missing page never claims the homepage's og:url.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: NOT_FOUND_TITLE,
    description: NOT_FOUND_DESCRIPTION,
    locale: "en_US",
  },
};

export default function NotFound() {
  return <NotFoundPageContent />;
}
