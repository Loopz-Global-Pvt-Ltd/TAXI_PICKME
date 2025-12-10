"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, Users, Luggage, Fuel, Zap } from "lucide-react"

interface VehicleCardProps {
  vehicle: {
    id: number
    name: string
    category: string
    price_per_km: number
    image: string
    seats: number
    luggage: number
    rating: number
    reviews: number
    features: string[]
    description: string
    fuel_type: string
    transmission: string
  }
  estimatedDistance: number
  pricingBreakdown?: {
    distanceFare: number
    totalFare: number
    effectiveRatePerKm: number
    savings: number
  }
  searchParams: {
    pickup: string
    dropoff: string
    date: string
    time: string
    distance: string
  }
}

export default function VehicleCard({ vehicle, estimatedDistance, pricingBreakdown, searchParams }: VehicleCardProps) {
  const bookingUrl = `/booking/${vehicle.id}?` + new URLSearchParams({
    pickup: searchParams.pickup,
    dropoff: searchParams.dropoff,
    date: searchParams.date,
    time: searchParams.time,
    estimatedDistance: searchParams.distance,
  }).toString()

  // Use pricing breakdown if available, otherwise fallback to simple calculation
  const totalPrice = pricingBreakdown?.totalFare || Math.round(estimatedDistance * vehicle.price_per_km)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr_auto] gap-3 p-5">
        {/* Vehicle Image */}
        <div className="relative">
          <div className="relative h-48 md:h-full bg-muted rounded-lg overflow-hidden">
            {vehicle.image ? (
              <Image
                src={vehicle.image}
                alt={vehicle.name}
                fill
                className="object-cover"
                sizes="280px"
              />

            ) : (
              <div className="flex items-center justify-center h-full">
                <Card className="h-20 w-20 text-gray-400" />
              </div>
            )}
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
            {vehicle.category}
          </div>
          </div>
        
        </div>

        {/* Vehicle Details */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="text-xl font-bold text-foreground">{vehicle.name}</h3>
                <p className="text-sm text-muted-foreground">{vehicle.description}</p>
              </div>
              <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 rounded">
                <Star className="fill-yellow-500 text-yellow-500" size={14} />
                <span className="text-sm font-bold">{vehicle.rating}</span>
                <span className="text-xs text-muted-foreground">({vehicle.reviews})</span>
              </div>
            </div>

            {/* Specs */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users size={16} className="text-primary" />
                <span>{vehicle.seats} Seats</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Luggage size={16} className="text-primary" />
                <span>{vehicle.luggage} Bags</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Fuel size={16} className="text-primary" />
                <span className="capitalize">{vehicle.fuel_type}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap size={16} className="text-primary" />
                <span className="capitalize">{vehicle.transmission}</span>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {vehicle.features.slice(0, 4).map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-muted text-xs font-medium text-foreground rounded-full"
                >
                  {feature}
                </span>
              ))}
              {vehicle.features.length > 4 && (
                <span className="px-3 py-1 bg-muted text-xs font-medium text-foreground rounded-full">
                  +{vehicle.features.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="flex flex-col justify-between items-end min-w-[200px] border-l border-border pl-6">
          <div className="text-right w-full">
            <p className="text-xs text-muted-foreground mb-1">Total Price</p>
            <p className="text-3xl font-bold text-primary mb-1">
              Rs. {totalPrice.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mb-1">
              All inclusive
            </p>
          </div>

          <div className="w-full space-y-2">
            <Link href={bookingUrl} className="block">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                Select Vehicle
              </Button>
            </Link>
            
            <p className="text-xs text-center text-muted-foreground">
              Free cancellation • Instant confirmation
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}