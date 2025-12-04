"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
  const reference = searchParams.get('reference')
  const status = searchParams.get('status')

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError("No booking ID provided")
        setIsLoading(false)
        return
      }

      try {
        // Fetch booking details
        const bookingResponse = await fetch(`/api/bookings/${bookingId}`)
        const bookingResult = await bookingResponse.json()

        if (!bookingResult.success) {
          throw new Error(bookingResult.error || 'Failed to fetch booking')
        }

        setBookingData(bookingResult.data)

        // Try to fetch payment details for this booking
        // First try by reference if provided
        if (reference) {
          const paymentResponse = await fetch(`/api/payments/by-reference/${reference}`)
          const paymentResult = await paymentResponse.json()

          if (paymentResult.success) {
            setPaymentData(paymentResult.data)
          }
        } else {
          // If no reference, fetch by booking ID
          const paymentResponse = await fetch(`/api/payments/by-booking/${bookingId}`)
          const paymentResult = await paymentResponse.json()

          if (paymentResult.success) {
            setPaymentData(paymentResult.data)
          }
        }

        setIsLoading(false)
      } catch (err: any) {
        console.error('Error fetching booking:', err)
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

  // Determine payment status
  const isPaid = 
    paymentMethod === 'online' || 
    status === 'paid' || 
    paymentData?.status === 'completed' ||
    paymentData?.status === 'paid' ||
    bookingData.payment_status === 'paid'

  const isPayLater = 
    paymentMethod === 'later' || 
    bookingData.payment_status === 'pending'

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
                  {/* Pickup */}
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

                  {/* Divider */}
                  <div className="h-8 flex items-center">
                    <div className="w-1 h-full bg-border mx-2"></div>
                    <div className="flex-1 text-sm text-muted-foreground">
                      {bookingData.estimated_distance_km} km
                    </div>
                  </div>

                  {/* Dropoff */}
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

                  {bookingData.email && (
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
            <div className="lg:col-span-1 space-y-6">
              {/* Price Summary */}
              {bookingData.total_price && (
                <Card className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Price Summary</h3>

                  <div className="space-y-3 mb-4 pb-4 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Distance</span>
                      <span className="text-foreground">{bookingData.estimated_distance_km} km</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rate per km</span>
                      <span className="text-foreground">
                        Rs. {bookingData.estimated_distance_km > 0 
                          ? (bookingData.total_price / bookingData.estimated_distance_km).toFixed(2)
                          : '0.00'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      Rs. {Number(bookingData.total_price).toLocaleString()}
                    </span>
                  </div>

                  <div className={`p-3 rounded text-center ${
                    isPaid 
                      ? "bg-green-50 border border-green-200" 
                      : "bg-orange-50 border border-orange-200"
                  }`}>
                    <p className={`text-xs font-semibold ${
                      isPaid ? "text-green-900" : "text-orange-900"
                    }`}>
                      {isPaid ? "Payment Completed" : "Pay on Trip"}
                    </p>
                  </div>
                </Card>
              )}

              {/* Next Steps */}
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">What's Next?</h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <span className="text-foreground pt-0.5">
                      {isPaid 
                        ? "Booking confirmed - check your contact details" 
                        : "Wait for booking confirmation"}
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span className="text-foreground pt-0.5">
                      Driver will contact you 30 mins before pickup
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <span className="text-foreground pt-0.5">
                      {isPayLater ? "Pay cash to driver on trip" : "Enjoy your ride!"}
                    </span>
                  </li>
                </ol>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Link href="/" className="block">
                  <Button className="w-full" variant="default">
                    <Home className="mr-2" size={16} />
                    Back to Home
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={async () => {
                    try {
                      const response = await fetch(`/api/bookings/${bookingId}/receipt`)
                      
                      if (!response.ok) {
                        throw new Error('Failed to generate receipt')
                      }
                      
                      const blob = await response.blob()
                      
                      if (blob.size === 0) {
                        throw new Error('Empty PDF file received')
                      }
                      
                      const url = window.URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `receipt-${bookingData.booking_reference || bookingId}.pdf`
                      document.body.appendChild(a)
                      a.click()
                      window.URL.revokeObjectURL(url)
                      document.body.removeChild(a)
                    } catch (error) {
                      console.error('Error downloading receipt:', error)
                      alert('Failed to download receipt. Please try again or contact support.')
                    }
                  }}
                >
                  <Download className="mr-2" size={16} />
                  Download Receipt
                </Button>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
            <div className="flex items-start gap-4">
              <AlertCircle size={24} className="text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  If you have any questions or need to make changes to your booking, please contact us:
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <a href="tel:+94777850529" className="flex items-center gap-2 text-primary hover:underline">
                    <Phone size={16} />
                    +94 777 850 529
                  </a>
                  <a href="mailto:info@taxipickme.com" className="flex items-center gap-2 text-primary hover:underline">
                    <Mail size={16} />
                    info@taxipickme.com
                  </a>
                </div>
              </div>
            </div>
          </Card>
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
