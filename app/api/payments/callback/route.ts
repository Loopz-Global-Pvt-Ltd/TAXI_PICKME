import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { validateOnePayCallback, type OnePayCallbackData } from '@/lib/payment/onepay'

export async function POST(request: NextRequest) {
  try {
    const callbackData: OnePayCallbackData = await request.json()

    console.log('OnePay Callback Received:', callbackData)

    // Validate callback data
    if (!validateOnePayCallback(callbackData)) {
      return NextResponse.json(
        { success: false, error: 'Invalid callback data' },
        { status: 400 }
      )
    }

    // Find payment record
    const paymentResult = await query(
      'SELECT * FROM payments WHERE onepay_transaction_id = $1',
      [callbackData.transaction_id]
    )

    if (paymentResult.rows.length === 0) {
      console.error('Payment not found for transaction:', callbackData.transaction_id)
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      )
    }

    const payment = paymentResult.rows[0]

    // Determine status based on callback
    const isSuccess = callbackData.status === 1 && callbackData.status_message === 'SUCCESS'
    const paymentStatus = isSuccess ? 'completed' : 'failed'

    // Update payment record
    await query(
      `UPDATE payments 
       SET status = $1, callback_data = $2, paid_at = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [
        paymentStatus,
        JSON.stringify(callbackData),
        isSuccess ? new Date() : null,
        payment.id,
      ]
    )

    // Update booking payment status
    if (isSuccess) {
      await query(
        `UPDATE bookings 
         SET payment_status = 'paid', payment_method = 'onepay', updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [payment.booking_id]
      )
    }

    console.log(`Payment ${payment.reference_number} updated to ${paymentStatus}`)

    return NextResponse.json({
      success: true,
      message: 'Callback processed successfully',
    })
  } catch (error) {
    console.error('Error processing OnePay callback:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process callback' },
      { status: 500 }
    )
  }
}
