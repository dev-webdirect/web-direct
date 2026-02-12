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
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: {
    default: "WebDirect | Webdesign Bureau Nederland — Professionele Websites",
    template: "%s | WebDirect",
  },
  description:
    "WebDirect is een webdesign bureau in Nederland. Wij ontwerpen professionele websites die converteren, overtuigen en verkopen. Vraag een gratis webdesign aan.",
  keywords: [
    "webdesign bureau Nederland",
    "website laten maken",
    "webdesign agency Nederland",
    "professionele website",
    "custom website",
    "webdesign",
    "website ontwerp",
  ],
  authors: [{ name: "WebDirect", url: process.env.NEXT_PUBLIC_SITE_URL }],
  creator: "WebDirect",
  openGraph: {
    title: "WebDirect | Webdesign Bureau Nederland — Professionele Websites",
    description:
      "Webdesign bureau in Nederland. Professionele websites die converteren en verkopen. Strategie, design en technologie voor ambitieuze merken.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "WebDirect",
    locale: "nl_NL",
    type: "website",
    images: [
      {
        url: "/images/seo-preview.png",
        width: 1200,
        height: 630,
        alt: "WebDirect — Webdesign bureau Nederland",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  other: {
    "geo.region": "NL",
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
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}