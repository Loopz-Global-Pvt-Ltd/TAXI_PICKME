"use client"

import { useEffect, useState, useRef } from 'react'
import Script from 'next/script'
import { Loader2, CreditCard, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

declare global {
  interface Window {
    onePayData: any
  }
}

export default function OnePayButton({
  bookingId,
  amount,
  customerData,
  onSuccess,
  onFail,
  onPayLater,
}: OnePayButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentReference, setPaymentReference] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'later' | null>(null)
  const [scriptReady, setScriptReady] = useState(false)
  const initializingRef = useRef(false)
  const retryCountRef = useRef(0)

  const waitForOnePayButton = () => {
    const maxRetries = 20 // Try for 10 seconds (20 * 500ms)
    
    const checkButton = () => {
      const onePayBtn = document.querySelector('#onepay-btn button')
      
      if (onePayBtn) {
        console.log('OnePay button found! Clicking now...')
        setTimeout(() => {
          ;(onePayBtn as HTMLButtonElement).click()
          setIsLoading(false)
        }, 200)
      } else if (retryCountRef.current < maxRetries) {
        retryCountRef.current++
        console.log(`Waiting for OnePay button... Attempt ${retryCountRef.current}/${maxRetries}`)
        setTimeout(checkButton, 500)
      } else {
        console.error('OnePay button not found after maximum retries')
        alert('Payment gateway not ready. Please refresh the page and try again.')
        setIsLoading(false)
        initializingRef.current = false
      }
    }
    
    checkButton()
  }

  const initializeOnlinePayment = async () => {
    if (initializingRef.current) {
      console.log('Payment already initializing, skipping...')
      return
    }

    initializingRef.current = true
    setIsLoading(true)
    retryCountRef.current = 0

    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          amount,
          redirectUrl: `${window.location.origin}/booking/success`,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment')
      }

      const reference = data.data.payment.reference_number
      setPaymentReference(reference)

      // Set OnePay data
      window.onePayData = {
        appid: process.env.NEXT_PUBLIC_ONEPAY_APP_ID,
        hashToken: process.env.NEXT_PUBLIC_ONEPAY_HASH_TOKEN,
        amount: parseFloat(amount.toFixed(2)),
        orderReference: reference,
        customerFirstName: customerData.firstName,
        customerLastName: customerData.lastName,
        customerPhoneNumber: customerData.phone,
        customerEmail: customerData.email,
        transactionRedirectUrl: `${window.location.origin}/booking/success?bookingId=${bookingId}&reference=${reference}`,
        additionalData: bookingId.toString(),
        apptoken: process.env.NEXT_PUBLIC_ONEPAY_APP_TOKEN,
      }

      console.log('OnePay Data Set:', window.onePayData)

      // Wait for OnePay script to create the button
      waitForOnePayButton()
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

  useEffect(() => {
    const handleSuccess = (e: any) => {
      console.log('Payment SUCCESS:', e.detail)
      initializingRef.current = false
      
      if (onSuccess) {
        onSuccess(e.detail)
      } else {
        window.location.href = `/booking/success?bookingId=${bookingId}&reference=${paymentReference}&status=success`
      }
    }

    const handleFail = (e: any) => {
      console.log('Payment FAIL:', e.detail)
      initializingRef.current = false
      
      if (onFail) {
        onFail(e.detail)
      } else {
        alert('Payment failed. Please try again.')
      }
    }

    const handleClose = (e: any) => {
      console.log('Payment CLOSED:', e.detail)
      initializingRef.current = false
      setIsLoading(false)
    }

    window.addEventListener('onePaySuccess', handleSuccess)
    window.addEventListener('onePayFail', handleFail)
    window.addEventListener('onePayClose', handleClose)

    return () => {
      window.removeEventListener('onePaySuccess', handleSuccess)
      window.removeEventListener('onePayFail', handleFail)
      window.removeEventListener('onePayClose', handleClose)
    }
  }, [bookingId, paymentReference, onSuccess, onFail])

  return (
    <div className="space-y-4">
      {/* OnePay Script - Load first before selection */}
      <Script
        src="https://storage.googleapis.com/onepayjs/onepayjs.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('OnePay script loaded')
          setScriptReady(true)
        }}
        onError={() => {
          console.error('Failed to load OnePay script')
          alert('Failed to load payment gateway. Please refresh the page.')
        }}
      />

      {!paymentMethod && scriptReady && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Choose Payment Method</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                setPaymentMethod('online')
                initializeOnlinePayment()
              }}
              disabled={isLoading}
              className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left disabled:opacity-50"
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
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Secure</span>
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setPaymentMethod('later')
                handlePayLater()
              }}
              disabled={isLoading}
              className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left disabled:opacity-50"
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

      {!scriptReady && (
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600 mr-3" />
          <span className="text-gray-700 font-medium">Loading payment options...</span>
        </div>
      )}

      {paymentMethod === 'online' && isLoading && (
        <div className="flex items-center justify-center p-8 bg-green-50 rounded-lg border-2 border-green-200">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mr-3" />
          <div>
            <p className="text-gray-900 font-semibold">Initializing secure payment...</p>
            <p className="text-sm text-gray-600 mt-1">Please wait while we connect to OnePay</p>
          </div>
        </div>
      )}

      {/* OnePay Containers */}
      <div id="onepay-btn" style={{ display: paymentMethod === 'online' ? 'block' : 'none' }} />
      <div id="iframe-container" />
    </div>
  )
}
