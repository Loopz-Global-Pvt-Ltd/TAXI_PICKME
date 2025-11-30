"use client"

import type React from "react"

import { useState , useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/Header"
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

  const [tripData, setTripData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    pickupTime: "",
    estimatedDistanceKm: "",
    numberOfDays: "1"
  })

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialRequests: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Get trip data from URL params
    const searchParams = new URLSearchParams(window.location.search)
    const urlDistance = searchParams.get('estimatedDistance')
    const urlPickup = searchParams.get('pickup')
    const urlDropoff = searchParams.get('dropoff')
    const urlDate = searchParams.get('date')
    const urlTime = searchParams.get('time')
    const urlDays = searchParams.get('days')
  
    setTripData({
      estimatedDistanceKm: urlDistance || "",
      pickupLocation: urlPickup || "",
      dropoffLocation: urlDropoff || "",
      pickupDate: urlDate || "",
      pickupTime: urlTime || "",
      numberOfDays: urlDays || "1"
    })
  }, [])

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

    // Simulate API call and then redirect to payment gateway
    setTimeout(() => {
      // Store booking data in localStorage
      const bookingData = {
        vehicle,
        ...tripData,
        ...formData,
        totalPrice: vehicle ? vehicle.price * Number.parseInt(tripData.numberOfDays) : 0,
      }
      localStorage.setItem("bookingData", JSON.stringify(bookingData))
      
      // TODO: Redirect to OnePay payment gateway
      // For now, show alert
      alert('Payment gateway integration pending. Booking data saved.')
      setIsSubmitting(false)
      
      // router.push("https://onepay-gateway-url.com/checkout")
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
              <Link href="/">
                <Button>Back to Search</Button>
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  const totalPrice = vehicle.price * Number.parseInt(tripData.numberOfDays)

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-primary hover:underline text-sm mb-6 inline-block">
            ← Back to Search
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

                {/* Vehicle Info */}
                <div className="mb-6 pb-6 border-b border-border">
                  <div className="relative w-full h-40 bg-muted rounded-lg mb-4 overflow-hidden">
                    <Image src={vehicle.image || "/placeholder.svg"} alt={vehicle.name} fill className="object-cover" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Vehicle</p>
                  <p className="font-semibold text-foreground">{vehicle.name}</p>
                  <p className="text-xs text-muted-foreground">{vehicle.category}</p>
                  
                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-2 mt-3 p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Seats</p>
                      <p className="text-sm font-semibold text-foreground">{vehicle.seats}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Luggage</p>
                      <p className="text-sm font-semibold text-foreground">{vehicle.luggage}</p>
                    </div>
                  </div>
                </div>


              </Card>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card className="mb-8 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Booking Details</h2>
                {/* Trip Details */}
                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MapPin size={12} />
                      Pickup
                    </p>
                    <p className="text-sm font-semibold text-foreground">{tripData.pickupLocation || "Not specified"}</p>
                    <p className="text-xs text-muted-foreground">
                      {tripData.pickupDate && tripData.pickupTime 
                        ? `${tripData.pickupDate} at ${tripData.pickupTime}` 
                        : "Date & time not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MapPin size={12} />
                      Dropoff
                    </p>
                    <p className="text-sm font-semibold text-foreground">{tripData.dropoffLocation || "Not specified"}</p>
                  </div>
                  {tripData.estimatedDistanceKm && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Estimated Distance</p>
                      <p className="text-sm font-semibold text-foreground">{tripData.estimatedDistanceKm} km</p>
                    </div>
                  )}
                </div>


                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-foreground font-semibold">Total Amount</span>
                  <span className="text-3xl font-bold text-primary">Rs. {totalPrice.toLocaleString()}</span>
                </div>

                {/* Rating */}
                {/* <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Customer Rating</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">{vehicle.rating}</span>
                    <span className="text-xs text-muted-foreground">({vehicle.reviews} reviews)</span>
                  </div>
                </div> */}
              </Card>
              <Card className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Customer Details</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Need to change trip details? <Link href="/" className="text-primary hover:underline">Go back to search</Link>
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Passenger Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <User size={20} className="text-primary" />
                      Passenger Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                          Full Name *
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
                            htmlFor="phone"
                            className="text-sm font-medium text-foreground flex items-center gap-2"
                          >
                            <Phone size={16} />
                            Phone Number (WhatsApp) *
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+94 XX XXX XXXX"
                            required
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="email"
                            className="text-sm font-medium text-foreground flex items-center gap-2"
                          >
                            <Mail size={16} />
                            Email Address (Optional)
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
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
                      You'll receive a confirmation via WhatsApp with booking details.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-lg"
                  >
                    {isSubmitting ? "Processing..." : "Proceed to Payment"}
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