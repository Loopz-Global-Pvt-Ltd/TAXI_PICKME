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
import OnePayButton from "@/components/payment/OnePayButton"
import { AlertCircle, MapPin, Calendar, Users, Phone, Mail, User, Loader2, CheckCircle, Navigation} from "lucide-react"

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
  is_available: boolean
  fuel_type: string
  transmission: string
}

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const vehicleId = Number.parseInt(params.id as string)

  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [isLoadingVehicle, setIsLoadingVehicle] = useState(true)

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
  const [bookingId, setBookingId] = useState<number | null>(null)
  const [bookingCreated, setBookingCreated] = useState(false)
  const [error, setError] = useState("")

  // Fetch vehicle data
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`/api/vehicles/${vehicleId}`)
        const data = await response.json()

        if (data.success) {
          setVehicle({
            ...data.data,
            price_per_km: Number(data.data.price_per_km),
            rating: Number(data.data.rating)
          })
        } else {
          setError('Vehicle not found')
        }
      } catch (err) {
        console.error('Error fetching vehicle:', err)
        setError('Failed to load vehicle details')
      } finally {
        setIsLoadingVehicle(false)
      }
    }

    if (vehicleId) {
      fetchVehicle()
    }
  }, [vehicleId])

  // Get trip data from URL params
  useEffect(() => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      if (!vehicle) {
        throw new Error("Vehicle not found")
      }

      // Calculate total price based on distance
      const distanceKm = parseFloat(tripData.estimatedDistanceKm) || 0
      const totalPrice = vehicle.price_per_km * distanceKm

      // Create booking via API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          fullName: formData.fullName,
          email: formData.email || 'customer@email.com',
          phone: formData.phone,
          pickupLocation: tripData.pickupLocation,
          dropoffLocation: tripData.dropoffLocation,
          pickupDate: tripData.pickupDate,
          pickupTime: tripData.pickupTime,
          estimatedDistanceKm: distanceKm,
          specialRequests: formData.specialRequests,

        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create booking')
      }

      // Set booking ID and show payment button
      setBookingId(data.data.id)
      setBookingCreated(true)

      console.log('Booking created successfully:', data.data)
    } catch (err: any) {
      console.error('Booking error:', err)
      setError(err.message || 'Failed to create booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('Payment successful:', paymentData)
    router.push(`/booking/success?ref=${paymentData.transaction_id || bookingId}&status=paid`)
  }

  const handlePaymentFail = (failData: any) => {
    console.log('Payment failed:', failData)
    setError('Payment failed. Please try again.')
  }

  const handlePayLater = async () => {
    try {
      // Update booking to pay later status
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_status: 'pending',
          payment_method: 'cash',
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push(`/booking/success?bookingId=${bookingId}&paymentMethod=later`)
      } else {
        throw new Error(data.error || 'Failed to update booking')
      }
    } catch (error: any) {
      console.error('Pay later error:', error)
      setError(error.message || 'Failed to process pay later option')
    }
  }

  // Loading state
  if (isLoadingVehicle) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading vehicle details...</p>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  // Vehicle not found
  if (!vehicle) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-foreground mb-4">Vehicle Not Found</h1>
              <p className="text-muted-foreground mb-6">The vehicle you're looking for doesn't exist or is no longer available.</p>
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

  // Vehicle not available
  if (!vehicle.is_available) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-foreground mb-4">Vehicle Unavailable</h1>
              <p className="text-muted-foreground mb-6">This vehicle is currently not available for booking.</p>
              <Link href="/">
                <Button>Browse Other Vehicles</Button>
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  const distanceKm = parseFloat(tripData.estimatedDistanceKm) || 0
  const totalPrice = vehicle.price_per_km * distanceKm

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
                    {vehicle.image ? (
                      <Image src={vehicle.image} alt={vehicle.name} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Card className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Vehicle</p>
                  <p className="font-semibold text-foreground">{vehicle.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{vehicle.category}</p>
                  
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

                {/* Booking Status */}
                {bookingCreated && (
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg flex gap-3 mb-4">
                    <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-900 dark:text-green-100">Booking Created!</p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        Proceed with payment to confirm your booking.
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card className="mb-8 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Booking Details</h2>
                
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2 mb-4">
                  <Navigation className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Route Information</h3>
                  </div>
                  <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Pickup Location</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{tripData.pickupLocation || "Not specified"}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                      {tripData.pickupDate && tripData.pickupTime 
                      ? `${tripData.pickupDate} at ${tripData.pickupTime}` 
                      : "Date & time not specified"}
                    </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Dropoff Location</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{tripData.dropoffLocation || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-gray-400" />
                    <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Estimated Distance</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{distanceKm} km</p>
                    </div>
                  </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/*  Rate */}
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">Rate per KM</p>
                      <p className="text-xs text-muted-foreground capitalize">{vehicle.category} Vehicle</p>
                    </div>
                    <p className="text-lg font-semibold text-foreground">Rs. {Number(vehicle.price_per_km).toFixed(2)}</p>
                  </div>

                  {/* Distance */}
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">Estimated Distance</p>
                      <p className="text-xs text-muted-foreground">
                        {tripData.pickupLocation && tripData.dropoffLocation 
                          ? `${tripData.pickupLocation} → ${tripData.dropoffLocation}`
                          : "Route distance"}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-foreground">{distanceKm} km</p>
                  </div>

                  {/* Calculation */}
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">Subtotal</p>
                      <p className="text-xs text-muted-foreground">
                        Rs. {vehicle.price_per_km.toLocaleString()} × {distanceKm} km
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-foreground">Rs. {Number(totalPrice).toFixed(2)}</p>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <p className="text-lg font-bold text-foreground">Total Amount</p>
                      <p className="text-xs text-muted-foreground">All inclusive</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">Rs. {Number(totalPrice).toFixed(2)}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Customer Details</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Need to change trip details? <Link href="/" className="text-primary hover:underline">Go back to search</Link>
                </p>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg flex gap-3">
                    <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-900 dark:text-red-100">{error}</p>
                  </div>
                )}

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
                          disabled={bookingCreated}
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
                            disabled={bookingCreated}
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
                            disabled={bookingCreated}
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
                      disabled={bookingCreated}
                      className="w-full mt-2 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground bg-background resize-none disabled:opacity-50"
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

                  {/* Submit/Payment Buttons */}
                  {!bookingCreated ? (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creating Booking...
                        </>
                      ) : (
                        "Create Booking"
                      )}
                    </Button>
                  ) : bookingId ? (
                    <OnePayButton
                      bookingId={bookingId}
                      amount={totalPrice}
                      customerData={{
                        firstName: formData.fullName.split(' ')[0] || 'Customer',
                        lastName: formData.fullName.split(' ').slice(1).join(' ') || 'Name',
                        phone: formData.phone,
                        email: formData.email || 'customer@email.com',
                      }}
                      onSuccess={handlePaymentSuccess}
                      onFail={handlePaymentFail}
                      onPayLater={handlePayLater}
                    />
                  ) : null}
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