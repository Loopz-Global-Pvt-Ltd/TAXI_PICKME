"use client"

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { Button } from '@/components/ui/button'
import { Loader2, CreditCard } from 'lucide-react'

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
}

// Extend Window interface to include onePayData
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
}: OnePayButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [paymentReference, setPaymentReference] = useState<string>('')

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      // Create payment reference via API
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

      // Prepare OnePay data
      const onePayData = {
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
        currency: process.env.NEXT_PUBLIC_ONEPAY_CURRENCY || 'LKR',
      }

      console.log('OnePay Data:', onePayData)

      // Expose data globally for OnePay script
      window.onePayData = onePayData

      // Trigger OnePay button click after data is set
      setTimeout(() => {
        const onePayBtn = document.querySelector('#onepay-btn button')
        if (onePayBtn) {
          console.log('Triggering OnePay button click')
          ;(onePayBtn as HTMLButtonElement).click()
        } else {
          console.error('OnePay button not found')
          throw new Error('Payment gateway not initialized properly')
        }
      }, 500)
    } catch (error: any) {
      console.error('Payment error:', error)
      alert(error.message || 'Failed to initialize payment')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!scriptLoaded) return

    // Setup OnePay event listeners
    const handleOnePaySuccess = (e: CustomEvent) => {
      const successData = e.detail
      console.log('Payment SUCCESS:', successData)
      setIsLoading(false)
      
      if (onSuccess) {
        onSuccess(successData)
      } else {
        // Default success handler - redirect to success page
        window.location.href = `/booking/success?bookingId=${bookingId}&reference=${paymentReference}&status=success`
      }
    }

    const handleOnePayFail = (e: CustomEvent) => {
      const failData = e.detail
      console.log('Payment FAIL:', failData)
      setIsLoading(false)
      
      if (onFail) {
        onFail(failData)
      } else {
        // Default fail handler
        alert('Payment failed. Please try again.')
      }
    }

    window.addEventListener('onePaySuccess' as any, handleOnePaySuccess)
    window.addEventListener('onePayFail' as any, handleOnePayFail)

    return () => {
      window.removeEventListener('onePaySuccess' as any, handleOnePaySuccess)
      window.removeEventListener('onePayFail' as any, handleOnePayFail)
    }
  }, [scriptLoaded, bookingId, paymentReference, onSuccess, onFail])

  return (
    <>
      {/* Load OnePay Script */}
      <Script
        src="https://storage.googleapis.com/onepayjs/onepayjs.js"
        onLoad={() => {
          console.log('OnePay script loaded successfully')
          setScriptLoaded(true)
        }}
        onError={() => {
          console.error('Failed to load OnePay script')
          alert('Failed to load payment gateway. Please refresh the page.')
        }}
      />

      <div>
        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={isLoading || !scriptLoaded}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!scriptLoaded ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading Payment Gateway...
            </>
          ) : isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              Pay Rs. {Number(amount).toFixed(2)}
            </>
          )}
        </Button>

        {/* OnePay Required Containers */}
        <div id="onepay-btn" style={{ display: 'none' }} />
        <div id="iframe-container" />
      </div>
    </>
  )
}
