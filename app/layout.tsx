import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Education } from "components/Contact/Education";
import { CANONICAL_URL, KEYWORDS, META_DESCRIPTION, SITE_NAME, TITLE } from "data/site";
import React from "react";

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_URL),
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: META_DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: SITE_NAME, url: CANONICAL_URL }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: CANONICAL_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: META_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: META_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: CANONICAL_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} ${GeistSans.className} antialiased bg-background text-foreground`}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <footer className="px-6 sm:px-10 lg:px-20 border-t border-border py-8">
          <div className="max-w-3xl">
            <Education />
          </div>
        </footer>
      </body>
    </html>
  );
}
