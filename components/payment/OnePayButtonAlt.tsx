"use client"

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, CreditCard } from 'lucide-react'

interface OnePayButtonAltProps {
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

export default function OnePayButtonAlt({
  bookingId,
  amount,
  customerData,
  onSuccess,
  onFail,
}: OnePayButtonAltProps) {
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      // Create payment via API
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
        throw new Error(data.error || 'Failed to create payment')
      }

      // Create and submit hidden form to OnePay
      const form = formRef.current
      if (form) {
        // Set form values
        const inputs = {
          appid: process.env.NEXT_PUBLIC_ONEPAY_APP_ID,
          amount: amount.toFixed(2),
          orderReference: data.data.payment.reference_number,
          customerFirstName: customerData.firstName,
          customerLastName: customerData.lastName,
          customerPhoneNumber: customerData.phone,
          customerEmail: customerData.email,
          transactionRedirectUrl: `${window.location.origin}/booking/success?bookingId=${bookingId}`,
          additionalData: bookingId.toString(),
          currency: process.env.NEXT_PUBLIC_ONEPAY_CURRENCY || 'LKR',
          hash: data.data.payment.hash, // Generated from backend
        }

        // Clear existing inputs
        form.innerHTML = ''

        // Add inputs to form
        Object.entries(inputs).forEach(([key, value]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = String(value || '')
          form.appendChild(input)
        })

        // Submit form
        form.submit()
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      alert(error.message || 'Failed to initialize payment')
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg font-bold shadow-lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Redirecting to Payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Pay Rs. {Number(amount).toFixed(2)}
          </>
        )}
      </Button>

      {/* Hidden form for OnePay submission */}
      <form
        ref={formRef}
        action="https://payment.onepay.lk/payment"
        method="POST"
        style={{ display: 'none' }}
      />
    </>
  )
}
