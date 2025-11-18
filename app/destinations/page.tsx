"use client"

import Header from "@/components/Header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, DollarSign } from "lucide-react"
import Link from "next/link"

export default function DestinationsPage() {
  const destinations = [
    {
      name: "Colombo Airport (CMB)",
      description: "International gateway to Sri Lanka. Modern facilities and easy access to all parts of the country.",
      distance: "35km from Colombo City",
      time: "1 hour",
      price: "Rs. 5,500 - 7,500",
      highlights: ["24/7 Operations", "Meet & Greet Service", "Professional Drivers"],
    },
    {
      name: "Galle",
      description: "Historic fortress city on the southern coast. Perfect for beach lovers and history enthusiasts.",
      distance: "120km from Colombo",
      time: "2.5 hours",
      price: "Rs. 8,500 - 10,500",
      highlights: ["UNESCO World Heritage", "Beautiful Beaches", "Local Markets"],
    },
    {
      name: "Kandy",
      description: "Cultural heart of Sri Lanka. Home to the sacred Temple of the Tooth and surrounded by lush hills.",
      distance: "115km from Colombo",
      time: "2.5 hours",
      price: "Rs. 8,000 - 10,000",
      highlights: ["Temple of the Tooth", "Lake Views", "Tea Plantations Nearby"],
    },
    {
      name: "Sigiriya",
      description: "Ancient rock fortress and UNESCO World Heritage Site. Spectacular views and rich history.",
      distance: "165km from Colombo",
      time: "3.5 hours",
      price: "Rs. 10,500 - 12,500",
      highlights: ["Ancient Palace", "Stunning Views", "Wildlife Safari"],
    },
    {
      name: "Ella",
      description: "Picturesque mountain town in the central highlands. Famous for tea plantations and scenic views.",
      distance: "225km from Colombo",
      time: "5 hours",
      price: "Rs. 12,500 - 15,000",
      highlights: ["Tea Plantations", "Mountain Views", "Waterfall Hikes"],
    },
    {
      name: "Nuwara Eliya",
      description: "Colonial-era hill station with cool weather. Perfect for a relaxing getaway amid nature.",
      distance: "180km from Colombo",
      time: "4 hours",
      price: "Rs. 11,000 - 13,500",
      highlights: ["Lakeside Beauty", "Cool Climate", "Colonial Architecture"],
    },
    {
      name: "Mirissa",
      description: "Tropical beach paradise on the south coast. Known for whale watching and water sports.",
      distance: "160km from Colombo",
      time: "3.5 hours",
      price: "Rs. 9,500 - 11,500",
      highlights: ["Whale Watching", "Beach Activities", "Sunset Views"],
    },
    {
      name: "Negombo",
      description: "Beach town near Colombo Airport. Ideal for short getaways or pre-departure relaxation.",
      distance: "42km from Colombo",
      time: "1 hour",
      price: "Rs. 4,500 - 6,500",
      highlights: ["Sandy Beaches", "Lagoon Tours", "Fresh Seafood"],
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-transparent py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Explore Sri Lanka</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular destinations and plan your perfect trip with Sri Lanka Taxi.
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {destinations.map((destination, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition">
                <div className="flex items-start gap-4 mb-4">
                  <MapPin size={28} className="text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">{destination.name}</h3>
                    <p className="text-sm text-muted-foreground">{destination.description}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 pt-4 border-t border-border">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <MapPin size={16} />
                      Distance
                    </span>
                    <span className="font-semibold text-foreground">{destination.distance}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock size={16} />
                      Travel Time
                    </span>
                    <span className="font-semibold text-foreground">{destination.time}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <DollarSign size={16} />
                      Estimated Cost
                    </span>
                    <span className="font-semibold text-foreground">{destination.price}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Highlights</p>
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.map((highlight, i) => (
                      <span key={i} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <Link href="/">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Book a Ride</Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
