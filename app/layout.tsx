import type { Metadata, Viewport } from "next";
import "./globals.css";
import {
  CANONICAL_URL,
  HOME_OPEN_GRAPH_DESCRIPTION,
  HOME_OPEN_GRAPH_TITLE,
  HOME_TITLE,
  SITE_META_DESCRIPTION,
  SITE_NAME,
  TAGLINE,
  TWITTER_HANDLE,
} from "data/site";
import { PropsWithChildren } from "react";
import { archivo, geistMono } from "./fonts";
import { SiteShell } from "components/hairline/SiteShell/SiteShell";
import { StructuredData } from "components/StructuredData/StructuredData";
import { GatedGoogleAnalytics } from "components/Analytics/GatedGoogleAnalytics";
import { GatedVercelAnalytics } from "components/Analytics/GatedVercelAnalytics";
import { GatedVercelSpeedInsights } from "components/Analytics/GatedVercelSpeedInsights";
import { RouteChangeFocus } from "components/RouteChangeFocus/RouteChangeFocus";
import { FEED_PATH } from "utils/feed";
import { LLMS_TXT_PATH } from "utils/llms";

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_URL),
  title: {
    default: HOME_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_META_DESCRIPTION,
  authors: [{ name: SITE_NAME, url: CANONICAL_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: CANONICAL_URL,
    siteName: SITE_NAME,
    title: HOME_OPEN_GRAPH_TITLE,
    description: HOME_OPEN_GRAPH_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} | ${TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_OPEN_GRAPH_TITLE,
    description: HOME_OPEN_GRAPH_DESCRIPTION,
    images: ["/opengraph-image"],
    ...(TWITTER_HANDLE ? { creator: `@${TWITTER_HANDLE}`, site: `@${TWITTER_HANDLE}` } : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0f0e",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={`${archivo.variable} ${geistMono.variable}`}>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE_NAME} — Writing`}
          href={`${CANONICAL_URL}${FEED_PATH}`}
        />
        <link
          rel="alternate"
          type="text/plain"
          title={`${SITE_NAME} — summary for language models`}
          href={`${CANONICAL_URL}${LLMS_TXT_PATH}`}
        />
      </head>
      <body>
        <GatedGoogleAnalytics />
        <GatedVercelAnalytics />
        <GatedVercelSpeedInsights />

        <StructuredData />
        <RouteChangeFocus />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
