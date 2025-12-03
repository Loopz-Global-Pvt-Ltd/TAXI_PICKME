// components/vehicle-card.tsx
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
    fuel_type?: string
    transmission?: string
    estimatedTotalPrice?: number
  }
  estimatedDistance?: number
  searchParams?: {
    pickup: string
    dropoff: string
    date: string
    time: string
    distance: string
  }
}

export default function VehicleCard({ vehicle, estimatedDistance = 0, searchParams }: VehicleCardProps) {
  const distancePrice = estimatedDistance * vehicle.price_per_km
  const totalEstimate =  distancePrice

  // Build booking URL with all params
  const bookingUrl = searchParams
    ? `/booking/${vehicle.id}?${new URLSearchParams({
        ...searchParams,
        estimatedDistance: estimatedDistance.toString(),
      }).toString()}`
    : `/booking/${vehicle.id}`

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Image */}
        <div className="relative h-48 md:h-full bg-muted rounded-lg overflow-hidden">
          <Image
            src={vehicle.image || "/placeholder.svg"}
            alt={vehicle.name}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
            {vehicle.category}
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-2 flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">{vehicle.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-foreground">{vehicle.rating}</span>
                  </div>
                  <span>({vehicle.reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users size={16} />
                <span>{vehicle.seats} Seats</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase size={16} />
                <span>{vehicle.luggage} Bags</span>
              </div>
              {vehicle.fuel_type && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Fuel size={16} />
                  <span>{vehicle.fuel_type}</span>
                </div>
              )}
              {vehicle.transmission && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Settings size={16} />
                  <span>{vehicle.transmission}</span>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-4">
              {vehicle.features.slice(0, 3).map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1 bg-muted text-foreground text-xs rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
            {/* Price per km */}
            <div className="mb-2">
              <p className="text-sm text-muted-foreground">
                Price per km: <span className="font-semibold text-foreground">Rs. {vehicle.price_per_km}</span>
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between pt-4 border-t border-border">
            <div>

              <p className="text-xs text-muted-foreground mb-1">Estimated Total :</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">
                  Rs. {Number(totalEstimate).toFixed(2)}
                </span>
              </div>
            </div>
            <Link href={bookingUrl} className="cursor-pointer">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
              Book Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}