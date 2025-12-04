import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { createOnePayCheckout } from '@/lib/utils/onepay'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function POST(request: NextRequest) {
  const client = await pool.connect()
  
  try {
    const body = await request.json()
    const { bookingId, amount, redirectUrl, customerData } = body

    // Validate required fields
    if (!bookingId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if payment already exists for this booking
    const existingPayment = await client.query(
      'SELECT * FROM payments WHERE booking_id = $1',
      [bookingId]
    )

    if (existingPayment.rows.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment already exists for this booking',
          data: existingPayment.rows[0]
        },
        { status: 400 }
      )
    }

    // Get booking details
    const bookingResult = await client.query(
      'SELECT * FROM bookings WHERE id = $1',
      [bookingId]
    )

    if (bookingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    const booking = bookingResult.rows[0]

    // Generate unique reference number
    const timestamp = Date.now()
    const reference = `TPM-${timestamp}-${bookingId}`

    // Create OnePay checkout
    const onePayResponse = await createOnePayCheckout({
      amount: Number(amount.toFixed(2)),
      reference,
      customer_first_name: customerData?.firstName || booking.full_name.split(' ')[0] || 'Customer',
      customer_last_name: customerData?.lastName || booking.full_name.split(' ').slice(1).join(' ') || 'Name',
      customer_phone_number: customerData?.phone || booking.phone || '+94000000000',
      customer_email: customerData?.email || booking.email || 'customer@example.com',
      transaction_redirect_url: redirectUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/booking/success?bookingId=${bookingId}`,
      additional_data: JSON.stringify({ bookingId, reference })
    })

    // Save payment to database
    const paymentResult = await client.query(
      `INSERT INTO payments (
        booking_id, 
        amount, 
        payment_method, 
        payment_status, 
        reference_number, 
        onepay_transaction_id,
        redirect_url,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
      RETURNING *`,
      [
        bookingId,
        amount,
        'onepay',
        'pending',
        reference,
        onePayResponse.data.ipg_transaction_id,
        onePayResponse.data.gateway.redirect_url
      ]
    )

    return NextResponse.json({
      success: true,
      data: {
        payment: paymentResult.rows[0],
        onepay: onePayResponse.data
      }
    })
  } catch (error: any) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create payment' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
