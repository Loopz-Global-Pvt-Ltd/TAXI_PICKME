"use client"

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { Loader2 } from 'lucide-react'

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
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentReference, setPaymentReference] = useState<string>('')
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Initialize payment data
  useEffect(() => {
    const initializePayment = async () => {
      try {
        // Create payment reference first
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

        // Set OnePay data BEFORE loading the script
        window.onePayData = {
          appid: process.env.NEXT_PUBLIC_ONEPAY_APP_ID,
          hashToken: process.env.NEXT_PUBLIC_ONEPAY_HASH_TOKEN,
          amount: amount.toFixed(1), // Must be decimal with .0
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
        setIsLoading(false)
      } catch (error: any) {
        console.error('Payment initialization error:', error)
        alert(error.message || 'Failed to initialize payment')
        setIsLoading(false)
      }
    }

    initializePayment()
  }, [bookingId, amount, customerData])

  // Setup event listeners ONCE
  useEffect(() => {
    const handleOnePaySuccess = (e: CustomEvent) => {
      console.log('Payment SUCCESS:', e.detail)
      setIsProcessing(false)
      
      if (onSuccess) {
        onSuccess(e.detail)
      } else {
        window.location.href = `/booking/success?bookingId=${bookingId}&reference=${paymentReference}&status=success`
      }
    }

    const handleOnePayFail = (e: CustomEvent) => {
      console.log('Payment FAIL:', e.detail)
      setIsProcessing(false)
      
      if (onFail) {
        onFail(e.detail)
      } else {
        alert('Payment failed. Please try again.')
      }
    }

    const handleOnePayClose = (e: CustomEvent) => {
      console.log('Payment CLOSED:', e.detail)
      setIsProcessing(false)
    }

    window.addEventListener('onePaySuccess' as any, handleOnePaySuccess)
    window.addEventListener('onePayFail' as any, handleOnePayFail)
    window.addEventListener('onePayClose' as any, handleOnePayClose)

    return () => {
      window.removeEventListener('onePaySuccess' as any, handleOnePaySuccess)
      window.removeEventListener('onePayFail' as any, handleOnePayFail)
      window.removeEventListener('onePayClose' as any, handleOnePayClose)
    }
  }, [bookingId, paymentReference, onSuccess, onFail])

  // Trigger button creation after script loads
  const handleScriptLoad = () => {
    console.log('OnePay script loaded successfully')
    console.log('window.onePayData:', window.onePayData)
    setScriptLoaded(true)
    
    // Force button creation if not auto-created
    if (typeof (window as any).createOnePayButton === 'function') {
      (window as any).createOnePayButton()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-green-600 mr-3" />
        <span className="text-gray-700">Initializing payment gateway...</span>
      </div>
    )
  }

  return (
    <>
      {/* Load OnePay Script ONLY AFTER data is set */}
      {!scriptLoaded && (
        <Script
          src="https://storage.googleapis.com/onepayjs/onepayjs.js"
          strategy="afterInteractive"
          onLoad={handleScriptLoad}
          onError={() => {
            console.error('Failed to load OnePay script')
            alert('Failed to load payment gateway. Please refresh the page.')
          }}
        />
      )}

      <div style={{ margin: '20px 0' }}>
        {/* OnePay will inject its button here */}
        <div id="onepay-btn"></div>
        
        {/* OnePay iframe container */}
        <div id="iframe-container"></div>

        {/* Debug info - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', fontSize: '12px' }}>
            <strong>Debug Info:</strong>
            <div>Script Loaded: {scriptLoaded ? 'Yes' : 'No'}</div>
            <div>Payment Reference: {paymentReference}</div>
            <div>Amount: {amount.toFixed(1)} LKR</div>
            <div>App ID: {process.env.NEXT_PUBLIC_ONEPAY_APP_ID}</div>
          </div>
        )}
      </div>
    </>
  )
}