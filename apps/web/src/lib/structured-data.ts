export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Infobite",
  "url": "https://infobite.online",
  "logo": "https://infobite.online/logo.png",
  "description": "Transform your curiosity into knowledge with Infobite. Explore bite-sized insights, trending topics, and expert perspectives.",
  "sameAs": [
    "https://twitter.com/infobite",
    "https://facebook.com/infobite",
    "https://linkedin.com/company/infobite"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "contact@infobite.online",
    "areaServed": "IN"
  }
};

export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Infobite",
  "url": "https://infobite.online",
  "description": "Discover, Learn, and Share Knowledge with bite-sized insights and expert perspectives.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://infobite.online/search/{search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Infobite",
    "logo": "https://infobite.online/logo.png"
  }
};
