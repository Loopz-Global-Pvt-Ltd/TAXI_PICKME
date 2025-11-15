"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, MapPin, Calendar, Users, Phone, Mail, User } from "lucide-react"

// Mock vehicle data (same as in search page)
const MOCK_VEHICLES = [
  {
    id: 1,
    name: "Toyota Corolla",
    category: "Economy",
    price: 5500,
    image: "/placeholder.svg?key=mpvw6",
    seats: 4,
    luggage: 2,
    rating: 4.8,
    reviews: 145,
    features: ["Air Conditioning", "Power Steering", "Automatic"],
    description: "Comfortable and reliable economy sedan perfect for airport transfers and city tours.",
  },
  {
    id: 2,
    name: "Toyota Prius",
    category: "Budget",
    price: 3500,
    image: "/placeholder.svg?key=m7ius",
    seats: 4,
    luggage: 2,
    rating: 4.6,
    reviews: 89,
    features: ["Eco-Friendly", "Air Conditioning", "Manual"],
    description: "Eco-friendly hybrid vehicle with excellent fuel efficiency.",
  },
  {
    id: 3,
    name: "Honda Civic",
    category: "Comfort",
    price: 6500,
    image: "/placeholder.svg?key=za5un",
    seats: 4,
    luggage: 3,
    rating: 4.7,
    reviews: 156,
    features: ["Leather Seats", "Climate Control", "Automatic"],
    description: "Premium comfort sedan with advanced features and smooth ride quality.",
  },
  {
    id: 4,
    name: "Toyota Prado",
    category: "Premium",
    price: 9500,
    image: "/placeholder.svg?key=j3zqq",
    seats: 7,
    luggage: 4,
    rating: 4.9,
    reviews: 203,
    features: ["Luxury Interior", "WiFi", "Premium Sound"],
    description: "Executive luxury SUV perfect for business and premium travel experiences.",
  },
  {
    id: 5,
    name: "Hiace Van",
    category: "Van",
    price: 8500,
    image: "/placeholder.svg?key=pxuvy",
    seats: 10,
    luggage: 6,
    rating: 4.5,
    reviews: 67,
    features: ["Spacious", "Air Conditioning", "Comfortable"],
    description: "Large capacity van ideal for group tours and family travel.",
  },
  {
    id: 6,
    name: "Suzuki Swift",
    category: "Budget",
    price: 4200,
    image: "/placeholder.svg?key=f0jzp",
    seats: 4,
    luggage: 2,
    rating: 4.4,
    reviews: 112,
    features: ["Fuel Efficient", "Manual", "Compact"],
    description: "Compact and fuel-efficient vehicle perfect for budget travelers.",
  },
  {
    id: 7,
    name: "Nissan X-Trail",
    category: "Premium",
    price: 10500,
    image: "/placeholder.svg?key=u9ye9",
    seats: 5,
    luggage: 4,
    rating: 4.8,
    reviews: 178,
    features: ["All-Wheel Drive", "Panoramic Roof", "Leather Seats"],
    description: "Premium SUV with all-wheel drive capabilities and luxury features.",
  },
  {
    id: 8,
    name: "Toyota Fortuner",
    category: "Premium",
    price: 12500,
    image: "/placeholder.svg?key=5hboi",
    seats: 7,
    luggage: 5,
    rating: 4.9,
    reviews: 234,
    features: ["Executive Interior", "WiFi", "Premium Entertainment"],
    description: "Top-tier executive SUV with premium amenities and maximum comfort.",
  },
]

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const vehicleId = Number.parseInt(params.id as string)

  const vehicle = MOCK_VEHICLES.find((v) => v.id === vehicleId)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    pickupDate: "",
    pickupTime: "",
    pickupLocation: "",
    dropoffLocation: "",
    numberOfDays: "1",
    specialRequests: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Store booking data in localStorage for demonstration
      localStorage.setItem(
        "bookingData",
        JSON.stringify({
          vehicle,
          ...formData,
          totalPrice: vehicle ? vehicle.price * Number.parseInt(formData.numberOfDays) : 0,
        }),
      )
      router.push("/payment")
    }, 1500)
  }

  if (!vehicle) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-foreground mb-4">Vehicle Not Found</h1>
              <p className="text-muted-foreground mb-6">The vehicle you're looking for doesn't exist.</p>
              <Link href="/search">
                <Button>Back to Search</Button>
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  const totalPrice = vehicle.price * Number.parseInt(formData.numberOfDays)

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/search" className="text-primary hover:underline text-sm mb-6 inline-block">
            ← Back to Search
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Vehicle Details */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <div className="relative w-full h-64 bg-muted">
                  <Image src={vehicle.image || "/placeholder.svg"} alt={vehicle.name} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">{vehicle.name}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{vehicle.category}</p>
                  <p className="text-foreground text-sm mb-6">{vehicle.description}</p>

                  {/* Features */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-3">Features</h3>
                    <div className="space-y-2">
                      {vehicle.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-foreground">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Seats</p>
                      <p className="text-lg font-semibold text-foreground">{vehicle.seats}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Luggage</p>
                      <p className="text-lg font-semibold text-foreground">{vehicle.luggage}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Customer Rating</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">{vehicle.rating}</span>
                      <span className="text-xs text-muted-foreground">({vehicle.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Price Summary */}
              <Card className="p-6 mt-6">
                <h3 className="font-semibold text-foreground mb-4">Price Summary</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Daily Rate</span>
                    <span className="text-foreground font-semibold">Rs. {vehicle.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Number of Days</span>
                    <span className="text-foreground font-semibold">{formData.numberOfDays}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold text-foreground">Total Price</span>
                    <span className="text-2xl font-bold text-primary">Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">*Prices are inclusive of fuel and insurance</p>
              </Card>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Booking Details</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Trip Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <MapPin size={20} className="text-primary" />
                      Trip Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="pickupLocation" className="text-sm font-medium text-foreground">
                          Pickup Location
                        </Label>
                        <Input
                          id="pickupLocation"
                          name="pickupLocation"
                          value={formData.pickupLocation}
                          onChange={handleChange}
                          placeholder="Enter pickup location"
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dropoffLocation" className="text-sm font-medium text-foreground">
                          Dropoff Location
                        </Label>
                        <Input
                          id="dropoffLocation"
                          name="dropoffLocation"
                          value={formData.dropoffLocation}
                          onChange={handleChange}
                          placeholder="Enter dropoff location"
                          required
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Calendar size={20} className="text-primary" />
                      Date & Time
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pickupDate" className="text-sm font-medium text-foreground">
                          Pickup Date
                        </Label>
                        <Input
                          id="pickupDate"
                          name="pickupDate"
                          type="date"
                          value={formData.pickupDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split("T")[0]}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pickupTime" className="text-sm font-medium text-foreground">
                          Pickup Time
                        </Label>
                        <Input
                          id="pickupTime"
                          name="pickupTime"
                          type="time"
                          value={formData.pickupTime}
                          onChange={handleChange}
                          required
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <Label
                      htmlFor="numberOfDays"
                      className="text-sm font-medium text-foreground flex items-center gap-2"
                    >
                      <Users size={16} className="text-primary" />
                      Duration (Number of Days)
                    </Label>
                    <select
                      id="numberOfDays"
                      name="numberOfDays"
                      value={formData.numberOfDays}
                      onChange={handleChange}
                      className="w-full mt-2 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground bg-background"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 10, 14, 21, 30].map((day) => (
                        <option key={day} value={day}>
                          {day} Day{day > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Passenger Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <User size={20} className="text-primary" />
                      Passenger Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                          Full Name
                        </Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                          className="mt-2"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="email"
                            className="text-sm font-medium text-foreground flex items-center gap-2"
                          >
                            <Mail size={16} />
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            required
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="phone"
                            className="text-sm font-medium text-foreground flex items-center gap-2"
                          >
                            <Phone size={16} />
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+94 (WhatsApp enabled)"
                            required
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <Label htmlFor="specialRequests" className="text-sm font-medium text-foreground">
                      Special Requests (Optional)
                    </Label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      placeholder="Any special requirements or requests? (e.g., baby seat, extra luggage, specific route)"
                      rows={4}
                      className="w-full mt-2 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground bg-background resize-none"
                    />
                  </div>

                  {/* Terms Agreement */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg flex gap-3">
                    <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      By proceeding, you agree to our terms and conditions, cancellation policy, and privacy policy.
                      You'll receive a confirmation email with booking details.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-lg"
                  >
                    {isSubmitting ? "Processing..." : "Continue to Payment"}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
