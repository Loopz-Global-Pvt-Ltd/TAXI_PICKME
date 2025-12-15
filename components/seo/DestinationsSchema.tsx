import { destinations } from "@/data/destinations"

export function DestinationsSchema() {
  const itemListElement = destinations.map((destination, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "TouristDestination",
      "@id": `https://taxisrilanka.com/destinations/${destination.slug}`,
      "name": destination.name,
      "description": destination.description,
      "url": `https://taxisrilanka.com/destinations/${destination.slug}`,
      "image": `https://taxisrilanka.com${destination.imageUrl}`,
      "address": {
        "@type": "PostalAddress",
        "addressRegion": destination.location,
        "addressCountry": "LK"
      },
      "touristType": destination.popularWith
    }
  }))

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Popular Tourist Destinations in Sri Lanka",
    "description": "Explore the most popular tourist destinations in Sri Lanka with professional taxi and transport services",
    "numberOfItems": destinations.length,
    "itemListElement": itemListElement
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
