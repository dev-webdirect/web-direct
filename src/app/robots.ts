// app/robots.ts
import { MetadataRoute } from "next";

// -------------------------------
// This file defines the robots.txt for your website
// You can control which pages search engines can index
// and provide the sitemap URL
// -------------------------------
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all search engines to crawl the site
        userAgent: "*", // * means all bots
        allow: "/", // allow crawling the entire site
        // disallow: ["/admin"], // Uncomment to block specific paths
      },
    ],
    // Optional: point to your sitemap
    sitemap: "https://www.webdirect.nl/sitemap.xml", // <-- CHANGE to client domain
  };
}
