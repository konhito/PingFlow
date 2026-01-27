export function StructuredData() {
  // Use a constant fallback to ensure static generation works
  const baseUrl = typeof window === "undefined" 
    ? (process.env.NEXT_PUBLIC_WEBSITE_URL || "https://pingflow.konhito.me/")
    : "https://pingflow.konhito.me/"

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PingFlow",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "49",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "1000",
    },
    "description": "Real-time SaaS event notifications delivered to Discord, WhatsApp, and Telegram",
    "url": baseUrl,
    "author": {
      "@type": "Person",
      "name": "Konhito aka Aditya",
    },
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PingFlow",
    "url": baseUrl,
    "description": "Real-time SaaS event notifications platform",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I integrate PingFlow with my application?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply sign up, get your API key, and make HTTP POST requests to our endpoint. We have SDKs for popular languages and detailed documentation to help you get started in minutes.",
        },
      },
      {
        "@type": "Question",
        "name": "Which platforms do you support for notifications?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We currently support Discord, WhatsApp, and Telegram. You can send notifications to any combination of these platforms based on your preferences.",
        },
      },
      {
        "@type": "Question",
        "name": "Is there a free plan available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our free plan includes 100 events per month, 3 categories, and Discord integration. Perfect for side projects and testing before upgrading.",
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}

