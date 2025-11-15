"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, Users, Briefcase } from "lucide-react"
import { motion } from "framer-motion"

interface Vehicle {
  id: number
  name: string
  category: string
  price: number
  image: string
  seats: number
  luggage: number
  rating: number
  reviews: number
  features: string[]
}

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
          {/* Vehicle Image */}
          <motion.div
            className="md:col-span-1"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative w-full h-40 bg-muted rounded-lg overflow-hidden">
              <Image src={vehicle.image || "/placeholder.svg"} alt={vehicle.name} fill className="object-cover" />
            </div>
          </motion.div>

          {/* Vehicle Details */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-lg text-foreground">{vehicle.name}</h4>
                  <p className="text-sm text-muted-foreground">{vehicle.category}</p>
                </div>
                <motion.div
                  className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded"
                  whileHover={{ scale: 1.1 }}
                >
                  <Star size={16} className="text-primary fill-primary" />
                  <span className="text-sm font-semibold text-foreground">{vehicle.rating}</span>
                  <span className="text-xs text-muted-foreground">({vehicle.reviews})</span>
                </motion.div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mt-3">
                {vehicle.features.slice(0, 3).map((feature, index) => (
                  <motion.span
                    key={feature}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="text-xs bg-secondary/10 text-foreground px-2 py-1 rounded"
                  >
                    {feature}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Specs */}
            <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>{vehicle.seats} Seats</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase size={16} />
                <span>{vehicle.luggage} Bags</span>
              </div>
            </div>
          </div>

          {/* Pricing and CTA */}
          <div className="md:col-span-1 flex flex-col justify-between items-end">
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">Rs. {vehicle.price.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">per day</p>
            </div>
            <Link href={`/booking/${vehicle.id}`}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Select</Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
