"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Clock, Camera } from "lucide-react"

const TOURS = [
  {
    id: 1,
    title: "Golden Triangle Tour",
    destinations: "Colombo • Sigiriya • Kandy",
    days: "3 Days",
    highlights: "Ancient fortress, cultural temples, tea plantations",
    image: "/sigiriya-rock-fortress-sri-lanka-landscape.jpg",
    price: "Rs 8,500",
    popular: true,
  },
  {
    id: 2,
    title: "South Coast Paradise",
    destinations: "Colombo • Mirissa • Ella",
    days: "4 Days",
    highlights: "Whale watching, beaches, mountain views",
    image: "/sri-lanka-coastal-views-sea-beaches-sunset-tourism.jpg",
    price: "Rs 11,200",
    popular: true,
  },
  {
    id: 3,
    title: "Tea Country Experience",
    destinations: "Nuwara Eliya • Kandy • Colombo",
    days: "2 Days",
    highlights: "Tea plantations, scenic trains, colonial towns",
    image: "/nuwara-eliya-tea-plantations-mountains-sri-lanka.jpg",
    price: "Rs 6,800",
    popular: false,
  },
]

export default function FeaturedTours() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Tour Packages</h2>
          <p className="text-lg text-muted-foreground">Curated multi-day experiences across Sri Lanka</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOURS.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="relative bg-card border border-border rounded-xl overflow-hidden h-full flex flex-col shadow-md hover:shadow-xl transition-all">
                {tour.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-secondary text-primary px-3 py-1 rounded-full text-xs font-semibold">
                      Popular
                    </div>
                  </div>
                )}
                <div className="h-48 overflow-hidden">
                  <motion.div
                    className="h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${tour.image})` }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-foreground mb-2">{tour.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                    <MapPin size={16} /> {tour.destinations}
                  </p>
                  <p className="text-sm text-foreground mb-3 flex items-center gap-2">
                    <Clock size={16} /> {tour.days}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4 flex items-start gap-2">
                    <Camera size={16} className="flex-shrink-0 mt-0.5" /> {tour.highlights}
                  </p>
                  <div className="mt-auto pt-4 border-t border-border">
                    <p className="text-2xl font-bold text-secondary mb-4">{tour.price}</p>
                    <Link href={`/search?destination=${tour.destinations}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Book Tour
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
