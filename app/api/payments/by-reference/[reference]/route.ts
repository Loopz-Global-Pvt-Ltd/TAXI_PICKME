import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET(
  request: NextRequest,
  { params }: { params: { reference: string } }
) {
  const client = await pool.connect()
  
  try {
    const { reference } = params

    const result = await client.query(
      'SELECT * FROM payments WHERE reference_number = $1',
      [reference]
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
