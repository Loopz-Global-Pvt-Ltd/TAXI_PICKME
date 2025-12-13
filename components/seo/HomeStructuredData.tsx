export function HomeStructuredData() {
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        /* =========================
           TAXI SERVICE (MAIN ENTITY)
        ========================== */
        {
          "@type": "TaxiService",
          "@id": "https://taxisrilanka.com/#taxiservice",
          "name": "Taxi Sri Lanka",
          "url": "https://taxisrilanka.com",
          "logo": "https://taxisrilanka.com/logo.png",
          "image": "https://taxisrilanka.com/images/service.jpg",
          "description":
            "Taxi Sri Lanka provides airport transfers, taxi booking, car hire with driver, vans, three-wheel services, and islandwide tours for tourists across Sri Lanka.",
          "telephone": "+94777850529",
          "email": "info@taxisrilanka.com",
  
          "priceRange": "$$",
          "currenciesAccepted": "LKR, USD, EUR",
  
          "paymentAccepted": [
            "Cash",
            "Online Payment",
            "Credit Card",
            "Debit Card"
          ],
  
          "openingHours": "Mo-Su 00:00-23:59",
          "availableLanguage": ["English", "Sinhala", "Tamil"],
  
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Colombo",
            "addressRegion": "Western Province",
            "addressCountry": "LK"
          },
  
          "areaServed": {
            "@type": "AdministrativeArea",
            "name": "Sri Lanka"
          },
  
          /* =========================
             VEHICLE FLEET
          ========================== */
          "vehicle": [
            { "@type": "Car", "name": "Toyota Axio" },
            { "@type": "Car", "name": "Toyota Prius" },
            { "@type": "Car", "name": "Nissan Leaf" },
            { "@type": "Car", "name": "Honda Vezel" },
            { "@type": "Car", "name": "Suzuki Alto" },
            { "@type": "Car", "name": "Suzuki Wagon R FZ" },
            { "@type": "Car", "name": "Mercedes-Benz E-Class" },
  
            { "@type": "BusOrCoach", "name": "Toyota Hiace" },
            { "@type": "BusOrCoach", "name": "Toyota KDH Van" },
  
            { "@type": "Vehicle", "name": "Three Wheel (Tuk Tuk)" }
          ],
  
          /* =========================
             OFFERS & SERVICES
          ========================== */
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Taxi & Tourist Transport Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Airport Transfers",
                  "description":
                    "24/7 airport pickup and drop service from Bandaranaike International Airport to all destinations in Sri Lanka."
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Car Hire with Driver",
                  "description":
                    "Private car hire with professional English-speaking drivers for tourists."
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Van & Group Transport",
                  "description":
                    "Spacious vans and group transport for families, tour groups, and safari trips."
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Three Wheel / Tuk Tuk Service",
                  "description":
                    "Short-distance and city transport using three-wheelers."
                }
              }
            ]
          },
  
          /* =========================
             PAYMENT METHODS
          ========================== */
          "makesOffer": [
            {
              "@type": "Offer",
              "name": "Pay at Trip",
              "description":
                "Pay directly to the driver at the end of your trip using cash or card."
            },
            {
              "@type": "Offer",
              "name": "Online Payment",
              "description":
                "Secure online payments via OnePay Payment Gateway."
            }
          ],
  
          "sameAs": [
            "https://www.facebook.com/taxisrilanka",
            "https://www.instagram.com/taxisrilanka",
            "https://twitter.com/taxisrilanka"
          ]
        },
  
        /* =========================
           PAYMENT GATEWAY INFO
        ========================== */
        {
          "@type": "PaymentService",
          "name": "OnePay Payment Gateway",
          "provider": {
            "@type": "Organization",
            "name": "OnePay"
          },
          "acceptedPaymentMethod": [
            {
              "@type": "PaymentCard",
              "name": "VISA"
            },
            {
              "@type": "PaymentCard",
              "name": "MasterCard"
            },
            {
              "@type": "PaymentCard",
              "name": "American Express"
            },
            {
              "@type": "PaymentCard",
              "name": "China UnionPay"
            }
          ]
        },
  
        /* =========================
           ORGANIZATION
        ========================== */
        {
          "@type": "Organization",
          "@id": "https://taxisrilanka.com/#organization",
          "name": "Taxi Sri Lanka",
          "url": "https://taxisrilanka.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://taxisrilanka.com/logo.png"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+94777850529",
            "contactType": "customer service",
            "availableLanguage": ["English", "Sinhala", "Tamil"]
          }
        },
  
        /* =========================
           WEBSITE
        ========================== */
        {
          "@type": "WebSite",
          "@id": "https://taxisrilanka.com/#website",
          "url": "https://taxisrilanka.com",
          "name": "Taxi Sri Lanka",
          "publisher": {
            "@id": "https://taxisrilanka.com/#organization"
          }
        }
      ]
    }
  
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    )
  }
  