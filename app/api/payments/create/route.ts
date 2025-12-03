import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { createOnePayCheckout } from '@/lib/payment/onepay'
import { z } from 'zod'

const createPaymentSchema = z.object({
  bookingId: z.number().positive(),
  redirectUrl: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, redirectUrl } = createPaymentSchema.parse(body)

    // Get booking details
    const bookingResult = await query(
      `SELECT b.*, v.name as vehicle_name 
       FROM bookings b 
       LEFT JOIN vehicles v ON b.vehicle_id = v.id 
       WHERE b.id = $1`,
      [bookingId]
    )

    if (bookingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    const booking = bookingResult.rows[0]

    // // Check if payment already exists for this booking
    // const existingPayment = await query(
    //   'SELECT * FROM payments WHERE booking_id = $1 AND status IN ($2, $3)',
    //   [bookingId, 'completed', 'processing']
    // )

    // if (existingPayment.rows.length > 0) {
    //   return NextResponse.json(
    //     { success: false, error: 'Payment already exists for this booking' },
    //     { status: 400 }
    //   )
    // }

    // Generate unique reference number
    const referenceNumber = `TPM-${Date.now()}-${bookingId}`

    // Prepare customer data
    const customerData = {
      firstName: booking.full_name.split(' ')[0] || 'Customer',
      lastName: booking.full_name.split(' ').slice(1).join(' ') || 'Name',
      phone: booking.phone,
      email: booking.email,
    }

    // Default redirect URL
    const finalRedirectUrl = redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?ref=${booking.booking_reference}`

    // Create OnePay checkout
    // OnePay integration temporarily disabled
    const onePayResponse = {
      data: {
      ipg_transaction_id: `temp-${referenceNumber}`,
      amount: {
        currency: 'USD'
      },
      gateway: {
        redirect_url: finalRedirectUrl
      }
      }
    }

    // Save payment record
    const paymentResult = await query(
      `INSERT INTO payments (
        booking_id, onepay_transaction_id, reference_number,
        amount, currency, status, redirect_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        bookingId,
        onePayResponse.data.ipg_transaction_id,
        referenceNumber,
        booking.total_price,
        onePayResponse.data.amount.currency,
        'processing',
        onePayResponse.data.gateway.redirect_url,
      ]
    )

    return NextResponse.json({
      success: true,
      data: {
        payment: paymentResult.rows[0],
        onepay: onePayResponse.data,
      },
      message: 'Payment link created successfully',
    })
  } catch (error: any) {
    console.error('Error creating payment:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create payment' },
      { status: 500 }
    )
  }
}
