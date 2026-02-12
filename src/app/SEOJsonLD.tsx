// ----------------------------
// SEOJsonLD Component
// Adds JSON-LD structured data for search engines (Google rich results).
// Tailored for WebDirect – webdesign bureau Nederland.
// ----------------------------

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.webdirect.nl";

export function SEOJsonLD() {
  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WebDirect",
    alternateName: "WebDirect Webdesign",
    url: siteUrl,
    description:
      "WebDirect is een Nederlands webdesign bureau. Wij maken professionele, op maat gemaakte websites die converteren en verkopen.",
    inLanguage: "nl-NL",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", url: `${siteUrl}/#services` },
      "query-input": "required name=search_term_string",
    },
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "WebDirect",
    url: siteUrl,
    logo: { "@type": "ImageObject", url: `${siteUrl}/images/logo.svg` },
    description:
      "Nederlands webdesign bureau gespecialiseerd in professionele websites op maat. Strategie, design en technologie voor merken die willen groeien.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "NL",
    },
    areaServed: { "@type": "Country", name: "Netherlands" },
    knowsLanguage: "nl",
    sameAs: [],
  };

  const professionalService = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#service`,
    name: "WebDirect – Webdesign Bureau",
    url: siteUrl,
    description:
      "Webdesign en website ontwikkeling voor Nederlandse bedrijven. Custom websites die converteren, overtuigen en verkopen.",
    areaServed: { "@type": "Country", name: "Netherlands" },
    serviceType: "Webdesign",
    provider: { "@id": `${siteUrl}/#organization` },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Webdesign diensten",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Professioneel webdesign" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Custom website ontwikkeling" },
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalService) }}
      />
    </>
  );
}
