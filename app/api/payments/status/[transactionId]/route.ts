import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { getOnePayTransactionStatus } from '@/lib/utils/onepay'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET(
  request: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  const client = await pool.connect()
  
  try {
    const { transactionId } = params

    // Get payment status from OnePay
    const statusResponse = await getOnePayTransactionStatus(transactionId)

    // Update payment in database
    await client.query(
      `UPDATE payments 
       SET payment_status = $1, 
           paid_at = $2,
           updated_at = NOW()
       WHERE onepay_transaction_id = $3`,
      [
        statusResponse.data.status ? 'completed' : 'pending',
        statusResponse.data.paid_on,
        transactionId
      ]
    )

    // If payment is completed, update booking status
    if (statusResponse.data.status) {
      const paymentResult = await client.query(
        'SELECT booking_id FROM payments WHERE onepay_transaction_id = $1',
        [transactionId]
      )

      if (paymentResult.rows.length > 0) {
        await client.query(
          `UPDATE bookings 
           SET status = 'confirmed', 
               payment_status = 'paid',
               updated_at = NOW()
           WHERE id = $1`,
          [paymentResult.rows[0].booking_id]
        )
      }
    }

    return NextResponse.json({
      success: true,
      data: statusResponse.data
    })
  } catch (error: any) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to check payment status' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
