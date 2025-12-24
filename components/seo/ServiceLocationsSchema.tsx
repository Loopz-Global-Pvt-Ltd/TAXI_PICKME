import { serviceLocations, airportRoutes } from "@/data/service-locations"

export function ServiceLocationsSchema() {
  const service = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Taxi Sri Lanka Tours",
    "image": "https://taxisrilanka.com/favicon/android-chrome-512x512.png",
    "@id": "https://taxisrilanka.com",
    "url": "https://taxisrilanka.com",
    "telephone": "+94777850529",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Colombo",
      "addressLocality": "Colombo",
      "addressRegion": "Western Province",
      "addressCountry": "LK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 6.9271,
      "longitude": 79.8612
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "areaServed": serviceLocations.map(location => ({
      "@type": "City",
      "name": location.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": location.name,
        "addressRegion": location.province,
        "addressCountry": "LK"
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
    />
  )
}
