"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { downloadReceipt } from "@/lib/utils/receipt-generator"
import { 
  CheckCircle, 
  Loader2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock,
  Download,
  Home,
  AlertCircle
} from "lucide-react"

function BookingSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(true)
  const [bookingData, setBookingData] = useState<any>(null)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [error, setError] = useState<string>("")

  const bookingId = searchParams.get('bookingId')
  const paymentMethod = searchParams.get('paymentMethod')
  const reference = searchParams.get('ref') || searchParams.get('reference')
  const status = searchParams.get('status')

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError("No booking ID provided")
        setIsLoading(false)
        return
      }

      try {
        console.log('🔍 Fetching booking details for ID:', bookingId)
        
        const bookingResponse = await fetch(`/api/bookings/${bookingId}`)
        const bookingResult = await bookingResponse.json()

        console.log('📦 Booking data received:', bookingResult)

        if (!bookingResult.success) {
          throw new Error(bookingResult.error || 'Failed to fetch booking')
        }

        setBookingData(bookingResult.data)

        if (reference) {
          const paymentResponse = await fetch(`/api/payments/by-reference/${reference}`)
          const paymentResult = await paymentResponse.json()

          if (paymentResult.success) {
            setPaymentData(paymentResult.data)
          }
        } else {
          const paymentResponse = await fetch(`/api/payments/by-booking/${bookingId}`)
          const paymentResult = await paymentResponse.json()

          if (paymentResult.success) {
            setPaymentData(paymentResult.data)
          }
        }

        setIsLoading(false)
      } catch (err: any) {
        console.error('❌ Error fetching booking:', err)
        setError(err.message || 'Failed to load booking details')
        setIsLoading(false)
      }
    }

    fetchBookingDetails()
  }, [bookingId, reference])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading booking details...</p>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  if (error || !bookingData) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-4">Booking Not Found</h1>
              <p className="text-muted-foreground mb-6">{error || 'Unable to load booking details'}</p>
              <Link href="/">
                <Button>
                  <Home className="mr-2" size={16} />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  const isPaid = 
    paymentMethod === 'online' || 
    status === 'paid' || 
    paymentData?.status === 'completed' ||
    paymentData?.status === 'paid' ||
    bookingData.payment_status === 'paid'

  const isPayLater = 
    paymentMethod === 'later' || 
    bookingData.payment_status === 'pending' ||
    bookingData.payment_status === 'unpaid'

  // Get the total price directly from booking data (this is the tier-calculated price)
  const totalPrice = parseFloat(bookingData.total_price) || 0
  const distance = parseFloat(bookingData.estimated_distance_km) || 0
  const effectiveRate = distance > 0 ? (totalPrice / distance) : 0

  console.log('💰 Price calculation:', {
    totalPrice,
    distance,
    effectiveRate,
    rawTotalPrice: bookingData.total_price
  })

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <CheckCircle size={80} className={isPaid ? "text-green-500" : "text-blue-500"} strokeWidth={1} />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {isPaid ? "Payment Successful!" : "Booking Confirmed!"}
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              {isPaid 
                ? "Your booking has been confirmed and payment received" 
                : "Your booking request has been submitted"}
            </p>
            <p className="text-sm text-muted-foreground">
              Booking Reference:{" "}
              <span className="font-mono font-bold text-foreground">
                {bookingData.booking_reference || `#${bookingId}`}
              </span>
            </p>
            {paymentData?.reference_number && (
              <p className="text-xs text-muted-foreground mt-2">
                Payment Reference: {paymentData.reference_number}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Status */}
              <Card className={`p-6 border-2 ${
                isPaid 
                  ? "border-green-200 bg-green-50 dark:bg-green-950/20" 
                  : "border-blue-200 bg-blue-50 dark:bg-blue-950/20"
              }`}>
                <div className="flex items-start gap-4">
                  <CheckCircle size={24} className={`${
                    isPaid ? "text-green-600" : "text-blue-600"
                  } flex-shrink-0 mt-1`} />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-foreground mb-2">
                      {isPaid ? "Payment Confirmed" : "Pending Payment"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {isPaid 
                        ? "Your payment has been processed successfully. A confirmation has been sent to your contact details."
                        : "Please pay cash to the driver when you travel. Our team will confirm your booking shortly."}
                    </p>
                    {paymentData && (
                      <div className="mt-3 text-xs text-muted-foreground">
                        <p>Transaction ID: {paymentData.onepay_transaction_id || 'N/A'}</p>
                        <p>Payment Date: {paymentData.created_at ? new Date(paymentData.created_at).toLocaleString() : 'N/A'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Trip Details */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Trip Details</h3>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <MapPin size={20} className="text-green-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">PICKUP</p>
                      <p className="font-semibold text-foreground mb-1">
                        {bookingData.pickup_location}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar size={16} />
                        {new Date(bookingData.pickup_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Clock size={16} />
                        {bookingData.pickup_time}
                      </div>
                    </div>
                  </div>

                  <div className="h-8 flex items-center">
                    <div className="w-1 h-full bg-border mx-2"></div>
                    <div className="flex-1 text-sm text-muted-foreground">
                      {distance.toFixed(1)} km • Tier-based pricing
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <MapPin size={20} className="text-red-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">DROPOFF</p>
                      <p className="font-semibold text-foreground">
                        {bookingData.dropoff_location}
                      </p>
                    </div>
                  </div>
                </div>

                {bookingData.special_requests && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm font-semibold text-muted-foreground mb-2">Special Requests</p>
                    <p className="text-foreground">{bookingData.special_requests}</p>
                  </div>
                )}
              </Card>

              {/* Contact Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Your Information</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-semibold">
                        {bookingData.full_name?.charAt(0) || 'C'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-semibold text-foreground">{bookingData.full_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Phone size={20} className="text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone Number</p>
                      <p className="font-semibold text-foreground">{bookingData.phone}</p>
                    </div>
                  </div>

                  {bookingData.email && bookingData.email !== 'customer@email.com' && (
                    <div className="flex items-center gap-4">
                      <Mail size={20} className="text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-semibold text-foreground">{bookingData.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-3">
              {/* Price Summary */}
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Price Summary</h3>

                <div className="space-y-3 mb-4 pb-4 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Journey Distance</span>
                    <span className="text-foreground font-medium">{distance.toFixed(1)} km</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Average Rate</span>
                    <span className="text-foreground font-medium">
                      Rs. {effectiveRate.toFixed(2)}/km
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                    💡 Tier-based pricing applied - you saved money on longer distances!
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-foreground">Total Fare</span>
                  <span className="text-2xl font-bold text-primary">
                    Rs. {Math.round(totalPrice).toLocaleString()}
                  </span>
                </div>

                <div className={`p-3 rounded text-center ${
                  isPaid 
                    ? "bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-900" 
                    : "bg-orange-50 border border-orange-200 dark:bg-orange-950/20 dark:border-orange-900"
                }`}>
                  <p className={`text-xs font-semibold ${
                    isPaid ? "text-green-900 dark:text-green-100" : "text-orange-900 dark:text-orange-100"
                  }`}>
                    {isPaid ? "✓ Payment Completed" : "⏱ Pay on Trip"}
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => downloadReceipt(bookingData, paymentData)}
                >
                  <Download className="mr-2" size={16} />
                  Download Receipt
                </Button>
              </Card>

              {/* Next Steps */}
              <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                <h3 className="font-semibold text-foreground mb-3">Next Steps</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">1.</span>
                    <span>Check your email for booking confirmation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">2.</span>
                    <span>Our driver will contact you before pickup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">3.</span>
                    <span>{isPaid ? "Enjoy your journey!" : "Have cash ready for the driver"}</span>
                  </li>
                </ul>
              </Card>

              {/* Support */}
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-3">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Contact our 24/7 support team
                </p>
                <div className="space-y-2">
                  <a href="tel:+94777850529" className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Phone size={16} />
                    +94 77 785 0529
                  </a>
                  <a href="mailto:sritaxi@gmail.com" className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Mail size={16} />
                    sritaxi@gmail.com
                  </a>
                </div>
              </Card>

              {/* Back Home Button */}
              <Link href="/">
                <Button className="w-full" variant="default">
                  <Home className="mr-2" size={16} />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </main>
    }>
      <BookingSuccessContent />
    </Suspense>
  )
}
