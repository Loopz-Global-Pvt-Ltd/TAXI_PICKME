export function ReviewSchema() {
    const reviewData = {
      "@context": "https://schema.org",
      "@type": "Review",
      "itemReviewed": {
        "@type": "TaxiService",
        "name": "Taxi Sri Lanka Tours"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "4.8",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "John Smith"
      },
      "reviewBody": "Excellent service! Our driver was punctual, professional, and very knowledgeable about Sri Lankan culture. Highly recommend for tourists."
    }
  
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewData) }}
      />
    )
  }