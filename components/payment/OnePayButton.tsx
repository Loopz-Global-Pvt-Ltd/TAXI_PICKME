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

export default function OnePayButton({
  bookingId,
  amount,
  customerData,
  onSuccess,
  onFail,
}: OnePayButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      // Create payment via our API
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          redirectUrl: `${window.location.origin}/booking/success`,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      // Set payment data for OnePay
      const onePayData = {
        appid: process.env.NEXT_PUBLIC_ONEPAY_APP_ID,
        amount: amount,
        orderReference: data.data.payment.reference_number,
        customerFirstName: customerData.firstName,
        customerLastName: customerData.lastName,
        customerPhoneNumber: customerData.phone,
        customerEmail: customerData.email,
        transactionRedirectUrl: `${window.location.origin}/booking/success`,
        additionalData: bookingId.toString(),
        apptoken: process.env.NEXT_PUBLIC_ONEPAY_APP_TOKEN,
        currency: process.env.NEXT_PUBLIC_ONEPAY_CURRENCY || 'LKR',
      }

      setPaymentData(onePayData)

      // Expose data to window for OnePay script
      ;(window as any).onePayData = onePayData

      // Trigger OnePay button click
      setTimeout(() => {
        const onePayBtn = document.querySelector('#onepay-btn button')
        if (onePayBtn) {
          ;(onePayBtn as HTMLButtonElement).click()
        }
      }, 500)
    } catch (error: any) {
      console.error('Payment error:', error)
      alert(error.message || 'Failed to initialize payment')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!scriptLoaded) return

    // Add event listeners for OnePay callbacks
    const handleSuccess = (e: any) => {
      console.log('Payment SUCCESS:', e.detail)
      if (onSuccess) onSuccess(e.detail)
    }

    const handleFail = (e: any) => {
      console.log('Payment FAIL:', e.detail)
      if (onFail) onFail(e.detail)
    }

    window.addEventListener('onePaySuccess', handleSuccess)
    window.addEventListener('onePayFail', handleFail)

    return () => {
      window.removeEventListener('onePaySuccess', handleSuccess)
      window.removeEventListener('onePayFail', handleFail)
    }
  }, [scriptLoaded, onSuccess, onFail])

  return (
    <>
      <Script
        src="https://storage.googleapis.com/onepayjs/onepayjs.js"
        onLoad={() => setScriptLoaded(true)}
      />

      <div>
        <Button
          onClick={handlePayment}
          disabled={isLoading || !scriptLoaded}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              Pay LKR {Number(amount).toFixed(2)} with OnePay
            </>
          )}
        </Button>

        {/* OnePay button container (hidden) */}
        <div id="onepay-btn" style={{ display: 'none' }} />
        <div id="iframe-container" />
      </div>
    </>
  )
}
