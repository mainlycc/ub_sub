// Helper functions for Schema.org structured data

export const generateInsuranceAgencySchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    "name": "GapAuto.pl - Business Care",
    "image": "https://gapauto.pl/BC.png",
    "url": "https://gapauto.pl",
    "telephone": "+48796148577",
    "email": "biuro@gapauto.pl",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "ul. Przyszłości 6",
      "addressLocality": "Skubianka",
      "postalCode": "05-140",
      "addressCountry": "PL"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "14:00"
      }
    ],
    "priceRange": "$$",
    "sameAs": [
      "https://www.facebook.com/people/BC-Księgowość/61571088134057/"
    ]
  };
};

export const generateFAQPageSchema = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};
