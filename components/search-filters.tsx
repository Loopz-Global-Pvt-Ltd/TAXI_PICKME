"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"

const CATEGORIES = ["Economy", "Sedan", "SUV", "Van", "Luxury"]

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
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="font-semibold text-foreground mb-4">Vehicle Type</h3>
        <div className="space-y-3">
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

      {/* <Card className="p-4">
        <h3 className="font-semibold text-foreground mb-4">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            min={3500}
            max={12500}
            step={500}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Rs. {priceRange[0].toLocaleString()}</span>
            <span>Rs. {priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </Card> */}

      <Card className="p-4">
        <h3 className="font-semibold text-foreground mb-4">Features</h3>
        <div className="space-y-3">
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

      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Apply Filters</Button>
    </div>
  )
}
