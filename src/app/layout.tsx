import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SEOJsonLD } from "./SEOJsonLD";

/* -------------------------------
   Fonts setup
   These define CSS variables that can be used globally
   Change these for client branding
---------------------------------*/
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* -------------------------------
   Metadata setup
   Update for each client:
   - title: browser tab
   - description: SEO & social previews
---------------------------------*/
export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL,
  title: "Webdirect",
  description:
    "Short and compelling description of the client project for search engines.",
  keywords: ["primary keyword", "secondary keyword", "client niche"],
  authors: [{ name: "Client Name" }],
  openGraph: {
    title: "Webdirect",
    description: "Short and compelling description for social previews",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Client Website",
    images: [
      {
        url: "/images/seo-preview.png",
        width: 1200,
        height: 630,
        alt: "CLIENT PROJECT NAME preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webdirect | Websites die gemaakt zijn om te",
    description: "Short description for Twitter card",
    images: ["/images/seo-preview.png"],
    creator: "@webdirect",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

/* -------------------------------
   RootLayout component
   Wraps the entire app.
   - children: renders all pages/components
   - className: global fonts and antialiasing
   - lang="en": change for client language
---------------------------------*/
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ✅ FIX: Make sure <html> has only <body> as direct child (no newlines/whitespace)
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SEOJsonLD />
        {children}
        <Script
          src="https://cdn.feedbucket.app/assets/feedbucket.js"
          data-feedbucket="sqMqNVirqR6juWiSLFBg"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
