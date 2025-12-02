"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Download, Mail, Phone, MapPin, Calendar, Clock } from "lucide-react"

interface ConfirmationData {
  confirmationNumber: string
  bookingData: {
    vehicle: {
      name: string
      price: number
      category: string
    }
    fullName: string
    email: string
    phone: string
    pickupDate: string
    pickupTime: string
    pickupLocation: string
    dropoffLocation: string
    numberOfDays: string
    specialRequests: string
    totalPrice: number
  }
  paymentMethod: string
  paymentDate: string
}

export default function ConfirmationPage() {
  const router = useRouter()
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("confirmationData")
    if (stored) {
      try {
        setConfirmationData(JSON.parse(stored))
      } catch (error) {
        console.error("Failed to load confirmation data")
        router.push("/search")
      }
    } else {
      router.push("/search")
    }
  }, [router])

  const handleDownloadReceipt = () => {
    if (!confirmationData) return

    const receiptContent = `
BOOKING CONFIRMATION

Confirmation Number: ${confirmationData.confirmationNumber}
Date: ${new Date(confirmationData.paymentDate).toLocaleDateString()}

VEHICLE DETAILS
Name: ${confirmationData.bookingData.vehicle.name}
Category: ${confirmationData.bookingData.vehicle.category}

PASSENGER INFORMATION
Name: ${confirmationData.bookingData.fullName}
Email: ${confirmationData.bookingData.email}
Phone: ${confirmationData.bookingData.phone}

TRIP DETAILS
Pickup Location: ${confirmationData.bookingData.pickupLocation}
Pickup Date & Time: ${confirmationData.bookingData.pickupDate} at ${confirmationData.bookingData.pickupTime}
Dropoff Location: ${confirmationData.bookingData.dropoffLocation}
Duration: ${confirmationData.bookingData.numberOfDays} days

SPECIAL REQUESTS
${confirmationData.bookingData.specialRequests || "None"}

PAYMENT INFORMATION
Payment Method: ${confirmationData.paymentMethod}
Total Amount: Rs. ${confirmationData.bookingData.totalPrice.toLocaleString()}
Status: CONFIRMED

Thank you for booking with Sri Lanka Taxi Service!
    `

    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(receiptContent))
    element.setAttribute("download", `booking-${confirmationData.confirmationNumber}.txt`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (!confirmationData) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-center text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <CheckCircle size={80} className="text-green-500" strokeWidth={1} />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
            <p className="text-xl text-muted-foreground mb-4">Your ride has been successfully booked</p>
            <p className="text-sm text-muted-foreground">
              Confirmation number:{" "}
              <span className="font-mono font-bold text-foreground">{confirmationData.confirmationNumber}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Confirmation Details */}
            <div className="lg:col-span-2">
              {/* Vehicle Confirmed */}
              <Card className="p-6 mb-6 border-2 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20">
                <div className="flex items-start gap-4">
                  <CheckCircle size={24} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-2">
                      {confirmationData.bookingData.vehicle.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {confirmationData.bookingData.vehicle.category} • Professional Driver • Fully Insured
                    </p>
                  </div>
                </div>
              </Card>

              {/* Trip Details */}
              <Card className="p-6 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Trip Details</h3>

                <div className="space-y-6">
                  {/* Pickup */}
                  <div className="flex gap-4">
                    <MapPin size={20} className="text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">PICKUP</p>
                      <p className="font-semibold text-foreground mb-1">
                        {confirmationData.bookingData.pickupLocation}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar size={16} />
                        {confirmationData.bookingData.pickupDate}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Clock size={16} />
                        {confirmationData.bookingData.pickupTime}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-8 flex items-center">
                    <div className="w-1 h-full bg-border mx-auto"></div>
                  </div>

                  {/* Dropoff */}
                  <div className="flex gap-4">
                    <MapPin size={20} className="text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">DROPOFF</p>
                      <p className="font-semibold text-foreground">{confirmationData.bookingData.dropoffLocation}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Duration: {confirmationData.bookingData.numberOfDays} day
                        {Number.parseInt(confirmationData.bookingData.numberOfDays) > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Passenger Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Passenger Information</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-semibold">
                        {confirmationData.bookingData.fullName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                      <p className="font-semibold text-foreground">{confirmationData.bookingData.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Mail size={20} className="text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-semibold text-foreground">{confirmationData.bookingData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Phone size={20} className="text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                      <p className="font-semibold text-foreground">{confirmationData.bookingData.phone}</p>
                    </div>
                  </div>
                </div>

                {confirmationData.bookingData.specialRequests && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Special Requests</p>
                    <p className="text-foreground">{confirmationData.bookingData.specialRequests}</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Price Summary */}
              <Card className="p-6 mb-6">
                <h3 className="font-semibold text-foreground mb-6">Price Summary</h3>

                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Daily Rate</span>
                    <span className="text-foreground">
                      Rs. {confirmationData.bookingData.vehicle.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Days</span>
                    <span className="text-foreground">×{confirmationData.bookingData.numberOfDays}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Insurance</span>
                    <span className="text-foreground">Included</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="font-semibold text-foreground">Total Paid</span>
                  <span className="text-2xl font-bold text-primary">
                    Rs. {confirmationData.bookingData.totalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded text-center">
                  <p className="text-xs font-semibold text-green-900 dark:text-green-100">Payment Confirmed</p>
                </div>
              </Card>

              {/* Next Steps */}
              <Card className="p-6 mb-6">
                <h3 className="font-semibold text-foreground mb-4">What's Next?</h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <span className="text-foreground pt-0.5">Confirmation sent to your email</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span className="text-foreground pt-0.5">Driver will contact you 30 mins before pickup</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <span className="text-foreground pt-0.5">Enjoy your ride with professional service</span>
                  </li>
                </ol>
              </Card>

              {/* Download Receipt */}
              <Button
                onClick={handleDownloadReceipt}
                variant="outline"
                className="w-full mb-3 flex items-center justify-center gap-2 bg-transparent"
              >
                <Download size={16} />
                Download Receipt
              </Button>

              {/* Home Button */}
              <Link href="/" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
