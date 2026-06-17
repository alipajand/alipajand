import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import {
  CANONICAL_URL,
  HOME_TITLE,
  SITE_META_DESCRIPTION,
  SITE_NAME,
  TAGLINE,
  TWITTER_HANDLE,
} from "data/site";
import { PropsWithChildren } from "react";
import { Footer } from "components/Footer/Footer";
import { FOOTER_LATEST_WRITINGS_COUNT } from "data/footer";
import { getLatestPosts } from "utils/posts";
import { Nav } from "components/Nav/Nav";
import { SmoothScroll } from "components/SmoothScroll/SmoothScroll";
import { SKIP_TO_CONTENT_LABEL } from "data/pageChrome";
import { StructuredData } from "components/StructuredData/StructuredData";
import { GatedGoogleAnalytics } from "components/Analytics/GatedGoogleAnalytics";
import { GatedVercelAnalytics } from "components/Analytics/GatedVercelAnalytics";
import { GatedVercelSpeedInsights } from "components/Analytics/GatedVercelSpeedInsights";
import { RouteChangeFocus } from "components/RouteChangeFocus/RouteChangeFocus";
import { SkipLink } from "components/SkipLink/SkipLink";

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
    title: HOME_TITLE,
    description: SITE_META_DESCRIPTION,
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
    title: HOME_TITLE,
    description: SITE_META_DESCRIPTION,
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
  alternates: {
    canonical: CANONICAL_URL,
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
  other: {
    "theme-color": "#000000",
    "color-scheme": "dark",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#000000",
};

export default function RootLayout({ children }: PropsWithChildren) {
  const latestWritings = getLatestPosts(FOOTER_LATEST_WRITINGS_COUNT);

  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js")`,
          }}
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistSans.className} antialiased bg-background text-foreground`}
      >
        <GatedGoogleAnalytics />
        <GatedVercelAnalytics />
        <GatedVercelSpeedInsights />

        <SkipLink href="#main-content" label={SKIP_TO_CONTENT_LABEL} />

        <StructuredData />
        <SmoothScroll>
          <RouteChangeFocus />
          <Nav />
          {children}
          <Footer latestWritings={latestWritings} />
        </SmoothScroll>
      </body>
    </html>
  );
}
