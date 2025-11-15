"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, Lock, CreditCard, Wallet, Smartphone } from "lucide-react"

interface BookingData {
  vehicle: {
    id: number
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

export default function PaymentPage() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardData, setCardData] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  useEffect(() => {
    const stored = localStorage.getItem("bookingData")
    if (stored) {
      try {
        setBookingData(JSON.parse(stored))
      } catch (error) {
        console.error("Failed to load booking data")
        router.push("/search")
      }
    } else {
      router.push("/search")
    }
  }, [router])

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, "").slice(0, 16)
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ")
    setCardData((prev) => ({ ...prev, cardNumber: value }))
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4)
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2)
    }
    setCardData((prev) => ({ ...prev, expiryDate: value }))
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3)
    setCardData((prev) => ({ ...prev, cvv: value }))
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      // Store confirmation data
      const confirmationNumber = `SLT${Date.now().toString().slice(-8)}`
      localStorage.setItem(
        "confirmationData",
        JSON.stringify({
          confirmationNumber,
          bookingData,
          paymentMethod,
          paymentDate: new Date().toISOString(),
        }),
      )
      router.push("/confirmation")
    }, 2000)
  }

  if (!bookingData) {
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/booking/1" className="text-primary hover:underline text-sm mb-6 inline-block">
            ← Back to Booking
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <Card className="p-6 md:p-8">
                <h1 className="text-3xl font-bold text-foreground mb-8">Payment</h1>

                {/* Payment Method Selection */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Select Payment Method</h2>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      {/* Credit/Debit Card */}
                      <div
                        className="flex items-center space-x-2 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-primary transition"
                        onClick={() => setPaymentMethod("card")}
                      >
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="cursor-pointer flex items-center gap-2 flex-1">
                          <CreditCard size={20} className="text-primary" />
                          <span>Credit/Debit Card</span>
                        </Label>
                      </div>

                      {/* Mobile Wallet */}
                      <div
                        className="flex items-center space-x-2 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-primary transition"
                        onClick={() => setPaymentMethod("wallet")}
                      >
                        <RadioGroupItem value="wallet" id="wallet" />
                        <Label htmlFor="wallet" className="cursor-pointer flex items-center gap-2 flex-1">
                          <Wallet size={20} className="text-primary" />
                          <span>Mobile Wallet</span>
                        </Label>
                      </div>

                      {/* Bank Transfer */}
                      <div
                        className="flex items-center space-x-2 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-primary transition"
                        onClick={() => setPaymentMethod("bank")}
                      >
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="cursor-pointer flex items-center gap-2 flex-1">
                          <Smartphone size={20} className="text-primary" />
                          <span>Bank Transfer</span>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Card Payment Form */}
                {paymentMethod === "card" && (
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="cardName" className="text-sm font-medium text-foreground">
                        Cardholder Name
                      </Label>
                      <Input
                        id="cardName"
                        value={cardData.cardName}
                        onChange={(e) => setCardData((prev) => ({ ...prev, cardName: e.target.value }))}
                        placeholder="John Doe"
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber" className="text-sm font-medium text-foreground">
                        Card Number
                      </Label>
                      <Input
                        id="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        required
                        maxLength={19}
                        className="mt-2 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate" className="text-sm font-medium text-foreground">
                          Expiry Date
                        </Label>
                        <Input
                          id="expiryDate"
                          value={cardData.expiryDate}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          required
                          className="mt-2 font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-sm font-medium text-foreground">
                          CVV
                        </Label>
                        <Input
                          id="cvv"
                          value={cardData.cvv}
                          onChange={handleCvvChange}
                          placeholder="123"
                          required
                          maxLength={3}
                          type="password"
                          className="mt-2 font-mono"
                        />
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg flex gap-3">
                      <Lock size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-green-900 dark:text-green-100">
                        Your payment information is secure and encrypted. We never store your full card details.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={
                        isProcessing ||
                        !cardData.cardNumber ||
                        !cardData.cardName ||
                        !cardData.expiryDate ||
                        !cardData.cvv
                      }
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-lg"
                    >
                      {isProcessing ? "Processing Payment..." : `Pay Rs. ${bookingData.totalPrice.toLocaleString()}`}
                    </Button>
                  </form>
                )}

                {/* Mobile Wallet Payment */}
                {paymentMethod === "wallet" && (
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <div className="p-6 bg-muted rounded-lg text-center">
                      <Wallet size={48} className="mx-auto text-primary mb-4" />
                      <p className="text-foreground font-semibold mb-2">Select Your Wallet</p>
                      <p className="text-sm text-muted-foreground mb-6">eZ Cash, Dialog iMi, or Mobitel Migs</p>
                      <div className="space-y-3">
                        {["eZ Cash", "Dialog iMi", "Mobitel Migs"].map((wallet) => (
                          <Button
                            key={wallet}
                            type="button"
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => setIsProcessing(true)}
                          >
                            {wallet}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-lg"
                    >
                      {isProcessing ? "Processing..." : `Proceed with Mobile Wallet`}
                    </Button>
                  </form>
                )}

                {/* Bank Transfer */}
                {paymentMethod === "bank" && (
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <div className="p-6 bg-muted rounded-lg">
                      <h3 className="font-semibold text-foreground mb-4">Bank Transfer Details</h3>
                      <div className="space-y-3 text-sm mb-6">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bank Name:</span>
                          <span className="text-foreground font-semibold">Commercial Bank of Ceylon</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account Holder:</span>
                          <span className="text-foreground font-semibold">Sri Lanka Taxi Service</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account Number:</span>
                          <span className="text-foreground font-mono font-semibold">1234567890</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Routing Number:</span>
                          <span className="text-foreground font-mono font-semibold">123456</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reference:</span>
                          <span className="text-foreground font-mono font-semibold">
                            REF-{Date.now().toString().slice(-8)}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg flex gap-3">
                        <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-900 dark:text-blue-100">
                          Please include your reference number in the transfer description. Your booking will be
                          confirmed within 2 hours of payment.
                        </p>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-lg"
                    >
                      {isProcessing ? "Processing..." : "Confirm Bank Transfer"}
                    </Button>
                  </form>
                )}
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

                {/* Vehicle Info */}
                <div className="mb-6 pb-6 border-b border-border">
                  <p className="text-sm text-muted-foreground mb-2">Vehicle</p>
                  <p className="font-semibold text-foreground">{bookingData.vehicle.name}</p>
                  <p className="text-xs text-muted-foreground">{bookingData.vehicle.category}</p>
                </div>

                {/* Trip Details */}
                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Pickup</p>
                    <p className="text-sm font-semibold text-foreground">{bookingData.pickupLocation}</p>
                    <p className="text-xs text-muted-foreground">
                      {bookingData.pickupDate} at {bookingData.pickupTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Dropoff</p>
                    <p className="text-sm font-semibold text-foreground">{bookingData.dropoffLocation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Duration</p>
                    <p className="text-sm font-semibold text-foreground">
                      {bookingData.numberOfDays} Day{Number.parseInt(bookingData.numberOfDays) > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Daily Rate</span>
                    <span className="text-foreground">Rs. {bookingData.vehicle.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Number of Days</span>
                    <span className="text-foreground">×{bookingData.numberOfDays}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Insurance</span>
                    <span className="text-foreground">Included</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-foreground font-semibold">Total Amount</span>
                  <span className="text-3xl font-bold text-primary">Rs. {bookingData.totalPrice.toLocaleString()}</span>
                </div>

                <p className="text-xs text-muted-foreground text-center">*Fuel and insurance included</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
