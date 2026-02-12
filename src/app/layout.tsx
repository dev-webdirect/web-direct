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
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.webdirect.nl";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WebDirect | Webdesign Bureau Nederland – Professionele Websites",
    template: "%s | WebDirect",
  },
  description:
    "WebDirect is een Nederlands webdesign bureau. Wij maken professionele, op maat gemaakte websites die converteren en verkopen. Vraag een gratis webdesign aan.",
  keywords: [
    "webdesign bureau Nederland",
    "website laten maken",
    "webdesign agency Nederland",
    "professionele website",
    "custom website",
    "webdesign",
    "website ontwerp",
    "websites die converteren",
  ],
  authors: [{ name: "WebDirect", url: siteUrl }],
  creator: "WebDirect",
  openGraph: {
    title: "WebDirect | Webdesign Bureau Nederland – Professionele Websites",
    description:
      "Professionele websites op maat voor Nederlandse bedrijven. Strategie, design en technologie voor websites die écht converteren.",
    url: siteUrl,
    siteName: "WebDirect",
    locale: "nl_NL",
    type: "website",
    images: [
      {
        url: "/images/seo-preview.png",
        width: 1200,
        height: 630,
        alt: "WebDirect – Webdesign bureau Nederland",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebDirect | Webdesign Bureau Nederland",
    description: "Professionele websites op maat. Vraag gratis webdesign aan.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/images/webdirect-Symbol.svg",
    shortcut: "/images/webdirect-Symbol.svg",
    apple: "/images/webdirect-Symbol.svg",
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
    <html lang="nl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SEOJsonLD />
        {children}
        <Script
          src="https://cdn.feedbucket.app/assets/feedbucket.js"
          data-feedbucket={process.env.NEXT_PUBLIC_FEEDBUCKET_KEY}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
