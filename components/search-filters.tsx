"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

const CATEGORIES = ["Mini", "Sedan", "SUV", "Van", "Luxury"]

interface SearchFiltersProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
}

export default function SearchFilters({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
}: SearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    vehicleType: false,
    features: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
  }

  const handleApplyFilters = () => {
    // Close all sections on mobile
    setExpandedSections({
      vehicleType: false,
      features: false,
    })
  }

  return (
    <div className="space-y-4">
      <Card className="p-3">
        <button
          onClick={() => toggleSection("vehicleType")}
          className="w-full flex items-center justify-between mb-1 md:cursor-default"
        >
          <h3 className="font-semibold text-foreground">Vehicle Type</h3>
          <ChevronDown
            className={`w-5 h-5 transition-transform md:hidden ${
              expandedSections.vehicleType ? "rotate-180" : ""
            }`}
          />
        </button>
        <div className={`space-y-3 ${expandedSections.vehicleType ? "block" : "hidden"} md:block`}>
          <div className="flex items-center gap-2">
            <Checkbox
              id="all-categories"
              checked={selectedCategory === ""}
              onCheckedChange={() => setSelectedCategory("")}
            />
            <label htmlFor="all-categories" className="text-sm text-foreground cursor-pointer">
              All Categories
            </label>
          </div>
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox
                id={category}
                checked={selectedCategory === category}
                onCheckedChange={() => setSelectedCategory(selectedCategory === category ? "" : category)}
              />
              <label htmlFor={category} className="text-sm text-foreground cursor-pointer">
                {category}
              </label>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-3">
        <button
          onClick={() => toggleSection("features")}
          className="w-full flex items-center justify-between mb-1 md:cursor-default"
        >
          <h3 className="font-semibold text-foreground">Features</h3>
          <ChevronDown
            className={`w-5 h-5 transition-transform md:hidden ${
              expandedSections.features ? "rotate-180" : ""
            }`}
          />
        </button>
        <div className={`space-y-3 ${expandedSections.features ? "block" : "hidden"} md:block`}>
          {["WiFi", "AC", "Phone Charger", "Leather Seats"].map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <Checkbox id={feature} />
              <label htmlFor={feature} className="text-sm text-foreground cursor-pointer">
                {feature}
              </label>
            </div>
          ))}
        </div>
      </Card>

      <Button 
        onClick={handleApplyFilters}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        Apply Filters
      </Button>
    </div>
  )
}
