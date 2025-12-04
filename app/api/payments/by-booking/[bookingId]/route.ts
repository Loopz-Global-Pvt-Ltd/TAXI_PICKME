import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const client = await pool.connect()
  
  try {
    const { bookingId } = await params

    const result = await client.query(
      'SELECT * FROM payments WHERE booking_id = $1 ORDER BY created_at DESC LIMIT 1',
      [bookingId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error: any) {
    console.error('Error fetching payment:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch payment' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
