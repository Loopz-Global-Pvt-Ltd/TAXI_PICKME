"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, CreditCard } from 'lucide-react'

interface OnePayButtonSimpleProps {
  bookingId: number
  amount: number
  customerData: {
    firstName: string
    lastName: string
    phone: string
    email: string
  }
}

export default function OnePayButtonSimple({
  bookingId,
  amount,
  customerData,
}: OnePayButtonSimpleProps) {
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      // Get payment hash from backend
      const response = await fetch('/api/payments/create-hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          amount,
          customerData,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment')
      }

      // Submit form to OnePay
      if (formRef.current) {
        // Populate form fields
        const form = formRef.current
        
        // Set all the values
        ;(form.elements.namedItem('appid') as HTMLInputElement).value = data.appid
        ;(form.elements.namedItem('amount') as HTMLInputElement).value = amount.toFixed(2)
        ;(form.elements.namedItem('reference') as HTMLInputElement).value = data.reference
        ;(form.elements.namedItem('customer_first_name') as HTMLInputElement).value = customerData.firstName
        ;(form.elements.namedItem('customer_last_name') as HTMLInputElement).value = customerData.lastName
        ;(form.elements.namedItem('customer_phone_number') as HTMLInputElement).value = customerData.phone
        ;(form.elements.namedItem('customer_email') as HTMLInputElement).value = customerData.email
        ;(form.elements.namedItem('transaction_redirect_url') as HTMLInputElement).value = data.redirectUrl
        ;(form.elements.namedItem('hash') as HTMLInputElement).value = data.hash
        ;(form.elements.namedItem('currency') as HTMLInputElement).value = 'LKR'

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
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg font-bold shadow-lg transition-all"
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

      {/* Hidden form for OnePay */}
      <form
        ref={formRef}
        action="https://payment.onepay.lk/api/v1/checkout"
        method="POST"
        style={{ display: 'none' }}
      >
        <input type="hidden" name="appid" />
        <input type="hidden" name="amount" />
        <input type="hidden" name="reference" />
        <input type="hidden" name="customer_first_name" />
        <input type="hidden" name="customer_last_name" />
        <input type="hidden" name="customer_phone_number" />
        <input type="hidden" name="customer_email" />
        <input type="hidden" name="transaction_redirect_url" />
        <input type="hidden" name="hash" />
        <input type="hidden" name="currency" />
      </form>
    </>
  )
}
