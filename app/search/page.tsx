"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import SearchFilters from "@/components/search-filters"
import VehicleCard from "@/components/vehicle-card"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

// Mock vehicle data
const MOCK_VEHICLES = [
  {
    id: 1,
    name: "Toyota Corolla",
    category: "Economy",
    price: 5500,
    image: "/toyota-corolla-taxi.jpg",
    seats: 4,
    luggage: 2,
    rating: 4.8,
    reviews: 145,
    features: ["Air Conditioning", "Power Steering", "Automatic"],
  },
  {
    id: 2,
    name: "Toyota Prius",
    category: "Budget",
    price: 3500,
    image: "/toyota-prius-hybrid-taxi.jpg",
    seats: 4,
    luggage: 2,
    rating: 4.6,
    reviews: 89,
    features: ["Eco-Friendly", "Air Conditioning", "Manual"],
  },
  {
    id: 3,
    name: "Honda Civic",
    category: "Comfort",
    price: 6500,
    image: "/honda-civic-taxi-comfortable.jpg",
    seats: 4,
    luggage: 3,
    rating: 4.7,
    reviews: 156,
    features: ["Leather Seats", "Climate Control", "Automatic"],
  },
  {
    id: 4,
    name: "Toyota Prado",
    category: "Premium",
    price: 9500,
    image: "/toyota-prado-luxury-suv.jpg",
    seats: 7,
    luggage: 4,
    rating: 4.9,
    reviews: 203,
    features: ["Luxury Interior", "WiFi", "Premium Sound"],
  },
  {
    id: 5,
    name: "Hiace Van",
    category: "Van",
    price: 8500,
    image: "/hiace-van-group-transport.jpg",
    seats: 10,
    luggage: 6,
    rating: 4.5,
    reviews: 67,
    features: ["Spacious", "Air Conditioning", "Comfortable"],
  },
  {
    id: 6,
    name: "Suzuki Swift",
    category: "Budget",
    price: 4200,
    image: "/suzuki-swift-compact-car.jpg",
    seats: 4,
    luggage: 2,
    rating: 4.4,
    reviews: 112,
    features: ["Fuel Efficient", "Manual", "Compact"],
  },
  {
    id: 7,
    name: "Nissan X-Trail",
    category: "Premium",
    price: 10500,
    image: "/nissan-xtrail-premium-suv.jpg",
    seats: 5,
    luggage: 4,
    rating: 4.8,
    reviews: 178,
    features: ["All-Wheel Drive", "Panoramic Roof", "Leather Seats"],
  },
  {
    id: 8,
    name: "Toyota Fortuner",
    category: "Premium",
    price: 12500,
    image: "/toyota-fortuner-executive-suv.jpg",
    seats: 7,
    luggage: 5,
    rating: 4.9,
    reviews: 234,
    features: ["Executive Interior", "WiFi", "Premium Entertainment"],
  },
]

type SortOption = "price-low" | "price-high" | "rating" | "popularity"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([3500, 12500])
  const [sortBy, setSortBy] = useState<SortOption>("price-low")

  // Get search parameters
  const pickup = searchParams.get("pickup") || ""
  const dropoff = searchParams.get("dropoff") || ""
  const date = searchParams.get("date") || ""
  const passengers = searchParams.get("passengers") || "1"

  const filteredVehicles = useMemo(() => {
    let result = MOCK_VEHICLES

    // Filter by category
    if (selectedCategory) {
      result = result.filter((v) => v.category === selectedCategory)
    }

    // Filter by price range
    result = result.filter((v) => v.price >= priceRange[0] && v.price <= priceRange[1])

    // Filter by passenger count
    const passengerCount = Number.parseInt(passengers)
    result = result.filter((v) => v.seats >= passengerCount)

    // Sort
    switch (sortBy) {
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "popularity":
        result.sort((a, b) => b.reviews - a.reviews)
        break
      case "price-low":
      default:
        result.sort((a, b) => a.price - b.price)
    }

    return result
  }, [selectedCategory, priceRange, passengers, sortBy])

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Search Summary */}
      <section className="bg-primary/10 py-6 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Available Taxis</h1>
              <p className="text-muted-foreground">
                <span className="font-semibold">{pickup}</span> → <span className="font-semibold">{dropoff}</span> •{" "}
                {date} • {passengers} Passenger{passengers !== "1" ? "s" : ""}
              </p>
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
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-primary/10 ${
                          sortBy === option.value ? "bg-primary/10 text-primary font-semibold" : "text-foreground"
                        }`}
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
                  filteredVehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)
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
