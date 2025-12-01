import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { checkOnePayStatus } from '@/lib/payment/onepay'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const { transactionId } = await params

    // Check local database first
    const paymentResult = await query(
      'SELECT * FROM payments WHERE onepay_transaction_id = $1 OR reference_number = $2',
      [transactionId, transactionId]
    )

    if (paymentResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      )
    }

    const localPayment = paymentResult.rows[0]

    // Check status from OnePay API
    try {
      const onePayStatus = await checkOnePayStatus(localPayment.onepay_transaction_id)

      // Update local record if status changed
      if (onePayStatus.data.status && localPayment.status !== 'completed') {
        await query(
          `UPDATE payments 
           SET status = 'completed', paid_at = $1, updated_at = CURRENT_TIMESTAMP
           WHERE id = $2`,
          [onePayStatus.data.paid_on, localPayment.id]
        )

        // Update booking
        await query(
          `UPDATE bookings 
           SET payment_status = 'paid', updated_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [localPayment.booking_id]
        )
      }

      return NextResponse.json({
        success: true,
        data: {
          local: {
            ...localPayment,
            status: onePayStatus.data.status ? 'completed' : localPayment.status,
          },
          onepay: onePayStatus.data,
        },
      })
    } catch (error) {
      // If OnePay API fails, return local data
      return NextResponse.json({
        success: true,
        data: {
          local: localPayment,
          onepay: null,
        },
      })
    }
  } catch (error) {
    console.error('Error checking payment status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check payment status' },
      { status: 500 }
    )
  }
}
