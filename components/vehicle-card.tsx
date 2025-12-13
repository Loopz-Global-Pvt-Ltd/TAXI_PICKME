// components/vehicle-card.tsx
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, Users, Briefcase, Fuel, Settings } from "lucide-react"

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
    fuel_type: string
    transmission: string
    estimatedTotalPrice?: number
  }
  estimatedDistance?: number
  pricingBreakdown?: {
    distanceFare: number
    totalFare: number
    effectiveRatePerKm: number
    savings: number
  }
  searchParams?: {
    pickup: string
    dropoff: string
    date: string
    time: string
    distance: string
  }
}

export default function VehicleCard({ vehicle, estimatedDistance, pricingBreakdown, searchParams }: VehicleCardProps) {
  const distance = estimatedDistance || parseFloat(searchParams?.distance || "0")
  const totalPrice = vehicle.estimatedTotalPrice || pricingBreakdown?.totalFare || (vehicle.price_per_km * distance)
  const effectiveRate = pricingBreakdown?.effectiveRatePerKm || vehicle.price_per_km
  const savings = pricingBreakdown?.savings || 0

  // Build query params for booking page
  const bookingParams = new URLSearchParams({
    pickup: searchParams?.pickup || "",
    dropoff: searchParams?.dropoff || "",
    date: searchParams?.date || "",
    time: searchParams?.time || "",
    estimatedDistance: distance.toString(),
    totalPrice: totalPrice.toString(),
    effectiveRate: effectiveRate.toString(),
  })

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Vehicle Image */}
        <div className="relative h-48 md:h-full bg-muted rounded-lg overflow-hidden">
          {vehicle.image ? (
            <Image src={vehicle.image} alt={vehicle.name} fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Car className="h-20 w-20 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Vehicle Details */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-foreground">{vehicle.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {vehicle.category} • {vehicle.fuel_type} • {vehicle.transmission}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-foreground">{vehicle.rating}</span>
                <span className="text-muted-foreground">({vehicle.reviews})</span>
              </div>
            </div>

            {/* Specifications */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{vehicle.seats} Seats</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>{vehicle.luggage} Luggage</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Fuel className="h-4 w-4" />
                <span>{vehicle.fuel_type}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Settings className="h-4 w-4" />
                <span>{vehicle.transmission}</span>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {vehicle.features?.slice(0, 4).map((feature, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="mt-4 pt-4 border-t border-border flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-primary">
                  Rs. {totalPrice.toLocaleString()}
                </p>
                {savings > 0 && (
                  <span className="text-sm text-green-600 font-medium">
                    Save Rs. {savings.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                For {distance.toFixed(1)} km journey
              </p>
              {pricingBreakdown && (
                <p className="text-xs text-muted-foreground">
                  Avg: Rs. {effectiveRate.toFixed(2)}/km • Tier-based pricing
                </p>
              )}
            </div>
            <Link href={`/booking/${vehicle.id}?${bookingParams.toString()}`}>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Select Vehicle
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}