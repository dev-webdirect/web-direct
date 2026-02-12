// ----------------------------
// SEOJsonLD Component
// JSON-LD structured data for search engines (Netherlands web design agency).
// No Google Translate — site is in Dutch only.
// ----------------------------

const SITE_URL =
  typeof process.env.NEXT_PUBLIC_SITE_URL === "string"
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : "https://www.webdirect.nl";

export function SEOJsonLD() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WebDirect",
    url: SITE_URL,
    logo: `${SITE_URL}/images/webdirect-Symbol.svg`,
    description:
      "WebDirect is een webdesign bureau in Nederland. Wij ontwerpen professionele websites die converteren, overtuigen en verkopen.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "NL",
    },
    areaServed: {
      "@type": "Country",
      name: "Nederland",
    },
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WebDirect",
    url: SITE_URL,
    description:
      "Webdesign bureau Nederland. Professionele websites die converteren en verkopen. Vraag gratis webdesign aan.",
    inLanguage: "nl-NL",
    publisher: {
      "@type": "Organization",
      name: "WebDirect",
      url: SITE_URL,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  const professionalService = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "WebDirect — Webdesign Bureau",
    url: SITE_URL,
    description:
      "Webdesign en website ontwikkeling in Nederland. Custom websites voor bedrijven die willen groeien en verkopen.",
    areaServed: { "@type": "Country", name: "Nederland" },
    serviceType: "Webdesign",
    provider: { "@type": "Organization", name: "WebDirect" },
  };

  const jsonLd = [organization, webSite, professionalService];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
