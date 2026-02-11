// ----------------------------
// SEOJsonLD Component
// Adds JSON-LD structured data to the page for search engines
// Google uses this to understand the website, and it can help
// show rich results in search listings
// ----------------------------
export function SEOJsonLD() {
  return (
    <script
      type="application/ld+json" // Required type for JSON-LD structured data
      dangerouslySetInnerHTML={{  // React requires this to inject raw JSON
        __html: JSON.stringify({
          // -------------------------------
          // @context: defines the schema.org context
          // Always "https://schema.org" for structured data
          // -------------------------------
          "@context": "https://schema.org",

          // -------------------------------
          // @type: type of entity the data describes
          // "WebSite" indicates this JSON-LD is about a website
          // -------------------------------
          "@type": "WebSite",

          // -------------------------------
          // Website name (change to client/project name)
          // -------------------------------
          "name": "WebDirect", // <-- CHANGE THIS

          // -------------------------------
          // Main URL of the website
          // Make sure it matches the client domain
          // -------------------------------
          "url": "https://www.webdirect.nl", // <-- CHANGE THIS
        }),   
      }}
    />
  );
}
