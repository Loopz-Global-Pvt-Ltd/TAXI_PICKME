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

type SortOption = "price-low" | "price-high" | "rating" | "popularity"

interface Vehicle {
  id: number
  name: string
  category: string
  base_price: number
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
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [vehicles, setVehicles] = useState<VehicleWithPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([3500, 12500])
  const [sortBy, setSortBy] = useState<SortOption>("price-low")

  // Get search parameters
  const pickup = searchParams.get("pickup") || ""
  const dropoff = searchParams.get("dropoff") || ""
  const distance = parseFloat(searchParams.get("distance") || "0")
  const duration = parseInt(searchParams.get("duration") || "0")
  const date = searchParams.get("date") || ""
  const time = searchParams.get("time") || ""
  const passengers = searchParams.get("passengers") || "1"

  // Fetch vehicles and calculate prices
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const params = new URLSearchParams({
          passengers: passengers,
        })

        const response = await fetch(`/api/vehicles?${params}`)
        const data = await response.json()

        if (data.success) {
          // Calculate estimated price for each vehicle
          const vehiclesWithPrices = data.data.map((vehicle: Vehicle) => {
            const distancePrice = distance * vehicle.price_per_km
            const estimatedTotalPrice = vehicle.base_price + distancePrice

            return {
              ...vehicle,
              estimatedTotalPrice,
            }
          })

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

    // Filter by category
    if (selectedCategory) {
      result = result.filter((v) => v.category === selectedCategory)
    }

    // Filter by price range (using estimated total price)
    result = result.filter(
      (v) => v.estimatedTotalPrice >= priceRange[0] && v.estimatedTotalPrice <= priceRange[1]
    )

    // Sort
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
  }, [vehicles, selectedCategory, priceRange, sortBy])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Search Summary */}
      <section className="bg-primary/10 py-6 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Available Taxis</h1>
              <div className="text-muted-foreground space-y-1">
                <p>
                  <span className="font-semibold">{pickup}</span> → <span className="font-semibold">{dropoff}</span>
                </p>
                <p className="text-sm">
                  Distance: <span className="font-semibold">{distance.toFixed(1)} km</span> • 
                  Duration: <span className="font-semibold">{Math.round(duration)} mins</span> • 
                  Date: <span className="font-semibold">{date}</span> • 
                  {passengers} Passenger{passengers !== "1" ? "s" : ""}
                </p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline">Modify Search</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1">
              <div className="sticky top-4">
                <SearchFilters
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                />
              </div>
            </aside>

            {/* Vehicle Listings */}
            <div className="lg:col-span-3">
              {/* Sort Options */}
              <div className="mb-6 flex items-center justify-between">
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

              {/* Vehicle List */}
              <div className="space-y-4">
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle) => (
                    <VehicleCard 
                      key={vehicle.id} 
                      vehicle={vehicle}
                      estimatedDistance={distance}
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
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}