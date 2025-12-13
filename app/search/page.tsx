// app/search/page.tsx  
"use client"

import { useMemo, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import SearchFilters from "@/components/search-filters"
import VehicleCard from "@/components/vehicle-card"
import { ChevronDown, Loader2 } from "lucide-react"
import { calculateFare, type VehicleType } from "@/lib/pricing"
import { se } from "date-fns/locale"

type SortOption = "price-low" | "price-high" | "rating" | "popularity"

interface Vehicle {
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

interface VehicleWithPrice extends Vehicle {
  estimatedTotalPrice: number
  pricingBreakdown: {
    distanceFare: number
    totalFare: number
    effectiveRatePerKm: number
    savings: number
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  // Log search parameters received from homepage
  const [vehicles, setVehicles] = useState<VehicleWithPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([3500, 12500])
  const [sortBy, setSortBy] = useState<SortOption>("price-low")

  const pickup = searchParams.get("pickup") || ""
  const dropoff = searchParams.get("dropoff") || ""
  const distance = parseFloat(searchParams.get("distance") || "0")
  const duration = parseInt(searchParams.get("duration") || "0")
  const date = searchParams.get("date") || ""
  const time = searchParams.get("time") || ""
  const passengers = searchParams.get("passengers") || "1"

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const params = new URLSearchParams({
          passengers: passengers,
        })

        const response = await fetch(`/api/vehicles?${params}`)
        const data = await response.json()

        if (data.success) {
          const vehiclesWithPrices: VehicleWithPrice[] = []

          for (const vehicle of data.data) {
            try {
              // Use vehicle ID instead of category
              const fareResult = await calculateFare({
                vehicleId: vehicle.id,  // Changed from vehicleType
                distanceKm: distance
              })

              if (!fareResult || !fareResult.fareBreakdown) {
                throw new Error('Invalid fare calculation result')
              }

              const flatRateFare = distance * vehicle.price_per_km
              const savings = flatRateFare - fareResult.fareBreakdown.totalFare

              // console.log(`[${vehicle.name}] Price Calculation:`, {
              //   vehicleId: vehicle.id,
              //   distance: `${distance} km`,
              //   baseRatePerKm: vehicle.price_per_km,
              //   flatRateFare: flatRateFare.toFixed(2),
              //   distanceFare: fareResult.fareBreakdown.distanceFare.toFixed(2),
              //   totalFare: fareResult.fareBreakdown.totalFare.toFixed(2),
              //   effectiveRatePerKm: fareResult.fareBreakdown.effectiveRatePerKm.toFixed(2),
              //   savings: savings.toFixed(2)
              // })

              vehiclesWithPrices.push({
                ...vehicle,
                estimatedTotalPrice: fareResult.fareBreakdown.totalFare,
                pricingBreakdown: {
                  distanceFare: fareResult.fareBreakdown.distanceFare,
                  totalFare: fareResult.fareBreakdown.totalFare,
                  effectiveRatePerKm: fareResult.fareBreakdown.effectiveRatePerKm,
                  savings: Math.round(savings)
                }
              })
            } catch (error) {
              console.error(`Error calculating price for ${vehicle.name}:`, error)
              const simplePrice = distance * vehicle.price_per_km
              
              console.log(`[${vehicle.name}] Fallback Price Calculation:`, {
                distance: `${distance} km`,
                baseRatePerKm: vehicle.price_per_km,
                simplePrice: simplePrice.toFixed(2)
              })

              vehiclesWithPrices.push({
                ...vehicle,
                estimatedTotalPrice: Math.round(simplePrice),
                pricingBreakdown: {
                  distanceFare: Math.round(simplePrice),
                  totalFare: Math.round(simplePrice),
                  effectiveRatePerKm: vehicle.price_per_km,
                  savings: 0
                }
              })
            }
          }

          setVehicles(vehiclesWithPrices)
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [distance, passengers])

  const filteredVehicles = useMemo(() => {
    let result = vehicles

    if (selectedCategory) {
      result = result.filter((v) => v.category === selectedCategory)
    }

    switch (sortBy) {
      case "price-high":
        result.sort((a, b) => b.estimatedTotalPrice - a.estimatedTotalPrice)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "popularity":
        result.sort((a, b) => b.reviews - a.reviews)
        break
      case "price-low":
      default:
        result.sort((a, b) => a.estimatedTotalPrice - b.estimatedTotalPrice)
    }

    return result
  }, [vehicles, selectedCategory, sortBy])

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Search Summary */}
      {/* <section className="bg-primary/10 py-6 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Available Taxis</h1>
            </div>
          </div>
        </div>
      </section> */}

      {/* Results Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              {/* <div className="sticky top-4">
                <SearchFilters
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                />
              </div> */}

              <div className="sticky top-4 bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Trip Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Route</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{pickup}</p>
                          <p className="text-xs text-muted-foreground">Pickup Location</p>
                        </div>
                      </div>
                      <div className="ml-1 border-l-2 border-dashed border-border h-8"></div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-destructive mt-1.5"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{dropoff}</p>
                          <p className="text-xs text-muted-foreground">Drop-off Location</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Journey Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Distance</span>
                        <span className="text-sm font-semibold text-foreground">{distance.toFixed(1)} km</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Date</span>
                        <span className="text-sm font-semibold text-foreground">{date}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Time</span>
                        <span className="text-sm font-semibold text-foreground">{time || "Not specified"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Passengers</span>
                        <span className="text-sm font-semibold text-foreground">{passengers}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Choose a Vehicle</h1>
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredVehicles.length}</span> result
                  {filteredVehicles.length !== 1 ? "s" : ""}
                </p>
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition">
                    <span>
                      Sort by:{" "}
                      {sortBy === "price-low"
                        ? "Price (Low to High)"
                        : sortBy === "price-high"
                          ? "Price (High to Low)"
                          : sortBy === "rating"
                            ? "Rating"
                            : "Popularity"}
                    </span>
                    <ChevronDown size={16} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-10 hidden group-hover:block">
                    {[
                      { value: "price-low" as SortOption, label: "Price (Low to High)" },
                      { value: "price-high" as SortOption, label: "Price (High to Low)" },
                      { value: "rating" as SortOption, label: "Rating" },
                      { value: "popularity" as SortOption, label: "Popularity" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Calculating best prices...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle) => (
                      <VehicleCard 
                        key={vehicle.id} 
                        vehicle={vehicle}
                        estimatedDistance={distance}
                        pricingBreakdown={vehicle.pricingBreakdown}
                        searchParams={{
                          pickup,
                          dropoff,
                          date,
                          time,
                          distance: distance.toString(),
                        }}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 bg-muted rounded-lg">
                      <p className="text-foreground font-semibold mb-2">No vehicles found</p>
                      <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or search criteria</p>
                      <Link href="/">
                        <Button>New Search</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}