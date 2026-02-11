import type { MetadataRoute } from "next";

/**
 * Generates /sitemap.xml
 * Used by Google and other search engines to discover pages
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://webdirect.nl";
  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    
  ];
}