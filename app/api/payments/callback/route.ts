import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function POST(request: NextRequest) {
  const client = await pool.connect()
  
  try {
    const body = await request.json()
    const { transaction_id, status, status_message, additional_data } = body

    console.log('OnePay Callback received:', body)

    // Update payment status
    const paymentResult = await client.query(
      `UPDATE payments 
       SET payment_status = $1,
           paid_at = $2,
           updated_at = NOW()
       WHERE onepay_transaction_id = $3
       RETURNING *`,
      [
        status === 1 ? 'completed' : 'failed',
        status === 1 ? new Date() : null,
        transaction_id
      ]
    )

    if (paymentResult.rows.length === 0) {
      console.error('Payment not found for transaction:', transaction_id)
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      )
    }

    const payment = paymentResult.rows[0]

    // Update booking status if payment successful
    if (status === 1) {
      await client.query(
        `UPDATE bookings 
         SET status = 'confirmed',
             payment_status = 'paid',
             updated_at = NOW()
         WHERE id = $1`,
        [payment.booking_id]
      )
    }

    // Log callback
    await client.query(
      `INSERT INTO payment_logs (
        payment_id,
        transaction_id,
        status,
        status_message,
        additional_data,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, NOW())`,
      [
        payment.id,
        transaction_id,
        status,
        status_message,
        additional_data
      ]
    )

    return NextResponse.json({
      success: true,
      message: 'Callback processed successfully'
    })
  } catch (error: any) {
    console.error('Callback processing error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process callback' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
