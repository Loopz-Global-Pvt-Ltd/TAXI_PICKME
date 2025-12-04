"use client"

import { useState, useRef } from 'react'
import { Loader2, CreditCard, Wallet, ExternalLink } from 'lucide-react'

interface OnePayButtonProps {
  bookingId: number
  amount: number
  customerData: {
    firstName: string
    lastName: string
    phone: string
    email: string
  }
  onSuccess?: (data: any) => void
  onFail?: (data: any) => void
  onPayLater?: () => void
}

export default function OnePayButton({
  bookingId,
  amount,
  customerData,
  onPayLater,
}: OnePayButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'later' | null>(null)
  const initializingRef = useRef(false)

  const initializeOnlinePayment = async () => {
    if (initializingRef.current) {
      console.log('Payment already initializing, skipping...')
      return
    }

    initializingRef.current = true
    setIsLoading(true)

    try {
      // Create payment via API
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          amount,
          customerData,
          redirectUrl: `${window.location.origin}/booking/success?bookingId=${bookingId}`,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment')
      }

      console.log('Payment created successfully:', data)

      // Redirect to OnePay payment page
      const redirectUrl = data.data.onepay.gateway.redirect_url
      window.location.href = redirectUrl
    } catch (error: any) {
      console.error('Payment initialization error:', error)
      alert(error.message || 'Failed to initialize payment')
      setIsLoading(false)
      initializingRef.current = false
    }
  }

  const handlePayLater = () => {
    if (onPayLater) {
      onPayLater()
    } else {
      window.location.href = `/booking/success?bookingId=${bookingId}&paymentMethod=later`
    }
  }

  return (
    <div className="space-y-4">
      {!paymentMethod && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Choose Payment Method</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pay Now Option */}
            <button
              onClick={() => {
                setPaymentMethod('online')
                initializeOnlinePayment()
              }}
              disabled={isLoading}
              className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors">
                  <CreditCard className="text-green-600 group-hover:text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">Pay Now (Online)</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Secure online payment via OnePay
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Instant Confirmation</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Secure Payment Gateway</span>
                  </div>
                </div>
              </div>
            </button>

            {/* Pay Later Option */}
            <button
              onClick={() => {
                setPaymentMethod('later')
                handlePayLater()
              }}
              disabled={isLoading}
              className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                  <Wallet className="text-blue-600 group-hover:text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">Pay at Trip</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Pay cash to the driver when you travel
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">No Upfront Payment</span>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Cash Only</span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Pay Now option provides instant booking confirmation. Pay at Trip bookings will be confirmed after driver accepts.
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {paymentMethod === 'online' && isLoading && (
        <div className="flex flex-col items-center justify-center p-8 bg-green-50 rounded-lg border-2 border-green-200">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mb-4" />
          <p className="text-gray-900 font-semibold text-lg">Redirecting to secure payment...</p>
          <p className="text-sm text-gray-600 mt-2">Please wait while we prepare your payment</p>
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
            <ExternalLink size={14} />
            <span>You'll be redirected to OnePay payment gateway</span>
          </div>
        </div>
      )}
    </div>
  )
}
